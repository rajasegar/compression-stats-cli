#!/usr/bin/env node
'use strict';

const CompressionStats = require('../src/index');
const argv = require('yargs')
  .usage('Usage: csc [folder-path]')
  .option('skip-brotli', {
    alias: 'sb',
    default: false,
    type: 'boolean',
    describe: 'Skip Brotli compression stats',
  })
  .option('skip-gzip', {
    alias: 'sg',
    default: false,
    type: 'boolean',
    describe: 'Skip Gzip compression stats',
  })
  .option('include', {
    alias: 'i',
    type: 'array',
    describe: 'Include these file extensions only',
  })
  .option('exclude', {
    alias: 'x',
    type: 'array',
    describe: 'Exclude these file extensions',
  }).argv;

let [inputPath] = argv._;

const { skipBrotli, skipGzip, include, exclude } = argv;

const cs = new CompressionStats({
  inputPath,
  skipBrotli,
  skipGzip,
  include,
  exclude,
});
cs.print();
