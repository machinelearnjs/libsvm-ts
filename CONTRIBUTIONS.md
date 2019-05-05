# Contribution Guideline

The document aims to lay out a typical process of contributing and developing to add features or fix bugs for the libsvm-ts project.

### 1. Install Emscripten

The project relies on Emscripten libsvm as wasm and asm. To install Emscripten, head over to https://emscripten.org/docs/getting_started/downloads.html for more
detailed guideline. However, it short you can simply install it by following:

```bash
# Get the emsdk repo
$ git clone https://github.com/emscripten-core/emsdk.git

# Enter that directory
$ cd emsdk

# Pull the latest
$ git pull

# Download and install the latest SDK tools.
$ ./emsdk install latest

# Make the "latest" SDK "active" for the current user. (writes ~/.emscripten file)
$ ./emsdk activate latest

# Activate PATH and other environment variables in the current terminal
$ source ./emsdk_env.sh
```

Make sure to `./emsdk activate latest` and `source ./emsdk_env.sh` before you compile `./libsvm`.

Once you have Emscripten enabled, you can simply type `yarn build-libsvm` to build libsvm into wasm and asm. However, the project
should already include a compiled version of libsvm in the repository so you shouldn't do this again unless you want to introduce a version
bump.


### 2. Compiling the project

#### Building the project

To build the Typescript source code

```bash
# install npm modules
$ yarn

# Build Typescript
$ yarn build
```

### 3. Unit testing and linting

Unit tests and linting are essential to ensure stability and correctness of code that you commit to the project. To run unit tests:

```bash
$ yarn test
```

### 4. Prettier and tslint fix

To format source code automatically using Prettier and Tslint

```bash
$ yarn fix
```

Ideally you should do it before you pushing and making a pull request.
