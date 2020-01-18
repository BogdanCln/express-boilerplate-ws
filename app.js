const path = require('path'),
    logger = require('morgan'),
    debug = require('debug')('app:server'),
    open = require('open'),
    swaggerDocs = require("swagger-jsdoc");

const http = require('http'),
    express = require('express'),
    createError = require('http-errors'),
    helmet = require("helmet"),
    expressWS = require('express-ws');

const app = express();

// Get express port from environment variable PORT.
var port = process.env.PORT || '8080';
app.set('port', port);

// Create the HTTP server.
var server = http.createServer(app);

// Set up express-ws module
expressWS(app, server);

const indexRouter = require(path.join(__dirname, '/routes/index')),
    wsRouter = require(path.join(__dirname, "/routes/WebSocketExample"));

// Secure the app by setting some HTTP response headers
app.use(helmet());

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

// Set up body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up CORS - see https://enable-cors.org
// You should implement CORS if you're planning to use this as a REST API for 3rd party web frontends hosted on other domains 
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// Set up swagger JSDoc
const swaggerDefinition = {
    info: {
        title: "express-boilerplate-ws",
        version: "1.0.0",
        description: "Express App with websocket routers.",
    },
    host: "localhost:" + port,
    basePath: "/",
};

const swaggerSpec = swaggerDocs({
    swaggerDefinition,
    apis: ["./routes/*.js"],
});

app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

// static files
app.use(express.static(path.join(__dirname, 'public')));

// routers
app.use('/', indexRouter);
app.use('/ws', wsRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Last middleware - error handler
app.use(function (err, req, res, next) {
    // provide error to EJS only in development environment
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Listen on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// HTTP server "error" event listener.
function onError(error) {
    if (error.syscall !== 'listen') throw error;

    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${port} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Port ${port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

// HTTP server "listening" event listener.
function onListening() {
    var addr = server.address();
    debug(`\nListening on port ${addr.port}\n`);
    open("http://127.0.0.1:" + addr.port);
    open("http://127.0.0.1:" + addr.port + "/docs");
}
