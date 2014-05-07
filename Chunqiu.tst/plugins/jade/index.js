var fs = require('fs');
var marked = require('marked');
var jade = require('jade');

module.exports = {
  name: 'jade',
  type: 'helper',
  entry: generator
}

function generator (path) {
  var source = fs.readFileSync(path, { encoding: 'utf8' });
  var template = jade.compile(source);

  return new JadeRender(path, template);
}

function JadeRender (path, template) {
  this.name = 'jade (' + path + ')';
  this.template = template;
}

JadeRender.prototype = {
  type: 'render',
  entry: function (app, fs, log) {
    var template = this.template;

    return function (req, res, next) {
      var path = res.locals.path.join('/');
      log('handles request to path: ', path);

      fs.readFile(path, { encoding: 'utf8'}, function (err, data) {
        if (err)
          next(err);
        else {
          res.locals.document = marked(data);
          res.type('html');
          res.send(template(res.locals));
        }
      });
    };
  }
}
