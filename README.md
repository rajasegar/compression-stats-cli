# compression-stats-cli

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
