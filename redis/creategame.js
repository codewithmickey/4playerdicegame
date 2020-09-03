var oModel = require('../model');
var userService = require('../services/user.service');


class Game{

    sName = "";
    oRedis;
    oGameID;
    oGameModel;
    aPlayers = [];
    oGameRoomID;
    oIO;
    nCurrentPlayer = 0;
    nMaxPlayer;
    oGameData = {};
    nMaxTime = 30;
    nTimerCountdown = this.nMaxTime
    nTimer;
    winScore = 61;

    constructor(redis){
        this.oRedis = oModel.redisClient;
        this.oIO = oModel.io;
        //console.log(this.oIO,"Socket IO instance >>> in gameroom")
    }

    setGameDataForInit(oGameData,oGameID){
        //console.log(oGameID,"This is good",oGameData)
       this.oGameData = oGameData
        this.oGameID = oGameID
    }

    addPlayer(playerData){
        console.log("Create Game add player called >>> ",playerData)
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

    computeNextTurn(){
        console.log("Computing next turn ... ")
        this.nCurrentPlayer++
        if(this.nCurrentPlayer>=this.nMaxPlayer)
        {
            this.nCurrentPlayer = 0;
        } 
        console.log("this.nCurrentPlayer >> ",this.nCurrentPlayer)
    }

    setPlayerTurn(){
        for(var i=0;i<this.oGameData.players.length;i++)
        {
            this.oGameData.players[i].turn = "";
        }
        this.oGameData.players[this.nCurrentPlayer].turn = " >> ";
        this.oIO.to(this.oGameID).emit('playerturn', this.oGameData.players);
        console.log("Current Player is :: ",this.oGameData.players[this.nCurrentPlayer])
    }
    startTurnCountDown(){
        console.log("Starting Countdown Timer... ")
        this.setPlayerTurn();
        this.nTimer = setInterval(()=>{
            //console.log("Running Timer... ",this.nTimerCountdown)
            this.oIO.to(this.oGameID).emit('turntimer', {'timer':this.nTimerCountdown,'playerID':this.oGameData.players[this.nCurrentPlayer].id});
            this.nTimerCountdown--
            if (this.nTimerCountdown === 0) {
                this.playTurn();
                //clearInterval(this.nTimer);
            }
          }, 1000);
    }

    computePlayerScore(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
      }

    playTurn(){
        this.nTimerCountdown = this.nMaxTime;
        console.log("playTurn ...  >>")
        clearInterval(this.nTimer);
        // play turn for a player
        var score = this.computePlayerScore(1,6)

        // add score to player array
        this.oGameData.players[this.nCurrentPlayer].currentScore = score
        this.oGameData.players[this.nCurrentPlayer].score += score
        this.setGameData(this.oGameData)
        this.oIO.to(this.oGameID).emit('gameplayupdate', this.oGameData.players);
        // send updated data to socket
        // check results for win
        
        console.log(this.oGameData.players[this.nCurrentPlayer].score," Score >> ",this.winScore)
        if(this.oGameData.players[this.nCurrentPlayer].score >= this.winScore)
        {
            console.log("Won >>> ")
            this.oIO.to(this.oGameID).emit('GameWon',this.oGameData.players[this.nCurrentPlayer])
            // destry redis key
            this.oRedis.del(this.oGameID);
            userService.gameComplete(this.oGameID);
        }
        else{
            console.log("Start Next Turn >>> ")
            this.computeNextTurn();
            this.startTurnCountDown()
        }
        

        // start timer for the next player
    }

    checkWin(){
        for(var i=0;i<this.oGameData.players.length;i++)
        {
            if(this.oGameData.players[i].score >= this.winScore)
            {
                return this.oGameData.players[i].id
            }
        }
        return "next turn"
    }

    getRoomID(){
        return this.oGameData.gameRoom;
    }

    createGame(gameID){
        this.oGameID = gameID
       // this.aPlayers.push(playerData)
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
        this.nMaxPlayer = this.oGameData.players.length;
        this.oGameData.gameState = "ACTIVE"
        // start player turn timer
        this.startTurnCountDown()
    }

    removePlayer(id){
        console.log("removePlayer called..",this.oGameData.gameState,id);
        let tempArr = [];
        let removedPlayer;
        for(var i=0;i<this.oGameData.players.length;i++){
            if(this.oGameData.players[i].id != id){
                tempArr.push(this.oGameData.players[i]);
            }else{
                removedPlayer = this.oGameData.players[i];
            }
        }

        console.log("tempArr ",tempArr)
        this.oGameData.players = tempArr;
        
        this.setGameData();
        if(this.oGameData.gameState == "TOSTART"){
            this.oIO.to(this.oGameID).emit("lobbyupdated", this.oGameData.players);
        }else if(this.oGameData.gameState == "ACTIVE"){
            console.log("ACTIVE State ..",this.oGameData.gameState)
            this.oIO.to(this.oGameID).emit("forceGameEnd", removedPlayer);
            clearInterval(this.nTimer);
            userService.gameComplete(this.oGameID);
        }else{
            console.log("ELSE State ..",this.oGameData.gameState)
        }
        
    }

    
    setGameData(obj){
        var data = JSON.stringify(obj);
        this.oRedis.set(this.oGameID,data,()=>{
            console.log("Data Set in redis under key",this.oGameID)
        })
    }

    getGameData(callback){ // need to get redis data with await
        //console.log(this.oGameID)
        //return this.oGameData
        
        this.oRedis.get(this.oGameID,  (err, res) => {
           //console.log(res)
            var temp = JSON.parse(res);
            console.log(temp);
            callback(temp);
          })
       
    }
    

}

module.exports = Game;