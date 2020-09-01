var player = function(id){

    var myID = id;
    var _html =$('<div class="player"><div><span>Name: </span><span class="playername">Amit</span></div><div><span>Score: </span><span class="playerscore">0</span></div><div><span>State: </span><span class="playerstate">Idle</span></div><div><span>Player Type: </span><span class="playertype">Room Admin</span></div></div>')

    return{
        getHTML:function(){
            return _html;
        }
    }
}