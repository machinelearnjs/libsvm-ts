import { SVM } from '../src/SVM';
import { KernelTypes, SVMTypes } from '../src/types/Commands';

describe('SVM:asm', () => {
  test('should train using XOR data using RBF kernel and C_SVC', () => {
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

  test('should train using ONE_CLASS and RBF kernel on random values', () => {
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
