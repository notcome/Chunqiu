var console = require('console');

module.exports = function (app) {
  app.loader = function (path, verb) {
    console.log('Load %s', path);
    require(path)(app, logger_generator(verb));
  }
}

function logger_generator (verb) {
  return function () {
    console.log('[%s]', verb || 'Kernel');
    console.log.apply(null, arguments);
  }
}
