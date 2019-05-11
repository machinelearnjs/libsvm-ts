import * as fs from 'fs';
import * as path from 'path';
import { SVM } from '../src/SVM';
import { KernelTypes, SVMTypes } from '../src/types/Commands';

describe('SVM:asm', () => {
  describe('.predictOne(...)', () => {
    it('should train using XOR data using RBF kernel and C_SVC', () => {
      const svm = new SVM({
        type: SVMTypes.C_SVC,
        kernel: KernelTypes.RBF,
        gamma: 1,
        cost: 1,
        quiet: true,
        probabilityEstimates: true,
      });
      const features = [[0, 0], [1, 1], [1, 0], [0, 1]];
      const labels = [0, 0, 1, 1];

      const expected = {
        model: 5251664,
        options: {
          type: 'C_SVC',
          kernel: 'RBF',
          gamma: 1,
          cost: 1,
          quiet: true,
          probabilityEstimates: true,
        },
        loaded: true,
        problem: 5251256,
      };

      svm.loadASM().then((loadedSVM) => {
        loadedSVM.train({ samples: features, labels });
        expect(svm.toJSON()).toEqual(expected);

        for (let i = 0; i < features.length; i++) {
          const pred = loadedSVM.predictOne({ sample: features[i] });
          expect(pred).toBe(labels[i]);
        }
      });
    });

    it('should train using ONE_CLASS and RBF kernel on random values', () => {
      const svm = new SVM({
        kernel: KernelTypes.RBF,
        type: SVMTypes.ONE_CLASS,
        gamma: 1,
        cost: 1,
        nu: 0.1,
        quiet: true,
      });

      const features = [[0, 0], [1, 1], [1, 0], [0, 1]];
      const toPredict = [[0.5, 0.5], [1.5, 1]];
      const expected = [1, -1];
      const labels = [0, 0, 0, 0];

      const expectedModel = {
        model: null,
        options: {
          kernel: 'RBF',
          type: 'ONE_CLASS',
          gamma: 1,
          cost: 1,
          nu: 0.1,
          quiet: true,
        },
        loaded: false,
      };

      expect(svm.toJSON()).toMatchObject(expectedModel);

      svm.loadASM().then((loadedSVM) => {
        loadedSVM.train({ samples: features, labels });
        for (let i = 0; i < toPredict.length; i++) {
          const pred = loadedSVM.predictOne({ sample: toPredict[i] });
          expect(pred).toBe(expected[i]);
        }
      });
    });
  });

  describe('.predict(...)', () => {
    it('should predict bodyfat scale dataset using C_SVC and LINEAR', () => {
      const rawData = fs.readFileSync(path.join(__dirname, '../samples/bodyfat_scale.txt'), 'utf-8');
      const data = rawData.split('\n').map((line) => line.split(' ').filter((el) => el));
      const labels = data.map((line) => +line.splice(0, 1)[0]);
      const features = data.map((line) => line.map((el) => +el.split(':')[1]));

      const svm = new SVM({
        type: SVMTypes.C_SVC,
        kernel: KernelTypes.LINEAR,
        epsilon: 0.001,
        quiet: true,
        probabilityEstimates: true,
      });
      svm.loadASM().then((loadedSVM) => {
        loadedSVM.train({ samples: features, labels });
        const predResult = loadedSVM.predict({
          samples: [features[0], features[1]],
        });
        expect(predResult).toBeTruthy();
      });
    });
  });
});
