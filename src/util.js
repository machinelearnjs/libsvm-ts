"use strict";
exports.__esModule = true;
var Errors_1 = require("./Errors");
var mapOptionToCommand = {
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
    weight: 'w'
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
var mapSVMTypesToValue = {
    C_SVC: '0',
    NU_SVC: '1',
    ONE_CLASS: '2',
    EPSILON_SVR: '3',
    NU_SVR: '4'
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
var mapKernelTypesToValue = {
    LINEAR: '0',
    POLYNOMIAL: '1',
    RBF: '2',
    SIGMOID: '3',
    PRECOMPUTED: '4'
};
function getCommand(options) {
    var str = '';
    var keys = Object.keys(options);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (options[key] == null) {
            continue;
        }
        if (mapOptionToCommand[key] == null) {
            throw new Errors_1.UtilError('Bad option');
        }
        // Adding an empty space before append a new command
        if (str) {
            str += ' ';
        }
        // Handling each key
        switch (key) {
            case 'probabilityEstimates':
            case 'shrinking':
                str += "-" + mapOptionToCommand[key] + " " + (options[key] ? 1 : 0);
                break;
            case 'quiet': {
                if (options[key]) {
                    str += "-" + mapOptionToCommand[key] + " 1";
                }
                break;
            }
            case 'weight': {
                var weightKeys = Object.keys(options.weight);
                for (var j = 0; j < weightKeys.length; j++) {
                    if (j !== 0) {
                        str += ' ';
                    }
                    str += "-w" + weightKeys[j] + " " + options.weight[weightKeys[j]];
                }
                break;
            }
            case 'kernel':
                console.log('kernel', mapOptionToCommand[key], '  ', options[key], '  ', mapKernelTypesToValue[options[key]]);
                str += "-" + mapOptionToCommand[key] + " " + mapKernelTypesToValue[options[key]];
                break;
            case 'type':
                str += "-" + mapOptionToCommand[key] + " " + mapSVMTypesToValue[options[key]];
                break;
            default: {
                str += "-" + mapOptionToCommand[key] + " " + options[key];
                break;
            }
        }
    }
    return str;
}
exports.getCommand = getCommand;
