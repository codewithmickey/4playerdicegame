const config = require('../config.json');
const jwt = require('jsonwebtoken');
const db = require('../_helpers/db');
var oModel = require('../model')
const User = db.User;

module.exports = {
    authenticate1,
    getAll,
    getById,
    updateGameStats,
    leaveGame,
    gameComplete,
    updateGameStatsToGamePlay,
    register
};

async function authenticate1({ userName }) {
    console.log("userName = fff",userName)
    const user = await User.findOne({ userName });
    if(!user){
        throw "User name is incorrect. Please enter the correct user name."
    }else if (user) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        // var resFromRedis;
        // if(user.gameId){
        //     oModel.redisClient.getAsync(user.gameId).then(function(data) {
        //         console.log("eeee",data);
        //     }).catch(function(e) {
        //         console.error(e.stack);
        //     });
        // }

        return {
            ...userWithoutHash,
            token

        };

        
    }else{
        throw "User doesn't exist."
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

function findAndGetGame(gameID) {
    for (var i = 0; i < oModel.games.length; i++) {
      if (oModel.games[i].id == gameID) {
        return oModel.games[i].instance
      }
    }
    return null
  }

async function updateGameStats(obj) {
    let user = await User.findById(obj._id);
    user.gameId = obj.gameId;
    user.gameState = obj.gameState;
    user.userUniqueId = obj.userUniqueId;
    await user.save();
}

async function leaveGame(userId) {
    console.log("leaveGame service called")
    let user = await User.findById(userId);
    var oGame = findAndGetGame(user.gameId);
    oGame.removePlayer(user.userUniqueId);
    user.gameId = undefined;
    user.gameState = undefined;
    user.userUniqueId = undefined;

    return await user.save();
}

async function gameComplete(gameId) {
    console.log("gameComplete service called")
    let users = await User.find({gameId:gameId});
    for(let i=0;i<users.length;i++){
        users[i].gameId = undefined;
        users[i].gameState = undefined;
        users[i].userUniqueId = undefined;
        await users[i].save();
    }
}

async function updateGameStatsToGamePlay(gameId) {
    let users = await User.find({gameId:gameId});
    for(let i=0;i<users.length;i++){
        users[i].gameState = "gamePlay";
        await users[i].save();
    }
}

async function register(userParam) {
    console.log(userParam)
    
    // validate
    if (await User.findOne({ userName: userParam.userName })) {
        throw 'Username "' + userParam.userName + '" is already taken';
    }

    const user = new User(userParam);

    // save user
    await user.save();
}
