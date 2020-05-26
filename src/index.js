"use strict";

const chalk = require("chalk");
const filesize = require("filesize");
const fs = require("fs");
const path = require("path");
const util = require("util");
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
          if (file.showGzipped) {
            sizeOutput += ` (${filesize(file.gzipSize)} gzipped)`;
          }

          sizeOutput += ` (${filesize(file.brotliSize)} brotli)`;

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
    let ui = this.ui;
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
      let brotli = util.promisify(zlib.brotliCompress);
      let files = this.findFiles();

      let assets = files
        // Print human-readable file sizes (including gzipped and brotli)
        .map((file) => {
          let contentsBuffer = fs.readFileSync(file);
          let gzipSize = zlib.gzipSync(contentsBuffer).length;
          return brotli(contentsBuffer).then((buffer) => ({
            name: file,
            size: contentsBuffer.length,
            gzipSize,
            brotliSize: buffer.length,
            showGzipped: contentsBuffer.length > 0,
          }));
        });

      return resolve(Promise.all(assets));
    });
  }

  findFiles() {
    let inputPath = this.inputPath;

    try {
      return walkSync(inputPath, {
        directories: false,
      }).map((x) => path.join(inputPath, x));
    } catch (e) {
      if (e !== null && typeof e === "object" && e.code === "ENOENT") {
        throw new Error(`No files found in the path provided: ${inputPath}`);
      } else {
        throw e;
      }
    }
  }
};
