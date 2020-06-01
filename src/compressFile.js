'use strict';

const fs = require('fs');
const zlib = require('zlib');

module.exports = function (file, options) {
  let contentsBuffer = fs.readFileSync(file);
  let output = {
    name: file,
    size: contentsBuffer.length,
    showGzipped: contentsBuffer.length > 0,
  };

  if (!options.skipBrotli) {
    output.brotliSize = zlib.brotliCompressSync(contentsBuffer).length;
  }

  if (!options.skipGzip) {
    output.gzipSize = zlib.gzipSync(contentsBuffer).length;
  }

  return output;
};
