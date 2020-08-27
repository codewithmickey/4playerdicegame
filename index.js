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

//
var CookieParser = require('cookie-parser');
var SECRET = 'codewithmickey';
var cookieParser = CookieParser(SECRET);
var ExpressSession = require('express-session');
var redis = require('redis');
var connectRedis = require('connect-redis');
var RedisStore = connectRedis(ExpressSession);
var redisClient = redis.createClient();
var sessionStore = new RedisStore({client: redisClient});

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
      console.log('a user connected');
  
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

initServer();