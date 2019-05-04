export enum SVMTypes {
  C_SVC = 'C_SVC', // C support vector classification
  NU_SVC = 'NU_SVC', // NU support vector classification
  ONE_CLASS = 'ONE_CLASS', // ONE CLASS classification
  EPSILON_SVR = 'EPSILON_SVR', // Epsilon support vector regression
  NU_SVR = 'NU_SVR', // Nu support vector regression
}

export enum KernelTypes {
  LINEAR = 'LINEAR',
  POLYNOMIAL = 'POLYNOMIAL',
  RBF = 'RBF', // Radial basis function
  SIGMOID = 'SIGMOID',
  PRECOMPUTED = 'PRECOMPUTED',
}

export interface CommandArguments {
  quiet?: boolean;
  type?: SVMTypes;
  kernel?: KernelTypes;
  degree?: number;
  gamma?: number;
  coef0?: number;
  cost?: number;
  nu?: number;
  epsilon?: number;
  cacheSize?: number;
  tolerance?: number;
  shrinking?: boolean;
  probabilityEstimates?: boolean;
  weight?: { [n: number]: number };
}
