var console = require('console');

module.exports = function (app, log) {
  var doc_conf = app.locals.documents;
  var doc_url = doc_conf.url + '/*';
  app.all(doc_url, function (req, res, next) {
    var path = normalize(req.params[0].split('/'),
                         app.locals.rootdir + '/' + doc_conf.directory);
    var filename = path[path.length - 1];
    var ext = find_ext(filename);
    if (ext == null) {
      ext = doc_conf.default_ext;
      path[path.length - 1] += ext;
    }

    res.locals.path = path;
    res.locals.ext  = ext;
    if (req.query.mod == null)
      res.locals.mod = 'default';
    else
      res.locals.mod = req.query.mod;

    next();
  });
}

function normalize (unparsed, root) {
  var result = [root];
  for (var i = 0; i < unparsed.length; i ++)
    if (unparsed[i] != '..' && unparsed[i] != '')
      result.push(unparsed[i]);
  return result;
}

function find_ext (filename) {
  for (var i = filename.length - 1; i >= 0; i --)
    if (filename[i] == '.')
      return filename.substr(i);
  return null;
}
