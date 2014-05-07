module.exports = function (app, log) {
  app.use(function (err, req, res, next) {
    if (err.code == 'ENOENT')
      res.send(404);
    else if (err.code == 'EACCES')
      res.send(403);
    else
      res.send(500);
  });
}
