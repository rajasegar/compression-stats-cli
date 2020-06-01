'use strict';

const chalk = require('chalk');
const filesize = require('filesize');
const path = require('path');
const walkSync = require('walk-sync');
const workerpool = require('workerpool');

module.exports = class CompressionStats {
  constructor(options) {
    this.options = options;
  }

  print() {
    return this.getFileSizesObject().then((files) => {
      if (files.length !== 0) {
        console.log(chalk.green('Compression statistics:'));
        return files.forEach((file) => {
          let sizeOutput = filesize(file.size);
          if (file.showGzipped && !this.options.skipGzip) {
            sizeOutput += ` (${filesize(file.gzipSize)} gzipped)`;
          }

          if (!this.options.skipBrotli) {
            sizeOutput += ` (${filesize(file.brotliSize)} brotli)`;
          }

          console.log(
            chalk.blue(` - ${path.basename(file.name)}: `) + sizeOutput
          );
        });
      } else {
        console.log(
          chalk.red(`No files found in the path provided: ${this.inputPath}`)
        );
      }
    });
  }

  getFileSizesObject() {
    const { options } = this;
    return new Promise((resolve) => {
      let files = this.findFiles();

      // create a dedicated worker
      const pool = workerpool.pool(__dirname + '/worker.js');

      let assets = files
        // Print human-readable file sizes (including gzip and brotli)
        .map((file) => {
          return pool
            .exec('compressFile', [file, options])
            .then(function (result) {
              //console.log(result);
              return result;
            })
            .catch(function (err) {
              console.error(err);
            });
        });

      return Promise.all(assets).then((data) => {
        pool.terminate(); // terminate all workers when done
        resolve(data);
      });
    });
  }

  findFiles() {
    const { inputPath, include, exclude } = this.options;
    let _inputPath = inputPath || '.';
    let _options = { directories: false };

    // include filter
    if (include && include.length > 0) {
      _options.globs = include.map((i) => `*.${i}`);
    }

    // exclude filter
    if (exclude && exclude.length > 0) {
      _options.ignore = exclude.map((i) => `*.${i}`);
    }

    try {
      return walkSync(_inputPath, _options).map((x) =>
        path.join(_inputPath, x)
      );
    } catch (e) {
      if (e !== null && typeof e === 'object' && e.code === 'ENOENT') {
        throw new Error(`No files found in the path provided: ${inputPath}`);
      } else {
        throw e;
      }
    }
  }
};
