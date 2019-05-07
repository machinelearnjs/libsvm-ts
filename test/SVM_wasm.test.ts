import { SVM } from '../src/SVM';
import { KernelTypes, SVMTypes } from '../src/types/Commands';

describe('SVM:wasm', () => {
  test('should train using XOR data and predict using RBF kernel and C_SVC', () => {
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
      model: 5251776,
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

    return svm.loadWASM().then((loadedSVM) => {
      loadedSVM.train({ samples: features, labels });
      expect(loadedSVM.toJSON()).toEqual(expected);

      for (let i = 0; i < features.length; i++) {
        const pred = svm.predictOne({ sample: features[i] });
        expect(pred).toBe(labels[i]);
      }
    });
  });
});
