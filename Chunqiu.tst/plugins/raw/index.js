module.exports = {
  name: 'raw',
  type: 'render',
  entry: entry
};

function entry (app, fs, log) {
  return function (req, res, next) {
    var path = res.locals.path.join('/');
    log('handles request to path: ', path);
    var fstream = fs.createReadStream(path);
    var flag = false;
    fstream.on('open', function () {
      flag = true;
      res.type(res.locals.ext);
      fstream.pipe(res);
    });
    fstream.on('error', function (err) {
      if (flag == false)
        next(err);
    });
  };
}
