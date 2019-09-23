var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var http = require('http');
var config = require('config');

var app = express();

/* ----- CREATING SOCKET PUB/SUB ----- */
const server = http.Server(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('tokenPassword', config.security.tokenPassword);

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

/* ----- SETTING CORS RULES ----- */
app.use(cors({
    origin: 'http://localhost:8100',
    credentials: true
}));

/* ----- SETTING API ROUTES ----- */
var routes = require('./src/routes');
app.use('/fantasta/api', routes);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

const port = process.env.PORT || config.port;
server.listen(port, () => {
    console.log(`// ***** CENTRAL LOGIN SERVER ***** \\\\`);
    console.log(`// Server environment: ` + process.env.NODE_ENV + ' \\\\' );
    console.log(`// Server started on port <${port}> \\\\`);
});

module.exports = app;
