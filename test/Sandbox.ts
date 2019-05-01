import { SVM } from '../src/SVM';
import * as fs from "fs";
import * as path from "path";

export async function getSandboxEnv(svm: SVM, f: (args: { svm: SVM, bodyFatFeatures: number[][], bodyFatLabels: number[] }) => Promise<unknown>): Promise<unknown> {
  const loadedSvm = await svm.load();
  const bodyFatData = fs.readFileSync(path.join(__dirname, '../samples/bodyfat_scale.txt'), 'utf-8');
  const splitBodyFatData = bodyFatData.split('\n').map((line) => line.split(' ').filter((el) => el));
  const bodyFatLabels = splitBodyFatData.map((line) => +line.splice(0, 1)[0]);
  const bodyFatFeatures = splitBodyFatData.map((line) => line.map((el) => +el.split(':')[1]));
  return await f({ svm: loadedSvm, bodyFatFeatures, bodyFatLabels });
}
