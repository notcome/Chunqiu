var loader = require('/Users/LiuMS/GitHub/Chunqiu/load_plugins.js');

var map = { render: {}, yourman: {}, helper: {}};

function log () {
  var cout = require('console').log;
  cout('[Load Plugin]');
  cout.apply(null, arguments);
}
loader(__dirname + '/plugins', map, log);

log(map);
