#!/usr/bin/env node
"use strict";

const CompressionStats = require("../src/index");

const inputPath = process.argv[2] || '.';
const cs = new CompressionStats({ inputPath });
cs.print();
