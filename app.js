var http = require('http');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");
const cors = require("cors");
var debug = require('debug')
const router = express.Router();
const routes = require('./routes/index');
const {generateJWT,authenticateJWT} = require('./utilities/helpers');
const jwt = require('jsonwebtoken');


require('dotenv').config()
const port = process.env.PORT;

var app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  if ('OPTIONS' === req.method) {
    res.send(200);
  }
  else {
    next();
  }
});

app.use(express.static(__dirname+'/assets'));

app.use('/v1/services', routes(router));

app.get("/", (req, res) => {
  res.json({
    message: "This is a plain JSON message. Nothing else here."
  });
});

app.get('/getImage', function (req, res) {
  res.sendFile(__dirname + '/assets/image_thumb.png');
})


/* Auth code starts here */
app.post('/login', (req, res) => {
  generateJWT(req,res);
});
/* Auth code ends here */

/* app.post('/jsonPatch',authenticateJWT,async(req,res)=>{
  try {
    let patcheddoc = await jsonpatch.apply_patch(req.body.mydoc, req.body.thepatch);
    res.json({
      'new_json': patcheddoc
    });  
  } catch (error) {
    console.log("Errro is: ",error);
  }
}); */
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});



/**
 * Get port from environment and store in Express.
 */
console.log(port);
var portNumber = normalizePort(port|| '3000');
app.set('port', portNumber);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(portNumber);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;
