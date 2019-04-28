import { UtilError } from './Errors';
import { CommandArguments } from './types/Commands';

const mapOptionToCommand = {
  quiet: 'q',
  type: 's',
  kernel: 't',
  degree: 'd',
  gamma: 'g',
  coef0: 'r',
  cost: 'c',
  nu: 'n',
  epsilon: 'p',
  cacheSize: 'm',
  tolerance: 'e',
  shrinking: 'h',
  probabilityEstimates: 'b',
  weight: 'w',
};

/**
 * SVM classification and regression types
 * @memberof SVM
 * @type {{C_SVC: string, NU_SVC: string, ONE_CLASS: string, EPSILON_SVR: string, NU_SVR: string}}
 * @property C_SVC - The C support vector classifier type
 * @property NU_SVC - The nu support vector classifier type
 * @property ONE_CLASS - The one-class support vector classifier type
 * @property EPSILON_SVR - The epsilon support vector regression type
 * @property NU_SVR - The nu support vector regression type
 */
const mapSVMTypesToValue = {
  C_SVC: '0', // C support vector classification
  NU_SVC: '1', // NU support vector classification
  ONE_CLASS: '2', // ONE CLASS classification
  EPSILON_SVR: '3', // Epsilon support vector regression
  NU_SVR: '4', // Nu support vector regression
};

/**
 * SVM kernel types
 * @memberof SVM
 * @type {{LINEAR: string, POLYNOMIAL: string, RBF: string, SIGMOID: string}}
 * @property LINEAR - Linear kernel
 * @property POLYNOMIAL - Polynomial kernel
 * @property RBF - Radial basis function (gaussian) kernel
 * @property SIGMOID - Sigmoid kernel
 */
const mapKernelTypesToValue = {
  LINEAR: '0',
  POLYNOMIAL: '1',
  RBF: '2', // Radial basis function
  SIGMOID: '3',
  PRECOMPUTED: '4',
};

export function getCommand(options: CommandArguments) {
  let str = '';
  const keys = Object.keys(options);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (options[key] == null) {
      continue;
    }
    if (mapOptionToCommand[key] == null) {
      throw new UtilError('Bad option');
    }

    // Adding an empty space before append a new command
    if (str) {
      str += ' ';
    }

    // Handling each key
    switch (key) {
      case 'probabilityEstimates':
      case 'shrinking':
        str += `-${mapOptionToCommand[key]} ${options[key] ? 1 : 0}`;
        break;
      case 'quiet': {
        if (options[key]) {
          str += `-${mapOptionToCommand[key]} 1`;
        }
        break;
      }
      case 'weight': {
        const weightKeys = Object.keys(options.weight);
        for (let j = 0; j < weightKeys.length; j++) {
          if (j !== 0) {
            str += ' ';
          }
          str += `-w${weightKeys[j]} ${options.weight[weightKeys[j]]}`;
        }
        break;
      }
      case 'kernel':
        console.log('kernel', mapOptionToCommand[key], '  ', options[key], '  ', mapKernelTypesToValue[options[key]]);
        str += `-${mapOptionToCommand[key]} ${mapKernelTypesToValue[options[key]]}`;
        break;
      case 'type':
        str += `-${mapOptionToCommand[key]} ${mapSVMTypesToValue[options[key]]}`;
        break;
      default: {
        str += `-${mapOptionToCommand[key]} ${options[key]}`;
        break;
      }
    }
  }

  return str;
}
