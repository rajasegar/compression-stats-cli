const path = require("path");
const execa = require("execa");
const QUnit = require("qunit");

const PROJECT_ROOT = path.join(__dirname, "..");
const EXECUTABLE_PATH = path.join(PROJECT_ROOT, "bin", "cli.js");

// resolved from the root of the project
const inputDir = path.resolve("./tests/fixtures");
const execOpts = { cwd: inputDir, stderr: "inherit" };

QUnit.module("cli", function () {
  QUnit.test("should print file statistics", async function (assert) {
    const result = await execa(EXECUTABLE_PATH, [], execOpts);
    const output = `Compression statistics:
 - prism.css: 4.16 KB (1.52 KB gzipped) (1.25 KB brotli)
 - prism.js: 31.28 KB (9.83 KB gzipped) (8.66 KB brotli)`;

    assert.equal(result.exitCode, 0, "exited with zero");
    assert.equal(result.stdout, output);
  });

  QUnit.test("should filter files with include option", async function (
    assert
  ) {
    const result = await execa(EXECUTABLE_PATH, ["--include", "js"], execOpts);

    const output = `Compression statistics:
 - prism.js: 31.28 KB (9.83 KB gzipped) (8.66 KB brotli)`;

    assert.equal(result.exitCode, 0, "exited with zero");
    assert.equal(result.stdout, output);
  });

  QUnit.test("should filter files with exclude option", async function (
    assert
  ) {
    const result = await execa(EXECUTABLE_PATH, ["--exclude", "js"], execOpts);

    const output = `Compression statistics:
 - prism.css: 4.16 KB (1.52 KB gzipped) (1.25 KB brotli)`;

    assert.equal(result.exitCode, 0, "exited with zero");
    assert.equal(result.stdout, output);
  });

  QUnit.test("should skip Brotli stats", async function (assert) {
    const result = await execa(EXECUTABLE_PATH, ["--skip-brotli"], execOpts);
    const output = `Compression statistics:
 - prism.css: 4.16 KB (1.52 KB gzipped)
 - prism.js: 31.28 KB (9.83 KB gzipped)`;

    assert.equal(result.exitCode, 0, "exited with zero");
    assert.equal(result.stdout, output);
  });

  QUnit.test("should skip Gzip stats", async function (assert) {
    const result = await execa(EXECUTABLE_PATH, ["--skip-gzip"], execOpts);
    const output = `Compression statistics:
 - prism.css: 4.16 KB (1.25 KB brotli)
 - prism.js: 31.28 KB (8.66 KB brotli)`;

    assert.equal(result.exitCode, 0, "exited with zero");
    assert.equal(result.stdout, output);
  });
});
