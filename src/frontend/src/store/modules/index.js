const requireContext = require.context("../../modules/", true, /store\.js$/);

export default requireContext.keys().reduce((modules, filename) => {
  const moduleName = filename
    .split("/")[1]
    .replace(/^\w/, (c) => c.toUpperCase());
  modules[moduleName] =
    requireContext(filename).default || requireContext(filename);
  return modules;
}, {});
