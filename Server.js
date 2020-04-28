var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
//chat
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var mangChat=[]

// socket.adapter.rooms Show danh sach room dang co
io.on("connection", function(socket){
  // console.log("One " + socket.id);
  socket.Phong=[];//LIST OF ROOMS
//WHEN SELECT ROOM TO CHAT
  socket.on("chon-room",function(data){
    socket.IN=data;
    console.log(socket.IN)
    var ness=[];
    mangChat.forEach(function(r){
    if(r.id ===socket.IN) ness.push(r);
  })
     socket.emit("show-message", {mes:ness,room:socket.IN});
  });

  socket.on("tao-room", function(data){
    socket.join(data);
    socket.IN=data;
    socket.Phong.push(data);//PUSH INTO PHONG WHEN ADD A ROOM
    console.log(socket.IN);
    var mang=[];
    for(r in socket.adapter.rooms){
      mang.push(r);
    }
    io.sockets.emit("server-send-rooms", mang);
    socket.emit("server-send-room-socket", data);

  });

  socket.on("user-chat", function(data){
      var mess = {
       "id" : socket.IN,
       "message" : data  
  };
  mangChat.push(mess);
  console.log(mangChat)
  var ness=[];
  mangChat.forEach(function(r){
    if(r.id ===socket.IN) ness.push(r);
  })
    io.sockets.in(socket.IN).emit("server-chat", {mes:ness,room:socket.IN});
  });

});

app.get("/", function(req, res){
  res.render("index");
});
