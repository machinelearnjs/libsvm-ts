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

  constructor(args: {
    libsvm: any,
  }) {
    const { libsvm } = args;

  }
}
