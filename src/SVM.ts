import asm from '../out/asm/libsvm';
import wasm from '../out/wasm/libsvm';
import { SVMError, WASMError } from './Errors';
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
  private loaded: boolean; // A flag to ensure the wasm is loaded
  private libsvm; // Initially it is using asm. Calling .load() will load wasm

  constructor(options: CommandArguments) {
    this.options = options;
    this.model = null;
    this.loaded = false;
    this.libsvm = asm;
  }

  /**
   * Loads the WASM libsvm asynchronously, this is best for browser usage
   */
  load(): Promise<SVM> {
    return wasm
      .load()
      .then(() => {
        if (this.loaded) {
          throw new SVMError('Cannot load an already loaded SVM');
        }
        this.libsvm = wasm;
        this.predict_one = this.libsvm.cwrap('libsvm_predict_one', 'number', ['number', 'array', 'number']);
        this.predict_one_probability = this.libsvm.cwrap('libsvm_predict_one_probability', 'number', [
          'number',
          'array',
          'number',
          'number',
        ]);
        this.add_instance = this.libsvm.cwrap('add_instance', null, ['number', 'array', 'number', 'number', 'number']);
        this.create_svm_nodes = this.libsvm.cwrap('create_svm_nodes', 'number', ['number', 'number']);
        this.train_problem = this.libsvm.cwrap('libsvm_train_problem', 'number', ['number', 'string']);
        this.svm_get_nr_sv = this.libsvm.cwrap('svm_get_nr_sv', 'number', ['number']);
        this.svm_get_nr_class = this.libsvm.cwrap('svm_get_nr_class', 'number', ['number']);
        this.svm_get_sv_indices = this.libsvm.cwrap('svm_get_sv_indices', null, ['number', 'number']);
        this.svm_get_labels = this.libsvm.cwrap('svm_get_labels', null, ['number', 'number']);
        this.svm_free_model = this.libsvm.cwrap('svm_free_model', null, ['number']);
        this.svm_cross_validation = this.libsvm.cwrap('libsvm_cross_validation', null, [
          'number',
          'string',
          'number',
          'number',
        ]);
        this.svm_get_svr_probability = this.libsvm.cwrap('svm_get_svr_probability', null, ['number']);
        this.free_problem = this.libsvm.cwrap('free_problem', null, ['number']);
        this.serialize_model = this.libsvm.cwrap('serialize_model', 'number', ['number']);
        this.deserialize_model = this.libsvm.cwrap('deserialize_model', 'number', ['string']);
        this.loaded = true;
        return this;
      })
      .catch((err) => {
        throw new WASMError(err);
      });
  }

  /**
   * Trains a model
   * @param args
   */
  train(args: { samples; labels }) {
    if (this.deserialized) {
      throw new SVMError('Cannot train a deserialized model');
    }
    this.problem = this.createProblem(args);
    const command = this.getCommand(args.samples);
    this.model = this.train_problem(this.problem, command);
  }

  /**
   * Predict using a single vector of sample
   * @param args
   */
  predictOne(args: { sample }) {
    const { sample } = args;

    if (!this.model) {
      throw new SVMError('SVM cannot perform predictOne unless you instantiate it');
    }

    return this.predict_one(this.model, new Uint8Array(new Float64Array(sample).buffer), sample.length);
  }

  /**
   * Predict a matrix
   * @param args
   */
  predict(args: { samples }) {
    const { samples } = args;

    const arr = [];
    for (let i = 0; i < samples.length; i++) {
      arr.push(this.predictOne(samples[i]));
    }
    return arr;
  }

  /**
   * Predict the label with probability estimate of many samples.
   * @param args
   */
  predictProbability(args: { samples }) {
    const { samples } = args;

    const arr = [];

    for (let i = 0; i < samples.length; i++) {
      arr.push(this.predictOneProbability(samples[i]));
    }
    return arr;
  }

  /**
   * Predict the label with probability estimate.
   * @param args
   */
  predictOneProbability(args: { sample }) {
    const { sample } = args;
    const labels = this.getLabels();
    const nbLabels = labels.length;
    const estimates = this.libsvm._malloc(nbLabels * 8);
    const prediction = this.predict_one_probability(
      this.model,
      new Uint8Array(new Float64Array(sample).buffer),
      sample.length,
      estimates,
    );
    const estimatesArr = Array.from(this.libsvm.HEAPF64.subarray(estimates / 8, estimates / 8 + nbLabels));
    const result = {
      prediction,
      estimates: labels.map((label, idx) => ({
        label,
        probability: estimatesArr[idx],
      })),
    };
    this.libsvm._free(estimates);
    return result;
  }

  /**
   * Predict a regression value with a confidence interval
   * @param args
   */
  predictOneInterval(args: { sample; confidence }) {
    const { sample, confidence } = args;
    const interval = this.getInterval(confidence);
    const predicted = this.predictOne({ sample });
    return {
      predicted,
      interval: [predicted - interval, predicted + interval],
    };
  }

  /**
   * Predict regression values with confidence intervals
   * @param args
   */
  predictInterval(args: { samples; confidence }) {
    const { samples, confidence } = args;
    const interval = this.getInterval(confidence);
    const predicted = this.predict({ samples });
    return predicted.map((pred) => ({
      predicted: pred,
      interval: [pred - interval, pred + interval],
    }));
  }

  /**
   * Get the array of labels from the model. Useful when creating an SVM instance with SVM.load
   */
  getLabels() {
    const nLabels = this.svm_get_nr_class(this.model);
    return this.getIntArrayFromModel(this.svm_get_labels, this.model, nLabels);
  }

  /**
   * Save the state of the SVM
   */
  toJSON() {
    return {
      model: this.model,
      options: this.options,
      loaded: this.loaded,
    };
  }

  /**
   * Load a model from a state
   * @param args
   */
  fromJSON(args: { model; options; loaded }) {
    const { model, options, loaded } = args;
    this.model = model;
    this.options = options;
    this.loaded = loaded;
  }

  /**
   * Performs k-fold cross-validation (KF-CV). KF-CV separates the data-set into kFold random equally sized partitions,
   * and uses each as a validation set, with all other partitions used in the training set. Observations left over
   * from if kFold does not divide the number of observations are left out of the cross-validation process. If
   * kFold is one, this is equivalent to a leave-on-out cross-validation
   * @param args
   */
  crossValidation(args: { samples; labels; kFold }) {
    const { samples, labels, kFold } = args;

    if (this.deserialized) {
      throw new SVMError('Cannot cross validate on an instance created with SVM.load');
    }

    const problem = this.createProblem({ samples, labels });
    const target = this.libsvm._malloc(labels.length * 8);
    this.svm_cross_validation(problem, this.getCommand(samples), kFold, target);
    const data = this.libsvm.HEAPF64.subarray(target / 8, target / 8 + labels.length);
    const arr = Array.from(data);
    this.libsvm._free(target);
    this.free_problem(problem);
    return arr;
  }

  /**
   * Get the indices of the support vectors from the training set passed to the train method.
   */
  getSVIndices() {
    const nSV = this.svm_get_nr_sv(this.model);
    return this.getIntArrayFromModel(this.svm_get_sv_indices, this.model, nSV);
  }

  /**
   * Uses libsvm's serialization method of the model.
   */
  serializeModel() {
    if (!this.model) {
      throw new SVMError('Cannot serialize model. No model was trained');
    }

    const result = this.serialize_model(this.model);
    const str = this.libsvm.Pointer_stringify(result);
    this.libsvm._free(result);
    return str;
  }

  private getCommand(samples) {
    const options = {};
    Object.assign(options, this.options, {
      gamma: this.options.gamma ? this.options.gamma : 1 / samples[0].length,
    });
    return getCommand(options);
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

  private getIntArrayFromModel(fn, model, size) {
    const offset = this.libsvm._malloc(size * 4);
    fn(model, offset);
    const data = this.libsvm.HEAP32.subarray(offset / 4, offset / 4 + size);
    const arr = Array.from(data);
    this.libsvm._free(offset);
    return arr;
  }

  private getInterval(confidence) {
    const sigma = this.svm_get_svr_probability(this.model);
    if (sigma === 0) {
      throw new SVMError('the model is not a regression with probability estimates');
    }

    if (confidence <= 0 || confidence >= 1) {
      throw new SVMError('confidence must be greater than 0 and less than 1');
    }

    const p = (1 - confidence) / 2;
    return sigma * Math.sign(p - 0.5) * Math.log2(1 - 2 * Math.abs(p - 0.5));
  }
}
