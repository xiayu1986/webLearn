
$(function () {
    $("#loginBtn").click(function () {//加入聊天室
        main.login();
    })

    $("#sendBtn").click(function () {//发送消息
        main.send()
    })

    $("#logoutBtn").click(function () {
        $("#M2").find(".modal-body").html('<div class="text-center">确定退出吗！</div>').end().modal();
    })
    
    $("#M2 .confirm").click(function () {//退出聊天
        main.logout();
    })
})


var main={
    username:null,
    userid:null,
    socket:null,
    login:function () {//登录
        var username = $("#userName").val();//取用户名
        if(username != ""){//仅在用户名不为空的情况下才允许登录
            this.init(username);//初始化websocket
            $("#loginArea").addClass("hidden");//隐藏登录模块
            $("#chatRoom").removeClass("hidden");//显示聊天模块
        }else{
            $("#M1").find(".modal-body").html('<div class="text-center">用户名不能为空！</div>').end().modal();
        }
    },
    logout:function () {//退出
        location.reload();
    },
    send:function () {//发送消息
        var content = $("#userContent").val();
        if(content != ''){
            var param = {//构造请求参数
                userid: this.userid,
                username: this.username,
                content: content
            };
            this.socket.emit('message', param);//触发message事件
            $("#userContent").val("");//清空输入框
        }else{
            $("#M1").find(".modal-body").html('<div class="text-center">请输入消息内容！</div>').end().modal();
        }
    },
    init:function (username) {//初始化websocket
        var _this=this;
        this.userid = this.createUserId();//创建用户ID
        this.username = username;//取用户名
        this.socket = io.connect('ws://localhost:3000');//创建websocket连接
        this.socket.emit('login', {userid:this.userid, username:this.username});//向服务器发送登录事件
        this.socket.on('login', function(o){//监听用户登录事件
            _this.update(o, 'login');
        });
        this.socket.on('logout', function(o){//监听用户退出事件
            _this.update(o, 'logout');
        });
        this.socket.on('message', function(obj){//监听消息发送事件
            $(".messageContent").append('<tr><td>'+obj.username+'</td><td>'+obj.content+'</td></tr>');
        });
    },
    createUserId:function () {//动态生成用户ID
        return new Date().getTime()+""+Math.floor(Math.random()*899+100);
    },
    update:function (o,action) {
        var onlineUsers = o.onlineUsers,//当前在线用户列表
            onlineCount = o.onlineCount,//当前在线人数
            user = o.user;//新加入的用户名

        //更新在线人数
        var userhtml = '',userList=[];
        for(key in onlineUsers) {
           userList.push(onlineUsers[key])
        }
        userhtml=userList.join("、");
        $("#onLinePool tr:first td").html('当前共有 '+userhtml+onlineCount+' 人在线');

        //添加系统消息
        var html = (user.username+(action == 'login'? ' 加入了聊天室':' 退出了聊天室'));
        $("#onLinePool").append('<tr><td>'+html+'</td></tr>');
    }
}