(function(app){
    var socket
    var myID
    var GameRoom
    var oLobby;
    $(document).ready(function(){
        initApplication();
        
    })

    function addButtonEvents(){
        $('#creategame').bind('click',onCreateGame)
        $('#joinroom').bind('click',onJoinRoom)
        $('#joinbutton').bind('click',onJoinButtonClicked)
    }

    // Button Events
    function onJoinButtonClicked(){
        $('#joinroomcontrols').hide()
        var user = $('#user').text();
        socket.emit('joingame',{'all':{'name':user,'score':0,'state':'idle','type':'member'},'gameID':$('#roomid').val()});
    }

    function onJoinRoom(){
        $('#start').hide();
        $('#joinroomcontrols').show()
    }

    function onCreateGame(){
        var user = $('#user').text();
        socket.emit('creategame',{'name':user,'score':0,'state':'idle','type':'room-admin'})

    }




    //

    function initApplication(){

        //
        
        
        addButtonEvents()


        //
        var user = $('#user').text();
        // show join box
        if (user === "") {
           
            $('#login').show();
            $('#login input').focus();
        } else { //rejoin using old session
            $('#logout').show();
            $("#start").show();
            join(user);
        }

        // join on enter
        $('#login input').keydown(function(event) {
            if (event.keyCode == 13) {
                $('#login a').click();
            }
        });

        /*
        When the user joins, hide the join-field, display chat-widget and also call 'join' function that
        initializes Socket.io and the entire app.
        */
        $('#login a').click(function() {
            join($('#login input').val());
        });
    }


   


    function join(userName){
        var jqxhr = $.post( "/user", {  "user": userName},function() {
            //alert( "success" );
            //console.log(data)
            initSocketIO();
           $('#login').hide();
           $('#logout').show();
          })
            .done(function() {
              
            })
            .fail(function() {
             
            })
            .always(function() {
             
            });
    }

    function initSocketIO(){
        socket = io.connect('ws://localhost:8080', {
            transports: ['websocket']
        });

        socket.on('playerjoined',function(data){
            console.log('new player joined',data)
            oLobby.addPlayer(data.all,data.gameID)
        })

        //socket.emit("checkroom",{'user':'amit123'})
        
        socket.on('joinroom',function(playerdata){
            console.log(playerdata)
            all = playerdata.all
            myID = playerdata.myID
            GameRoom = playerdata.inroom

            // get into lobby
            oLobby = new lobby(playerdata.isAdmin,all,myID);
            $('#lobby').append(oLobby.getHTML())
            console.log(playerdata.gamedata,"complete game data")
        })

        socket.on('roomcreated',function (data) {
            oLobby.roomURL(data.room)
        })
        
        socket.on('rolled',function(data){
            console.log(data)
            // update view for as the playerID
        })

        var roomid = $('#roomid').text();
        if(roomid !== '')
        {
            socket.emit("joingame",{'mygame':roomid})
        }
    }

})(myApp = myApp || {})

var myApp


