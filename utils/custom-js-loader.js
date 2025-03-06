// A custom "pass-through" loader that just logs, adds an artificial delay, and return the input
module.exports = async function customJsLoader(content) {
  console.log(
    "- Loading",
    require("path").relative(process.cwd(), this.resourcePath),
  );

  await new Promise((r) => setTimeout(r, 1000));

  return content;
};
