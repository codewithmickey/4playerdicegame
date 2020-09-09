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
var Game = require('./redis/creategame');
var aGames = [];
var redis = require('redis');
//var routes = require('./routes/templateroutes');
var userRoutes = require('./routes/users.controller');
var redisClient = redis.createClient(config.redisport, config.redishostprod);
var redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ host: config.redishostprod, port: config.redisport }));

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
//app.use('/', routes);
app.use('/user', userRoutes);
app.use(errorHandlers.error);
app.use(errorHandlers.notFound);


function initServer() {

  // create game data from Redis

  redisClient.keys('*', function (err, keys) {
    if (err) return console.log(err);
    for(var i = 0, len = keys.length; i < len; i++) {
      redisClient.get(keys[i],  (err, res) => {
         var oGameData = JSON.parse(res);
         console.log(oGameData);
         console.log(oGameData.players.length)
         var oGame = new Game(this.redisClient);
          oGame.setGameDataForInit(oGameData,oGameData.gameID)
          //Restart game if in active state
          oModel.games.push({
            id: oGameData.gameID,
            instance: oGame
          })
       })    
      //console.log(keys[i]);
    }


  });        

  

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