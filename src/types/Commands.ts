export interface CommandArguments {
  quiet?: boolean;
  type?: number;
  kernel?: number;
  degree?: number;
  gamma?: string;
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
