(function() {
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
        $("#registerBtn").bind("click",register);
    });


    function register(){
        var userName = $("#emailId").val();


        if(!userName || userName.indexOf("@") == -1){
            return
        }
        
        var jqxhr = $.post( "/user/register", {  "userName": userName},function(data) {
            console.log("Response data ",data)
            if(data && data.message){
                alert(data.message)    
            }
          })
            
            .fail(function(err) {
                console.log("Fail data ",err);
                if(err && err.responseText){
                    alert(err.responseText)    
                }
                
            })
            
    }


  })();

   