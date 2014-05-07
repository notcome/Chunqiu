var fs = require('fs');
var console = require('console');

module.exports = function (app, log) {
  var plugin_map = app.locals.plugin_map = {
    yourman: {},
    helper: {},
    render: {}
  };

  load_plugins(app.locals.rootdir + '/' + app.locals.plugin_dir,
               plugin_map, log);

  var render_map = require(app.locals.rootdir + '/render_map')
                     (plugin_map.render,
                      relocate(plugin_map.helper),
                      app.locals.rootdir);

  app.locals.render_map = init_renders(render_map, app);
}


function load_plugins (path, plugin_map, log) {
  var list = fs.readdirSync(path);
  for (var i = 0; i < list.length; i ++) {
    var name = list[i];

    if (name[0] == '.') continue;

    var stats = fs.statSync(path + '/' + name);
    if (stats.isDirectory())
      load_plugin(path + '/' + name, plugin_map, log);
  }
}

function load_plugin (plugin_path, plugin_map, log) {
  try {
    var plugin = require(plugin_path);
  }
  catch (err) {
    log('Module "%s" illegal. Skipped.\nError message: %s',
        plugin_path, err.message);
    return;
  }

  var type = plugin.type, name = plugin.name, entry = plugin.entry;

  switch (type) {
    case 'yourman': case 'helper': case 'render': break;
    default :
      log('Plugin %s\'s type %s cannot be recognized. Skipped.', name, type);
      return;
  }

  if (typeof entry != 'function')
    log('Plugin %s\'s entry is not a function. Skipped.', name, type);
  else if (plugin_map[type][name] != null)
    log('Plugin name %s repeated. Overwritten.', name);
  else {
    plugin_map[type][name] = plugin;
    log('Plugin %s of type %s loaded.', name, type);
  }
}

function relocate (set) {
  var ret = {};
  for (var plugin in set)
    ret[plugin] = set[plugin].entry;
  return ret;
}

function init_renders (render_map, app) {
  var result = {}, fs = require('fs');
  for (var l1 in render_map) {
    result[l1] = {};
    for (var l2 in render_map[l1]) {
      var that = render_map[l1][l2];
      result[l1][l2] = that.entry(app, fs, logger_generator(that.name));
    }
  }
  return result;
}

function logger_generator (name) {
  return function () {
    console.log('[Render %s]', name);
    console.log.apply(null, arguments);
  }
}
