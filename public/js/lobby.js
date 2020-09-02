var lobby = function(bAdmin,players,GameRoom){
    var _bAdmin = bAdmin;
    console.log("This player data is ",bAdmin)
    var _html=$('<div></div>')
    var _header = $('<h2>Game lobby</h2>')
    var _playerlist = $('<div id="player_list"></div>')
    var _footer = $('<button class="btn-primary btn-lg mt-3">Ready</button>')
    var _playerState = false;
    var Evts = new Events();
   
    var aPlayers = [];

    function initLobby(){
        $(_html).append(_header)
        $(_html).append(_playerlist)
        $(_footer).bind("click",onStartgame);
        if(_bAdmin)
        {
            roomURL(GameRoom)
            $(_footer).text('Start Game')
            _playerState = true
        }
        $(_html).append(_footer);
        //addPlayer(all,id)
        createLobby(players);
       console.log($(_html));
    }

    function createLobby(playersParam){
        for(var i=0;i<playersParam.length;i++){
            addPlayer(playersParam[i]);
        }

    }

    function updateLobby(playersParam){
        console.log("RECEIVED ",playersParam)
        $("#player_list").empty();
        for(var i=0;i<playersParam.length;i++){
            addPlayer(playersParam[i]);
        }
        // for(var i=0;i<playersParam.length;i++){
        //     var player = getPlayerInstance(playersParam[i].id);
        //     player.update(playersParam[i]);
        // }
    }

    function getPlayerInstance(id){
        for(var i=0;i<aPlayers.length;i++){
            if(aPlayers[i].id == id){
                return aPlayers[i].player
            }
        }
    }

    function onStartgame(){
        if(_bAdmin){
            Evts.dispatchEvent('ON_START_GAME');
        }else{
            Evts.dispatchEvent('ON_DISPATCH_STATE');
        }
        
    }
    
    function addPlayer(data){
        var oPlayer = new lobbyPlayer(data);
        aPlayers.push({
            id:data.id,
            player:oPlayer
        })
        $(_playerlist).append(oPlayer.getHTML());
    }
    function roomURL(url) {

        _header.after(`<p><span><strong>Game Room Id: </strong> </span><span> ${url}</span></p>`);
        
    }
    initLobby()
    return{
        getHTML:function(){
            console.log(_html)
            return _html;
        },
        Evts:Evts,
        roomURL:roomURL,
        addPlayer:addPlayer,
        updateLobby:updateLobby


    }
}


var lobbyPlayer = function(player){
    var _player = $('<div>'+player.name+': '+player.state+'</div>')


    function update(data){
        console.log("FF DATA :: ",data);
        $(_player).text(data.name+': '+data.state);
        console.log("DOM  :: ",$(_player));
    }
   
    return{
        getHTML:function(){
            return _player;
        },
        update:update
    }
}