(function(app){
    var socket
    var myID
    var GameRoom
    var oLobby;
    var myState = "idle";
    var oGamePlay

    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);


    $(document).ready(function(){
        initApplication();
        $("#loginBtn").bind("click",loginToApplication);
        $("#logoutBtn").bind("click",logOutFromApplication);
        //$("#logoutBtn").bind("click",logOutFromApplication);
        
        if(sessionStorage){
            var userData = JSON.parse(sessionStorage.getItem("userData"));
            if(userData){
                $("#logoutBtn").show();
                $("#start,#joinroomcontrols,#lobby,#gameroom,#loginFormContainer").hide();
            }else{
                $("#logoutBtn").hide();
            }
            if(userData){
                // Get user game details
                var jqxhr = $.get( "/user/"+userData._id,function(data) {
                    navigateTo(data);
                  })
                    
                    .fail(function(err) {
                        console.log("Fail data on Lofin: ",err);
                        if(err && err.responseText){
                            alert(err.responseText)    
                        }
                        
                    })

            }
        }
        
    });

    function logOutFromApplication(){
        if(sessionStorage){
            sessionStorage.removeItem("userData");
        }
        $("#loginFormContainer").show();
        $("#start,#joinroomcontrols,#lobby,#gameroom,#logoutBtn").hide();
        
    }

    function loginToApplication(){
        var userName = $("#emailId").val();

        if(!userName || userName.indexOf("@") == -1){
            return
        }

        var jqxhr = $.post( "/user/authenticate", {  "userName": userName},function(data) {
            console.log("Response data on Successful login: ",data);
            
            
            if(sessionStorage){
                let sessionData = {
                    _id:data._id,
                    userName:data.userName
                }
                sessionStorage.setItem("userData",JSON.stringify(sessionData));
            }

            navigateTo(data);

          })
            
            .fail(function(err) {
                console.log("Fail data on Lofin: ",err);
                if(err && err.responseText){
                    alert(err.responseText)    
                }
                
            })
    }

    function navigateTo(data){
        console.log("navigate o : ",data);
        $("#loginFormContainer").hide();
        $("#logoutBtn").show();
        initSocketIO();
        if(data && data.gameState && data.gameState== "lobby"){
            // Load lobby
            myID = data.userUniqueId;
            GameRoom = data.gameId;
            var userData = JSON.parse(sessionStorage.getItem('userData'));
            socket.emit("getplayerdata",{gameId:GameRoom,userUniqueId:myID});
            
        }else if(data && data.gameState && data.gameState== "gamePlay"){
            // Load gamePlay
            myID = data.userUniqueId;
            GameRoom = data.gameId;
        }else{
            $("#start").show();
            
        }

    }

    function addButtonEvents(){
        $('#creategame').bind('click',onCreateGame)
        $('#joinroom').bind('click',onJoinRoom)
        $('#joinbutton').bind('click',onJoinButtonClicked)
        $('#rollbutton').bind('click',onRollDice)
    }

    // Button Events
    function onJoinButtonClicked(){
        $('#joinroomcontrols').hide();
        var userData = JSON.parse(sessionStorage.getItem('userData'));
        socket.emit('joingame',{'all':{'name':userData.userName,'score':0,'state':'idle','type':'member'},'gameID':$('#roomid').val(),'_id':userData._id});
    }

    function onJoinRoom(){
        $('#start').hide();
        $('#joinroomcontrols').show()
    }

    function onCreateGame(){
        $("#start").hide();
        var userData = JSON.parse(sessionStorage.getItem('userData'));
        console.log("adgadg userData",userData)
        socket.emit('creategame',{'name':userData.userName,'score':0,'state':'ready','type':'room-admin','_id':userData._id})

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

    function onRollDice() {
        socket.emit('rolldice',{'gameID':GameRoom})
    }

    function onGameStart(obj, evtName, data){
        
        //oGamePlay = new gameroom();
        
        //oGamePlay.update();
        socket.emit('startgame',{'gameID':GameRoom})
    }

    function onDispatchState(obj, evtName, data){
        if(myState == "idle"){
            myState = "ready";
        }else{
            myState = "idle";
        }
        socket.emit("lobbyupdated",{"gameId":GameRoom,"myID":myID,"state":myState});
    }

    function initSocketIO(){
        socket = io.connect('ws://localhost:8080', {
            transports: ['websocket']
        });

        socket.on("playerdata",function (data) {
            console.log("playerdata  >>>>> :: ",data)
            var userData = JSON.parse(sessionStorage.getItem("userData"));
            socket.emit('rejoingamelobby',{'all':{'name':userData.userName,'score':0,'state':data.state,'type':data.type, 'id':data.id},'gameID':GameRoom});
        });

        socket.on("GameWon",function(data){
            if(myID == data)
            {
                alert("you won the match")
            }
            else
            {
                alert("Other player won the match")
            }
        })

        socket.on('playerjoined',function(data){
            console.log('new player joined',data)
            oLobby.addPlayer(data.all,data.gameID)

        })

        //socket.emit("checkroom",{'user':'amit123'})
        
        socket.on('joinroom',function(playerdata){
            console.log(playerdata,"join room");
            all = playerdata.all
            myID = playerdata.myID
            GameRoom = playerdata.inroom

            // get into lobby
            oLobby = new lobby(playerdata.isAdmin,playerdata.gamedata.players,GameRoom);
            oLobby.Evts.addEventListener("ON_START_GAME",onGameStart);
            oLobby.Evts.addEventListener("ON_DISPATCH_STATE",onDispatchState);
            $('#lobby').html('');
            $('#lobby').append(oLobby.getHTML()).show();
            console.log(playerdata.gamedata,"complete game data")
            
        })

        socket.on('lobbyupdated',function(data){
            console.log("Trigger in updateLobby")
            oLobby.updateLobby(data);
        })

        // gameplay sockets

        socket.on('rejoingameroom',function(data) {
            // setup rejoin game room
        })

        socket.on('startgame',function(data){
            // show gameplay screen and hide all other screens

            
            $("#start,#joinroomcontrols,#lobby,#gameroom,#loginFormContainer,#lobby").hide();
            $("#gameroom").show();
            oGamePlay = new gameroom();
            $("#gameroom").prepend(oGamePlay.getHtml()).show();
            oGamePlay.create(data);
        })

        socket.on('playerturn',function(data){
            // update the turn of the player and highlights its data in the table
            
        })

        socket.on('turntimer',function(data){
            // as soon as the turn comes of a player and 00:30 sec timer starts ... the time will be displayed through this socket
            console.log("turn timer",data)
            if(data.playerID == myID)
            {
                $('#playertimer').text(data.timer);
            }
        })

        socket.on('gameplayupdate',function(data) {
            // as soon as any change in the scores
            oGamePlay.update(data);
        })

    }

})(myApp = myApp || {})

var myApp


