# compression-stats-cli

![Build and Deploy](https://github.com/rajasegar/compression-stats-cli/workflows/Build%20and%20Deploy/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/rajasegar/compression-stats-cli/badge.svg?branch=master)](https://coveralls.io/github/rajasegar/compression-stats-cli?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![npm version](http://img.shields.io/npm/v/compression-stats-cli.svg?style=flat)](https://npmjs.org/package/compression-stats-cli "View this project on npm")

A CLI tool to print gzip and brotli compression statistics for your files.

## Installation
```
npm i -g compression-stats-cli
```

## Usage 

```
csc <file/folder path>
csc .
```

### Output
```
Compression statistics:
 - prism.css: 4.16 KB (1.52 KB gzipped) (1.25 KB brotli)
 - prism.js: 31.28 KB (9.83 KB gzipped) (8.66 KB brotli)
```

If you omit the second argument (file/folder path), it will try to collect
the statistics info from the current directory.
