import * as fs from 'fs';
import * as path from 'path';
import { SVM } from '../src/SVM';
import { KernelTypes, SVMTypes } from '../src/types/Commands';

describe('SVM', () => {
  let svm: SVM;
  let bodyFatFeatures;
  let bodyFatLabels;

  beforeEach(() => {
    svm = new SVM({
      type: SVMTypes.C_SVC,
      kernel: KernelTypes.LINEAR,
      epsilon: 0.001,
      quiet: false,
      probabilityEstimates: true,
    });
    const bodyFatData = fs.readFileSync(path.join(__dirname, '../samples/bodyfat_scale.txt'), 'utf-8');
    const splitBodyFatData = bodyFatData.split('\n').map((line) => line.split(' ').filter((el) => el));
    bodyFatLabels = splitBodyFatData.map((line) => +line.splice(0, 1)[0]);
    bodyFatFeatures = splitBodyFatData.map((line) => line.map((el) => +el.split(':')[1]));
  });

  describe('.train(...)', () => {
    it('should train using XOR data', () => {
      svm.train({ samples: bodyFatFeatures, labels: bodyFatLabels });
    });
  });
});
