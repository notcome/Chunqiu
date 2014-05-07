var console = require('console');

module.exports = function (app, log) {
  var render_map = app.locals.render_map;

  function select_render (ext, mod) {
    if (!render_map[ext]) {
      if (!render_map.universal[mod])
        return render_map.universal['default'];
      else
        return render_map.universal[mod];
    }

    if (render_map[ext][mod])
      return render_map[ext][mod];
    else if (render_map.universal[mod])
      return render_map.universal[mod];
    else if (render_map[ext]['default'])
      return render_map[ext]['default'];
    else
      return render_map.universal['default'];
  }

  app.all(app.locals.documents.url + '/*', function (req, res, next) {
    var render = select_render(res.locals.ext, res.locals.mod);
    render(req, res, next);
  });
}
