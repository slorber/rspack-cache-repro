const fs = require("fs");
const rspack = require("@rspack/core");
const webpack = require("webpack");

const bundlerName = process.env.BUNDLER;
if (!bundlerName || !["rspack", "webpack"].includes(bundlerName)) {
  throw new Error(`process.env.BUNDLER missing`);
}
if (!["rspack", "webpack"].includes(bundlerName)) {
  throw new Error(`Bad process.env.BUNDLER value=${process.env.BUNDLER}`);
}
const bundler = bundlerName === "rspack" ? rspack : webpack;

const persistentCacheConfig = {
  cache:
    bundlerName === "rspack"
      ? true
      : {
          type: "filesystem",
        },
  experiments:
    bundlerName === "rspack"
      ? {
          cache: {
            type: "persistent",
          },
        }
      : undefined,
};

const compiler = bundler({
  ...persistentCacheConfig,
  entry: {
    entry: "./src/entry.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "./utils/custom-js-loader.js",
        },
      },
    ],
  },
});

async function runCompiler() {
  return new Promise((resolve, reject) => {
    compiler.run(
      (err, stats) => {
        if (err) {
          reject(err);
        }
        if (stats.hasErrors()) {
          reject(
            new Error(
              `stats error: ${JSON.stringify(stats.toJson().errors, null, 2)}`,
            ),
          );
        }
        resolve();
      },
      /*
      {
        modifiedFiles: new Set(),
        removedFiles: new Set(),
      },
         */
    );
  });
}

async function closeCompiler() {
  return new Promise((resolve, reject) => {
    compiler.close(reject);
  });
}

async function bundleApp() {
  console.log("");
  console.log("##########");
  console.log("Bundle App start");
  console.time("Bundle App");
  await runCompiler();
  console.timeEnd("Bundle App");
  console.log("");
}

async function runTest() {
  console.log("");
  console.log("");
  console.log("###############################################");
  console.log(`# Using ${bundlerName}`.toUpperCase());
  console.log("#############");
  console.log("");

  await bundleApp();

  await closeCompiler();

  console.log("");
  console.log("SUCCESS");
  console.log("");
}

runTest().catch(console.error);
