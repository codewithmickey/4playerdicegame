var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var errorHandlers = require('./middleware/errorhandler');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;
var config = require('./config.json')
var Communication = require('./redis/communicator')
var oModel = require('./model')
var aGames = [];
var Promise = require("bluebird");
var redis = require('redis');
var routes = require('./routes/templateroutes');
var userRoutes = require('./routes/users.controller');
var redisClient = redis.createClient(config.redisport, config.redishost);
Promise.promisifyAll(redisClient);
var redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ host: config.redishost, port: config.redisport }));

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
});

// adding data to Model Singleton for global access
oModel.io = io;
oModel.redisClient = redisClient;
oModel.games = aGames


// Add middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// Add middlewares
app.use('/', routes);
app.use('/user', userRoutes);
app.use(errorHandlers.error);
app.use(errorHandlers.notFound);


function initServer() {

  // initialize websocket Communication

  Communicator = new Communication();
  Communicator.initSockets();

  // start listening on incoming requests
  http.listen(port, function (err) {
    if (err) return console.error(process.pid, 'error listening on port', port, err);
    console.log(process.pid, 'listening on port', port);
  });
}

initServer();