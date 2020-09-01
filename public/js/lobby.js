var lobby = function(bAdmin,all,id){
    var _bAdmin = bAdmin;
    console.log("This player data is ",bAdmin)
    _html=$('<div></div>')
    _header = $('<h2>Game lobby</h2>')
    _playerlist = $('<div></div>')
    _footer = $('<button class="btn-primary btn-lg">Ready</button>')
    _playerState = false;
    var Evts = new Events();
   
    aPlayers = [];

    function initLobby(){
        $(_html).append(_header)
        $(_html).append(_playerlist)
        $(_footer).bind("click",onStartgame);
        if(_bAdmin)
        {
            $(_footer).text('Start Game')
            _playerState = true
        }
        $(_html).append(_footer)
        addPlayer(all,id)
       console.log($(_html))
    }

    function onStartgame(){
        Evts.dispatchEvent('ON_START_GAME');
    }
    
    function addPlayer(data){
        var oPlayer = new lobbyPlayer(data,id)
        oPlayer.setPlayerReady()
        aPlayers.push({
            id:id,
            player:oPlayer
        })
        $(_playerlist).append(oPlayer.getHTML())
    }
    function roomURL(url) {

        _html.prepend('http://localhost:8080/'+url)
        
    }
    initLobby()
    return{
        getHTML:function(){
            console.log(_html)
            return _html;
        },
        Evts:Evts,
        roomURL:roomURL,
        addPlayer:addPlayer


    }
}


var lobbyPlayer = function(all,id){
    //console.log('from lobby player ',all)
    var myID = id;
   
    _playername = all.name
    console.log(_playername,"player")
    _player = $('<br><span>'+_playername+': waiting</span>')
    //_playername = all.name
    function setPlayerWaiting(){
        $(_player).text(_playername+': waiting')
    }
    function setPlayerReady(){
        $(_player).text(_playername+': Ready')
    }
    return{
        getHTML:function(){
            return _player;
        },
        setPlayerReady:setPlayerReady,
        setPlayerWaiting:setPlayerWaiting
    }
}