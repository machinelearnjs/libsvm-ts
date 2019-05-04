'use strict';

const fs = require('fs');
const path = require('path');
const SVM = require('..');

let data = fs.readFileSync(
  path.join(__dirname, './bodyfat_scale.txt'),
  'utf-8'
);

data = data.split('\n').map((line) => line.split(' ').filter((el) => el));
let labels = data.map((line) => +line.splice(0, 1)[0]);
const features = data.map((line) => line.map((el) => +el.split(':')[1]));

const svm = new SVM({
  type: 'C_SVC',
  kernel: 'LINEAR',
  epsilon: 0.001,
  quiet: false,
  probabilityEstimates: true
});

svm.load().then((loadedSVM) => {
  loadedSVM.train({ samples: features, labels});
  console.log(svm.predictInterval({ samples: features, confidence: 0.99 }));
  fs.writeFileSync(path.join(__dirname, 'bodyfat.model'), svm.serializeModel());
});
