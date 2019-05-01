import { SVM } from '../src/SVM';
import { KernelTypes, SVMTypes } from '../src/types/Commands';
import { getSandboxEnv } from "./Sandbox";

describe('SVM', () => {

  describe('.train(...)', () => {
    test.only('should train using XOR data', () => {
      const svm = new SVM({
        type: SVMTypes.C_SVC,
        kernel: KernelTypes.LINEAR,
        epsilon: 0.001,
        quiet: false,
        probabilityEstimates: true,
      });
      return svm.load()
        .then((svm) => {
          console.log('checking svm');
        });
    });
  });
});
