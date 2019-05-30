import gulpSvgFill, { GulpSvgFillOptions } from './index';
import { Stream } from 'stream';
import path from 'path';
import Vinyl from 'vinyl';
import vfs from 'vinyl-fs';
import crypto from 'crypto';

const testConfigColorsOnly: GulpSvgFillOptions = {
  colors: {
    'Red': '#f00',
    'Green': '#0f0',
    'Blue': '#00f'
  }
}

const testFilePath = path.resolve(__dirname, '..', 'test', 'test-star.svg');

function testRenameFn(fileStem: string, colorname: string): string {
  const hash = crypto.createHash('sha256');
  return hash.update(`${fileStem}${colorname}`).digest().toString('hex');
}

describe('gulp-svg-fill', () => {
  it('should return a stream', () => {
    expect(gulpSvgFill(testConfigColorsOnly)).toBeInstanceOf(Stream);
  });

  it('should emit one copy of the input file for each color', (done) => {
    let outfileCount = 0;
    vfs.src(testFilePath)
      .pipe(gulpSvgFill(testConfigColorsOnly))
      .on('data', function(file: Vinyl) {
        outfileCount++;
      })
      .on('end', function() {
        expect(outfileCount).toBe(Object.keys(testConfigColorsOnly.colors).length);
        done();
      });
  });

  it('should emit unique output filenames', (done) => {
    let outfileNames: string[] = [];
    vfs.src(testFilePath)
      .pipe(gulpSvgFill(testConfigColorsOnly))
      .on('data', function(file: Vinyl) {
        expect(outfileNames).not.toContain(file.basename);
        outfileNames.push(file.basename);
      })
      .on('end', function() {
        done();
      });
  });

  it('should emit Vinyl files', (done) => {
    vfs.src(testFilePath)
      .pipe(gulpSvgFill(testConfigColorsOnly))
      .on('data', function(file: any) {
        expect(file).toBeInstanceOf(Vinyl);
      })
      .on('end', function() {
        done();
      });
  });

  it('should emit Vinyl files (using stream contents)', (done) => {
    vfs.src(testFilePath, { buffer: false })
      .pipe(gulpSvgFill(testConfigColorsOnly))
      .on('data', function(file: any) {
        expect(file).toBeInstanceOf(Vinyl);
      })
      .on('end', function() {
        done();
      });
  });

  it('should pass through directories once', (done) => {
    let count = 0;
    vfs.src(__dirname)
      .pipe(gulpSvgFill(testConfigColorsOnly))
      .on('data', function(file: Vinyl) {
        ++count;
        expect(file.isDirectory()).toBe(true);
      })
      .on('end', function() {
        expect(count).toBe(1);
        done();
      });
  });

  it('should use a custom rename function', (done) => {
    const testConfig: GulpSvgFillOptions = Object.assign({}, testConfigColorsOnly);
    testConfig.renameFn = testRenameFn;
    const originalFilestem = path.parse(testFilePath).name;
    const expectedFilenames = Object.keys(testConfig.colors).map(
      colorname => testRenameFn(originalFilestem, colorname)
    );

    vfs.src(testFilePath)
      .pipe(gulpSvgFill(testConfig))
      .on('data', function(file: Vinyl) {
        expect(expectedFilenames).toContain(file.stem);
      })
      .on('end', function() {
        done();
      });
  });
});
