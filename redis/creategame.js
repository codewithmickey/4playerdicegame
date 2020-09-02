var oModel = require('../model')

class Game{

    sName = "";
    oRedis;
    oGameID;
    oGameModel;
    aPlayers = [];
    oGameRoomID;
    oIO;
    nCurrentPlayer = 0;
    nMaxPlayer = 4;
    oGameData = {};

    constructor(redis){
        this.oRedis = oModel.redisClient;
        this.oIO = oModel.io;
    }

    addPlayer(playerData){
        this.oGameData.players.push(playerData);
        this.setGameData(this.oGameData)
    }
    
    updatePlayerData(id,paramState){
        for(var i=0;i<this.oGameData.players.length;i++){
            if(this.oGameData.players[i].id == id){
                this.oGameData.players[i].state = paramState;
            }
        }
        this.setGameData(this.oGameData)
    }

    removePlayer(){

    }

    computeNextTurn(){
        this.nCurrentPlayer++
        if(this.nCurrentPlayer>this.nMaxPlayer)
        {
            this.nCurrentPlayer = 0;
        } 
    }

    startTurnCountDown(){

    }

    autoplayTurn(){

    }

    getRoomID(){
        return this.oGameData.gameRoom;
    }

    createGame(gameID,playerData){
        this.oGameID = gameID
        this.aPlayers.push(playerData)
        this.oGameData = {
            "gameID":gameID,
            "players":this.aPlayers,
            "gameState":"TOSTART", // "ACTIVE" , "ENDED"
            "gameRoom":gameID,
            "currentPlayer":this.nCurrentPlayer
        }
        this.setGameData(this.oGameData)
    }
    
    startGame(){
        this.oGameData.gameState = "ACTIVE"
        
    }

    
    setGameData(obj){
        var data = JSON.stringify(obj);
        this.oRedis.set(this.oGameID,data,function(){
            console.log("Data Set in redis under key",this.oGameID)
        })
    }

    getGameData(){ // need to get redis data with await
        console.log(this.oGameID)
        return this.oGameData
        /*
        this.oRedis.get(this.oGameID, (err, res) => {
           //console.log(res)
            var temp = JSON.parse(res);
            console.log(temp);
            return temp;
          })
       */
    }

}

module.exports = Game;