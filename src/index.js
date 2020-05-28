"use strict";

const chalk = require("chalk");
const filesize = require("filesize");
const fs = require("fs");
const path = require("path");
const walkSync = require("walk-sync");
const zlib = require("zlib");

module.exports = class CompressionStats {
  constructor(options) {
    Object.assign(this, options);
  }

  print() {
    return this.makeFileSizesObject().then((files) => {
      if (files.length !== 0) {
        console.log(chalk.green("Compression statistics:"));
        return files.forEach((file) => {
          let sizeOutput = filesize(file.size);
          if (file.showGzipped && !this.skipGzip) {
            sizeOutput += ` (${filesize(file.gzipSize)} gzipped)`;
          }

          if (!this.skipBrotli) {
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

  printJSON() {
    return this.makeFileSizesObject().then((files) => {
      if (files.length !== 0) {
        let entries = files.map((file) => ({
          name: file.name,
          size: file.size,
          gzipSize: file.gzipSize,
          brotliSize: file.brotliSize,
        }));
        console.log(JSON.stringify({ files: entries }));
      } else {
        console.log(
          chalk.red(`No files found in the path provided: ${this.inputPath}`)
        );
      }
    });
  }

  makeFileSizesObject() {
    return new Promise((resolve) => {
      let files = this.findFiles();

      let assets = files
        // Print human-readable file sizes (including gzip and brotli)
        .map((file) => {
          let contentsBuffer = fs.readFileSync(file);
          let output = {
            name: file,
            size: contentsBuffer.length,
            showGzipped: contentsBuffer.length > 0,
          };

          if (!this.skipBrotli) {
            output.brotliSize = zlib.brotliCompressSync(contentsBuffer).length;
          }

          if (!this.skipGzip) {
            output.gzipSize = zlib.gzipSync(contentsBuffer).length;
          }

          return output;
        });

      return resolve(assets);
    });
  }

  findFiles() {
    let inputPath = this.inputPath || ".";
    let _options = { directories: false };

    // include filter
    if (this.include && this.include.length > 0) {
      _options.globs = this.include.map((i) => `*.${i}`);
    }

    // exclude filter
    if (this.exclude && this.exclude.length > 0) {
      _options.ignore = this.exclude.map((i) => `*.${i}`);
    }

    try {
      return walkSync(inputPath, _options).map((x) => path.join(inputPath, x));
    } catch (e) {
      if (e !== null && typeof e === "object" && e.code === "ENOENT") {
        throw new Error(`No files found in the path provided: ${inputPath}`);
      } else {
        throw e;
      }
    }
  }
};
