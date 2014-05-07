//renders => direct render
//helpers => render generator
module.exports = function (renders, helpers, rootdir) {
  return {
    '.md': {
      'default': helpers.jade(rootdir + '/views/simplified.jade')
    },
    'universal': {
      'raw': renders.raw,
      'default': renders.raw
    }
  };
};
