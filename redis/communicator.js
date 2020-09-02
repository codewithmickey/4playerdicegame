var oModel = require('../model')
var shortid = require('shortid');
var userService = require('../services/user.service');
var Game = require('./creategame');
const { io } = require('../model');

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
                oGame.getGameData((gameData)=>{
                    var gameData = gameData;
                    for (var i = 0; i < gameData.players.length; i++) {
                        if (data.userUniqueId == gameData.players[i].id) {
                            socket.emit("playerdata", gameData.players[i]);
                        }
                    }
                    this.io.to(data.gameId).emit("lobbyupdated", gameData.players);
                });
                
            });

            socket.on('lobbyupdated', (data) => {
                var oGame = this.findAndGetGame(data.gameId)
                oGame.updatePlayerData(data.myID, data.state);
                oGame.getGameData((gameData)=>{
                    this.io.to(data.gameId).emit("lobbyupdated", gameData.players);
                })
                
            });

            socket.on('creategame', (data) => {
                console.log('create new game SSS ', data)
                // add user to DB and create new game instance
                //
                var oGame = new Game(this.redisClient);
                //oGame.setGameData();
                var gameID = shortid.generate()
                data.id = shortid.generate()
                oGame.createGame(gameID)

                data.currentScore = 0
                data.turn = ""
                //delete data._id
                oGame.addPlayer(data)


                this.aGames.push({
                    id: gameID,
                    instance: oGame
                })
                socket.join(gameID)

                oGame.getGameData((gameData)=>{
                    console.log("-", gameData, "Game Data")

                    socket.emit('joinroom', { 'gamedata': gameData, 'all': data, 'inroom': gameID, 'myID': data.id, 'isAdmin': true })
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
                });

            })

            socket.on('joingame', (data) => {
                console.log('join new game', data)
                
                var myID = shortid.generate();
                data.all.id = myID
                data.all.currentScore = 0
                data.all.turn = ""

                socket.join(data.gameID)
                //  add player to game data
                var oGame = this.findAndGetGame(data.gameID)
                oGame.addPlayer(data.all)
                //
                oGame.getGameData((gameData)=>{
                    socket.emit('joinroom', { 'gamedata': gameData, 'all': data.all, 'inroom': data.gameID, 'myID': myID, 'isAdmin': false })
                    socket.to(data.gameID).emit('playerjoined', data)

                    let userObj = {
                        _id: data._id,
                        gameId: data.gameID,
                        gameState: "lobby",
                        userUniqueId: data.all.id
                    }
                    userService.updateGameStats(userObj)
                });

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
                oGame.getGameData((gameData)=>{
                    socket.emit('joinroom', { 'gamedata': gameData, 'all': data.all, 'inroom': data.gameID, 'myID': data.all.id, 'isAdmin': bAdmin })
                })
                
            })

            socket.on('rejoingameplay', (data) => {
                console.log('join game in gameplay', data);
                var oGame = this.findAndGetGame(data.gameId)
                //oGame.startGame();
                //userService.updateGameStatsToGamePlay(data.gameID);

                //this.io.to(data.gameID).emit("startgame",oGame.getGameData().players)
                socket.join(data.gameId)
                oGame.getGameData((gameData)=>{
                    socket.emit("startgame",gameData.players)
                })
                


            })



            //

            //gameplay sockets


            socket.on("startgame",(data)=>{
                var oGame = this.findAndGetGame(data.gameID)
                oGame.startGame();
                
                userService.updateGameStatsToGamePlay(data.gameID);

                oGame.getGameData((gameData)=>{
                    this.io.to(data.gameID).emit("startgame",gameData.players)
                });
                
                
            })

            socket.on("rolldice",(data)=>{
                var oGame = this.findAndGetGame(data.gameID)
                oGame.playTurn();
            })








            //



            socket.on('disconnect', function () {
                console.log('user disconnected ');
            });

        });
    }

    findAndGetGame(gameID) {
        console.log(this.aGames,gameID,"From FInd")
        for (var i = 0; i < this.aGames.length; i++) {
          if (this.aGames[i].id == gameID) {
            return this.aGames[i].instance
          }
        }
        return null
      }

}


module.exports = Communication;