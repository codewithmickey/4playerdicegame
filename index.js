process.on('uncaughtException', function (err) {
    console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
    console.error(err.stack)
    process.exit(1)
  });

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;
var util = require('./middleware/utilities');
var Game = require('./redis/creategame')
var oModel = require('./model')
var aGames = [];
var shortid = require('shortid');


//
var CookieParser = require('cookie-parser');
var SECRET = 'codewithmickey';
var cookieParser = CookieParser(SECRET);
var ExpressSession = require('express-session');
var redis = require('redis');
var connectRedis = require('connect-redis');
var RedisStore = connectRedis(ExpressSession);

var redisClient = redis.createClient(6379,'localhost');
var sessionStore = new RedisStore({client: redisClient});
var redisAdapter = require('socket.io-redis');

io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

oModel.io = io;


oModel.namea = "Amit"


var sess = ExpressSession({
    store: sessionStore,
    secret: SECRET,
    resave: true,
    saveUninitialized: true
  });


// Add middlewares
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser);
  app.use(sess);

//

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Add middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(util.setHeaders);


// setup routes
var routes = require('./routes/templateroutes');
app.use('/', routes);

// error handlers

if (app.get('env') === 'development') {
    app.use(util.deverrorstack);
}
  // production error handler
  app.use(util.proderrorstack);

// sockets
function initSockets() {
    io.on('connection', function(socket){
      console.log('a user connected .');
      
      
      // check new or old player
      // assign an ID to the user and save it in DB against that user

      //

      

      socket.on('creategame',(data)=>{
        console.log('create new game SSS ',data)
        // add user to DB and create new game instance
        //
        
        var oGame = new Game(redisClient);
        //oGame.setGameData();
        var gameID = shortid.generate()
        data.id = shortid.generate()
        oGame.createGame(gameID,data)
        aGames.push({
          id:gameID,
          instance:oGame 
        })

        socket.join(gameID)
        console.log("-",oGame.getGameData(),"Game Data")
        socket.emit('joinroom',{'gamedata':oGame.getGameData(),'all':data,'inroom':gameID,'myID':data.id ,'isAdmin':true})
        socket.emit('roomcreated',{'room':gameID})
        socket.to(gameID).emit('playerjoined',data)

        // save gameID, RoomID, PlayerFrontendID in mongoDB per USER


        socket.on('rolldice',function(data){
          socket.to(gameID).emit('rolled',data)
        })

       

        
        


        //
      })
      socket.on('joingame',(data)=>{
        console.log('join new game',data)
        // check of returning player

        //
        var myID = shortid.generate();
        data.all.id = myID

        socket.join(data.gameID)
        //  add player to game data
        var oGame = findAndGetGame(data.gameID)
        oGame.addPlayer(data.all)
        //

        socket.emit('joinroom',{'gamedata':oGame.getGameData(),'all':data.all,'inroom':data.gameID,'myID':myID ,'isAdmin':false})
        socket.to(data.gameID).emit('playerjoined',data)

        //
      })

      socket.on('disconnect', function(){
        console.log('user disconnected');
      });
  
    });
}

function initServer(){

     // initialize websocket service
    initSockets();

    // start listening on incoming requests
    http.listen(port, function(err){
        if (err) return console.error(process.pid, 'error listening on port', port, err);
        console.log(process.pid, 'listening on port', port);
    });
}



function findAndGetGame(gameID)
{
  for(var i=0;i<aGames.length;i++)
  {
    if(aGames[i].id == gameID)
    {
      return aGames[i].instance
    }
  }
  return null
}

initServer();