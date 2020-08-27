(function(app){
    $(document).ready(function(){
        initApplication();
    })

    function initApplication(){
        var user = $('#user').text();
        // show join box
        if (user === "") {
            $('#join').show();
            $('#join input').focus();
        } else { //rejoin using old session
            join(user);
        }

        // join on enter
        $('#join input').keydown(function(event) {
            if (event.keyCode == 13) {
                $('#join a').click();
            }
        });

        /*
        When the user joins, hide the join-field, display chat-widget and also call 'join' function that
        initializes Socket.io and the entire app.
        */
        $('#join a').click(function() {
            join($('#join input').val());
        });
    }


   


    function join(userName){
        var jqxhr = $.post( "/user", {  "user": userName},function() {
            //alert( "success" );
            //console.log(data)
            initSocketIO();
           $('#join').hide();
          })
            .done(function() {
              
            })
            .fail(function() {
             
            })
            .always(function() {
             
            });
    }

    function initSocketIO(){
        var socket = io.connect('ws://localhost:8080', {
            transports: ['websocket']
        });
    }

})(myApp = myApp || {})

var myApp


