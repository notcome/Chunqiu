var express = require('express');
var console = require('console');
var fs = require('fs');
var app = express();

app.locals.rootdir = __dirname;
require('./load_loader')(app);
app.loader('./config', 'Load Config');
app.loader('./plugins', 'Load Plugins');

app.loader('./error_handler');
app.loader('./document_request_parser');
app.loader('./render');

app.use(app.locals.static.url,
        express.static(app.locals.rootdir + app.locals.static.directory));

app.listen(app.locals.port);
