import { SVM } from "./SVM";
import {KernelTypes, SVMTypes} from "./types/Commands";

const svm = new SVM({
  type: SVMTypes.C_SVC,
  kernel: KernelTypes.RBF,
  gamma: 1,
  cost: 1,
});

svm.load().then((svm) => {
  const features = [[0, 0], [1, 1], [1, 0], [0, 1]];
  const labels = [0, 0, 1, 1];
  console.log('loaded svm');
  svm.train({ samples: features, labels });
});
