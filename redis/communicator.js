var oModel = require('../model')
var shortid = require('shortid');
var userService = require('../services/user.service');
var Game = require('./creategame')

class Communication{
   io;
   redisClient;
   aGames;
    constructor() {

        // pickup values from Singleton Model class
        this.io = oModel.io;
        this.redisClient = oModel.redisClient;
        this.aGames = oModel.games;
        //console.log(this.redisClient,"From Communicator")
    }

    initSockets() {
        this.io.on('connection', (socket) => {
            console.log('a user connected .');
            socket.on('getplayerdata', (data) => {
                var oGame = this.findAndGetGame(data.gameId)
                var gameData = oGame.getGameData();

                for (var i = 0; i < gameData.players.length; i++) {
                    if (data.userUniqueId == gameData.players[i].id) {
                        socket.emit("playerdata", gameData.players[i]);
                    }
                }

                this.io.to(data.gameId).emit("lobbyupdated", oGame.getGameData().players);
            });

            socket.on('lobbyupdated', (data) => {
                var oGame = this.findAndGetGame(data.gameId)
                oGame.updatePlayerData(data.myID, data.state);
                this.io.to(data.gameId).emit("lobbyupdated", oGame.getGameData().players);
            });

            socket.on('creategame', (data) => {
                console.log('create new game SSS ', data)
                // add user to DB and create new game instance
                //
                var oGame = new Game(this.redisClient);
                //oGame.setGameData();
                var gameID = shortid.generate()
                data.id = shortid.generate()
                oGame.createGame(gameID, data)
                this.aGames.push({
                    id: gameID,
                    instance: oGame
                })
                socket.join(gameID)
                console.log("-", oGame.getGameData(), "Game Data")
                socket.emit('joinroom', { 'gamedata': oGame.getGameData(), 'all': data, 'inroom': gameID, 'myID': data.id, 'isAdmin': true })
                //socket.emit('roomcreated', { 'room': gameID })
                socket.to(gameID).emit('playerjoined', data)

                // save gameID, RoomID, PlayerFrontendID in mongoDB per USER
                let userObj = {
                    _id: data._id,
                    gameId: gameID,
                    gameState: "lobby",
                    userUniqueId: data.id
                }
                userService.updateGameStats(userObj)

            })

            socket.on('joingame', (data) => {
                console.log('join new game', data)
                
                var myID = shortid.generate();
                data.all.id = myID

                socket.join(data.gameID)
                //  add player to game data
                var oGame = this.findAndGetGame(data.gameID)
                oGame.addPlayer(data.all)
                //

                socket.emit('joinroom', { 'gamedata': oGame.getGameData(), 'all': data.all, 'inroom': data.gameID, 'myID': myID, 'isAdmin': false })
                socket.to(data.gameID).emit('playerjoined', data)

                let userObj = {
                    _id: data._id,
                    gameId: data.gameID,
                    gameState: "lobby",
                    userUniqueId: data.all.id
                }
                userService.updateGameStats(userObj)

                //
            })

            socket.on('rejoingamelobby', (data) => {
                console.log('rejoin game', data)
                var myID = shortid.generate();
                //data.all.id = myID
                socket.join(data.gameID)
                var oGame = this.findAndGetGame(data.gameID)
                var bAdmin = false;
                console.log(`data.type rejoingamelobby >>>> ${data.all.type}`)
                if(data.all.type == 'room-admin')
                {
                    console.log(`IN ata.type rejoingamelobby >>>> ${data.type}`)
                    bAdmin = true
                }
                socket.emit('joinroom', { 'gamedata': oGame.getGameData(), 'all': data.all, 'inroom': data.gameID, 'myID': data.all.id, 'isAdmin': bAdmin })
            })

            socket.on('rejoingameplay', (data) => {
                console.log('join game in gameplay', data)

            })



            socket.on('disconnect', function () {
                console.log('user disconnected ');
            });

        });
    }

    findAndGetGame(gameID) {
        for (var i = 0; i < this.aGames.length; i++) {
          if (this.aGames[i].id == gameID) {
            return this.aGames[i].instance
          }
        }
        return null
      }

}


module.exports = Communication;