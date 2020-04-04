# gulp-svg-fill

[![Greenkeeper badge](https://badges.greenkeeper.io/c1rrus/gulp-svg-fill.svg)](https://greenkeeper.io/)

<p align="center">

![Illustration of an SVG shape being filled with a color](./gulp-svg-fill-illustration.svg)

</p>

[Gulp](https://gulpjs.com/) plugin that takes SVG files and fills their shapes with a single colour using [`svg-fill`](https://github.com/c1rrus/svg-fill). It can also be configured with multiple colours, in which case it will output as many SVG files as there are colours, per single input SVG file.

## Usage

### Requirements

* Node.js >= 10

### Installation

```
npm install --save-dev gulp-svg-fill
```

### Basic usage

In your `gulpfile.js` (using Gulp v4):

```js

const gulp = require('gulp');
const svgFill = require('gulp-svg-fill');

function colorSvgs() {
  return gulp.src('src/**/*.svg')
    .pipe(svgFill({
      colors: {
        'Red': '#FF0000',
        'Green': '#00FF00',
        'Blue': '#0000FF'
      }
    }))
    .pipe(gulp.dest('dist/'));
}

module.exports = {
  default: colorSvgs
};

```

The above example will create 3 new SVG files - one filled in red, one in greeen and the other in blue - for each source SVG file found in the source directory.

For example, if the `src/` folder contained `logo.svg`, then after running Gulp, the `dist/` folder would contain:

* `logo_red.svg`
* `logo_green.svg`
* `logo_blue.svg`

### Options

`gulp-svg-fill` expects an options object to be passed in. It supports the following properties:

* **`colors`** (mandatory): An object mapping color names to color values.
    * Must contain at least one color.
    * Values may be RGB hex strings or instances of `Color` (see [`color` NPM package](https://github.com/Qix-/color))
* **`renameFn`** (optional): A function to generate per-color filenames.
    * Should have a signature of: `(fileStem: string, colorName: string) => string`
        * `fileStem` is the name part of the input SVG filepath - i.e. _without the file extension_. For example, if the full file path is `path/to/fancy-logo.svg`, then the file stem passed into the rename function will be `fancy-logo`.
        * `colorName` is the property name of a colour defined in `colors`. For instance, if your colors object looks like `{ 'Rebecca Purple': '#663399' }`, then `colorName` would be `Rebecca Purple`.
    * If omittied, a default rename function is used which takes the original file stem and appends an underscore followed by the kebab-case version of the color name. E.g. if the input file is `fancy-logo.svg`, the output for the color `Rebecca Purple` would be `fancy-logo_rebecca-purple.svg`.


## Development

### Setup

Clone this repo and `npm install` its dependencies:

```
git clone git@github.com:c1rrus/gulp-svg-fill.git

cd svg-fill/

npm install
```

### Building

```
npm run build
```

This will transpile the [TypeScript](https://www.typescriptlang.org/) source code (in the `src/`) directory and output the results to `dist/`.

For development convenience, you can alternatively watch the source files and automatically trigger rebuilds when they change:

```
npm run watch
```

### Running tests

```
npm run test
```

We use [Jest](https://jestjs.io/) for the tests. Each module's unit tests is located alongside its `[module name].ts` file as `[module name].test.ts`.

### Commit message formatting

All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard as we use automated release tools that rely on this. [Commit messages are linted](https://commitlint.js.org/) to check this and your CI builds will fail if your messages don't conform.

To make composing suitable commit messages easier, this repo is [Commitizen friendly](http://commitizen.github.io/cz-cli/). We strongly recommend using commitizen rather than using `git` directly. To use it, simply run:

```
npm run commit
```

...and follow the prompts in your terminal.
