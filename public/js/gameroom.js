var gameroom = function(){

    var _html = $(`<table id="scoreboard" class="display" cellspacing="0" width="100%">
    <thead>
        <tr>
            <th data-field="turn">Turn</th>
            <th data-field="name">Player Name</th>
            <th data-field="id">Player Unique ID</th>
            <th data-field="type">Player Type</th>
            <th data-field="currentScore">Current Score</th>
            <th data-field="score">Total Score</th>
        </tr>
    </thead>
</table>`)

    function create(playerData)
    {
        // update player data 
        console.log("data in gameroom ",playerData)
      
        $(_html).bootstrapTable({
            data: playerData
        });
        
    }

    function setTurn(playerData)
    {
        // update player data 
        console.log("data for turn ",playerData)
        $(_html).bootstrapTable("destroy");
        $(_html).bootstrapTable({
            data: playerData
        });
        $(_html).bootstrapTable('refresh')
    }


    function update(playerData){
        // update player data 
        console.log("data in gameroom ",playerData)
        $(_html).bootstrapTable("destroy");
        $(_html).bootstrapTable({
            data: playerData
        });
        $(_html).bootstrapTable('refresh')
    }


    return{
        getHtml:function(){
            return _html;
        },
        update:update,
        create:create,
        setTurn:setTurn
    }
}