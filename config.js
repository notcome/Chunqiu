module.exports = function (app, log) {
  app.locals.rootdir = process.cwd();

  var default_conf = require('./default.json');
  var customized_conf = require(app.locals.rootdir + '/config.json');
  var config = merge(default_conf, customized_conf);

  for (var key in config.general)
    app.locals[key] = config.general[key];

  for (var key in config) {
    if (key == 'general')
      continue;
    app.locals[key] = config[key];
  }
}

function merge (baseline, extension) {
  var merged = {};
  for (var key in baseline)
    if (extension[key]) {
      if (typeof extension[key] == 'object')
        merged[key] = merge(baseline[key], extension[key]);
      else
        merged[key] = extension[key];
    }
    else
      merged[key] = baseline[key];
  for (var key in extension)
    if (merged[key] == null)
      merged[key] = extension[key];
  return merged;
}
