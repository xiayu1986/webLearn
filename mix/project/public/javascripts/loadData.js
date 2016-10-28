
$(function () {
    //服务器渲染模板
   $("#queryBtn").click(function () {
       $("#flightsContainer").html('<tr><td colspan="15"><div class="wait"></div></td></tr>');
       $("#time").html("");
      $.ajax({
        "type":"POST",
        "url":"/query",
        "data":{
          "type":"html"
        }
      }).done(function (res) {
          $("#flightsContainer").html(res)
      }).fail(function (error) {
        
      })
   })
    //浏览器渲染模板
    $("#loadBtn").click(function () {
        $("#flightsContainer").html('<tr><td colspan="15"><div class="wait"></div></td></tr>');
        $("#time").html("");
        $.ajax({
            "type":"POST",
            "url":"/query",
            "data":{
                "type":"json"
            }
        }).done(function (res) {
            var d1= new Date();
            var sourceHtml=template("renderFlights",res)
            $("#flightsContainer").html(sourceHtml)
            var d2= new Date();
            $("#time").html("渲染耗时："+((d2-d1)/1000)+"秒");
        }).fail(function (error) {

        })
    })
})