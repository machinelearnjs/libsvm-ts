import { SVM } from '../src/SVM';
import { KernelTypes, SVMTypes } from '../src/types/Commands';

describe('SVM', () => {
  describe('.train(...)', () => {
    test('should train using XOR data', () => {
      const svm = new SVM({
        type: SVMTypes.C_SVC,
        kernel: KernelTypes.LINEAR,
        epsilon: 0.001,
        quiet: false,
        probabilityEstimates: true,
      });
      const features = [[0, 0], [1, 1], [1, 0], [0, 1]];
      const labels = [0, 0, 1, 1];

      const expected = {
        model: 5251776,
        options: {
          type: 'C_SVC',
          kernel: 'LINEAR',
          epsilon: 0.001,
          quiet: false,
          probabilityEstimates: true,
        },
        loaded: true,
      };

      return svm.load().then((loadedSVM) => {
        loadedSVM.train({ samples: features, labels });
        expect(loadedSVM.toJSON()).toEqual(expected);
      });
    });
  });
});
