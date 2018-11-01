import SvgFill from 'svg-fill';
import through2 from 'through2';
import Vinyl from 'vinyl';
import Color from 'color';
import kebabCase from 'lodash.kebabcase';

/**
 * One or more named colors.
 *
 * For each color, gulp-svg-fill will output a copy of the input
 * SVG file filled with that color.
 */
interface NamedColors {
  [name: string]: Color | string;
}

/**
 * A function that takes the stem of a file and the name of
 * a color, and returns a new file stem.
 *
 * For each color, gulp-svg-fill will output a copy of the input
 * SVG file filled with that color and named using the return
 * value of this function.
 */
type renameFn = (stem: string, colorName: string) => string;


/**
 * Options for gulp-svg-fill.
 *
 * At a minimum, you must specify one named color that will
 * be used to fill any SVG files passing through this plugin.
 */
export interface GulpSvgFillOptions {
  colors: NamedColors;
  renameFn?: renameFn;
}

/**
 * Default renaming function that is used if none is specified.
 *
 * Takes the stem of the filename (i.e. the file's name without
 * the extension) and appends a kebab-case version of the color
 * name using an underscore as the separator.
 *
 * E.g.: `foo` + color name "Deep Purple" --> `foo_deep-purple`
 *
 * @param stem
 * @param colorName
 */
function defaultRenameFn(fileStem: string, colorName: string): string {
  return `${fileStem}_${kebabCase(colorName)}`;
}



function svgFill( options: GulpSvgFillOptions) {
  const renameFn = options.renameFn || defaultRenameFn;
  const svgFillers = Object.keys(options.colors).map((colorName) => {
    return {
      name: colorName,
      svgFill: new SvgFill(options.colors[colorName])
    };
  });

  return through2.obj(
    function(file: Vinyl, enc, done) {
      if( file.isNull() ){
        // dir or symlink
        this.push(file);
      }
      else {
        svgFillers.forEach((nameAndFiller, index) => {
          let currentFile = file;
          if (index < (svgFillers.length - 1)) {
            // More files to process after this one. Therefore make a clone
            // of the original
            currentFile = file.clone();
          }

          if (currentFile.isStream()) {
            currentFile.contents = currentFile.contents.pipe(nameAndFiller.svgFill.fillSvgStream());
            currentFile.stem = renameFn(currentFile.stem, nameAndFiller.name);
            this.push(currentFile);
          }
          if (currentFile.isBuffer()) {
            currentFile.contents = Buffer.from(nameAndFiller.svgFill.fillSvg(currentFile.contents));
            currentFile.stem = renameFn(currentFile.stem, nameAndFiller.name);
            this.push(currentFile);
          }
        });
      }
      done();
    }
  );
};

// CommonJS
module.exports = svgFill;

// Make ES6 import compatible
export default svgFill;
