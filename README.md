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

```
npx compression-stats-cli 
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

## Options

### include
Include only the files with extensions specified. Just give the extensions 
separated by space without "."

```
csc . --include js css

Compression statistics:
 - prism.css: 4.16 KB (1.52 KB gzipped) (1.25 KB brotli)
 - prism.js: 31.28 KB (9.83 KB gzipped) (8.66 KB brotli)
```

### exclude
Exclude the files with extensions specified. Just give the extensions 
separated by space without "."

```
csc . --exclude js txt

Compression statistics:
 - prism.css: 4.16 KB (1.52 KB gzipped) (1.25 KB brotli)
```

### skip-brotli
Skip the Brotli stats information in the output

```
csc . --skip-brotli

Compression statistics:
 - prism.css: 4.16 KB (1.52 KB gzipped)
 - prism.js: 31.28 KB (9.83 KB gzipped)
```

### skip-gzip
Skip the Gzip stats information in the output

```
csc . --skip-gzip

Compression statistics:
 - prism.css: 4.16 KB (1.25 KB brotli)
 - prism.js: 31.28 KB (8.66 KB brotli)
```


## Help

```
Usage: csc [folder-path]

Options:
  --help               Show help                                       [boolean]
  --version            Show version number                             [boolean]
  --skip-brotli, --sb  Skip Brotli compression stats  [boolean] [default: false]
  --skip-gzip, --sg    Skip Gzip compression stats    [boolean] [default: false]
  --include, -i        Include these file extensions only                [array]
  --exclude, -x        Exclude these file extensions                     [array]
``````
