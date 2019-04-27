'use strict';

const fs = require('fs');
const path = require('path');

const SVM = require('../wasm');

SVM.then((S) => {
  const svm = new S({
    type: 'C_SVC',
    kernel: 'LINEAR',
    epsilon: 0.001,
    quiet: false,
    probabilityEstimates: true
  });
  svm.train(['test'], [1]);
});

/*let data = fs.readFileSync(
  path.join(__dirname, './bodyfat_scale.txt'),
  'utf-8'
);
data = data.split('\n').map((line) => line.split(' ').filter((el) => el));
let labels = data.map((line) => +line.splice(0, 1)[0]);
const features = data.map((line) => line.map((el) => +el.split(':')[1]));

const svm = new SVM({
  type: SVM.SVM_TYPES.EPSILON_SVR,
  kernel: SVM.KERNEL_TYPES.RBF,
  epsilon: 0.001,
  quiet: false,
  probabilityEstimates: true
});

svm.train(features, labels);
console.log(svm.predictInterval(features, 0.99));
fs.writeFileSync(path.join(__dirname, 'bodyfat.model'), svm.serializeModel());

// svm.crossValidation(features, labels);
*/

