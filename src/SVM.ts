import libsvm from '../out/wasm/libsvm';
import { SVMError } from './Errors';
import { CommandArguments } from './types/Commands';
import { getCommand } from './Util';

export class SVM {
  private predict_one;
  private predict_one_probability;
  private add_instance;
  private create_svm_nodes;
  private train_problem;
  private svm_get_nr_sv;
  private svm_get_nr_class;
  private svm_get_sv_indices;
  private svm_get_labels;
  private svm_free_model;
  private svm_cross_validation;
  private svm_get_svr_probability;
  private free_problem;
  private serialize_model;
  private deserialize_model;
  private options;
  private model;
  private deserialized: boolean;
  private problem;

  constructor(args: { options: CommandArguments; model: any }) {
    this.predict_one = libsvm.cwrap('libsvm_predict_one', 'number', ['number', 'array', 'number']);
    this.predict_one_probability = libsvm.cwrap('libsvm_predict_one_probability', 'number', [
      'number',
      'array',
      'number',
      'number',
    ]);
    this.add_instance = libsvm.cwrap('add_instance', null, ['number', 'array', 'number', 'number', 'number']);
    this.create_svm_nodes = libsvm.cwrap('create_svm_nodes', 'number', ['number', 'number']);
    this.train_problem = libsvm.cwrap('libsvm_train_problem', 'number', ['number', 'string']);
    this.svm_get_nr_sv = libsvm.cwrap('svm_get_nr_sv', 'number', ['number']);
    this.svm_get_nr_class = libsvm.cwrap('svm_get_nr_class', 'number', ['number']);
    this.svm_get_sv_indices = libsvm.cwrap('svm_get_sv_indices', null, ['number', 'number']);
    this.svm_get_labels = libsvm.cwrap('svm_get_labels', null, ['number', 'number']);
    this.svm_free_model = libsvm.cwrap('svm_free_model', null, ['number']);
    this.svm_cross_validation = libsvm.cwrap('libsvm_cross_validation', null, ['number', 'string', 'number', 'number']);
    this.svm_get_svr_probability = libsvm.cwrap('svm_get_svr_probability', null, ['number']);
    this.free_problem = libsvm.cwrap('free_problem', null, ['number']);
    this.serialize_model = libsvm.cwrap('serialize_model', 'number', ['number']);
    this.deserialize_model = libsvm.cwrap('deserialize_model', 'number', ['string']);
    const { options, model } = args;
    this.options = options;
    this.model = model;
  }

  train(args: { samples; labels }) {
    if (this.deserialized) {
      throw new SVMError('Cannot train a deserialized model');
    }

    this.problem = this.createProblem(args);
    const command = getCommand(args.samples);
    this.model = this.train_problem(this.problem, command);
  }

  private createProblem(args: { samples; labels }) {
    const { samples, labels } = args;
    const nbSamples = samples.length;
    const nbFeatures = labels.length;
    const problem = this.create_svm_nodes(nbSamples, nbFeatures);
    for (let i = 0; i < nbSamples; i++) {
      this.add_instance(problem, new Uint8Array(new Float64Array(samples[i]).buffer), nbFeatures, labels[i], i);
    }
    return problem;
  }
}
