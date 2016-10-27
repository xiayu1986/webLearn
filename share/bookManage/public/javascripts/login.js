/*用户登录*/
$(function () {
   $("#loginBtn").click(function () {
      $.ajax({
        "type":"POST",
        "url":"/login",
        "data":{
          "userName":$("#userName").val(),
          "password":$("#password").val()
        }
      }).done(function (res) {
        
      }).fail(function (error) {
        
      })
   })
})