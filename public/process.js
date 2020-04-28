var socket = io("http://localhost:3000");
var currentRoom='';
var missMess=0;
var inRoom=[];
socket.on("server-send-rooms", function(data){
  $("#dsRoom").html("");
  data.map(function(r){
  //  $("#dsRoom").append("<h4 class='room'>" + r + "</h4>");
  });
});
var room=[];
// ACITVE BUTTON WHEN CLICK 
function selected(x){
  console.log(x)
    inRoom.forEach(function(r){ 
       document.getElementById(r).style.backgroundColor='#E24727';  
       document.getElementById(r).style.color='white';  
  });
}
//WHEN handleSelected ROOM TO CHAT
function handleSelected(data){
  console.log(room);
  var dat=data;
  currentRoom=data;
  console.log(currentRoom);
  socket.emit("chon-room",data);
  selected(dat);
  document.getElementById(dat).style.backgroundColor='#E57953';
  document.getElementById(dat).style.color='white';
  document.querySelector('.room-name').innerHTML=`ROOM - ${data}`
 
}
socket.on("server-send-room-socket", function(data){
  var name=data;
  room.push(name);
   $(".chat-room").append("<div  id='"+ name + "' onclick='handleSelected(\""+ name + "\")' class='room'>" + data + "</div>");

  // $(".dropdown-menu").append("<a  id='"+ name + "' onclick='handleSelected(\""+ name + "\")' class='dropdown-item'>" + data + "</a>");
  //$(".dropdown-menu").append("<button  id='"+ name + "' onclick='handleSelected(\""+ name + "\")' class='"+data+"'>" + data + "</button>");
});

socket.on("show-message", function(data){
     console.log(data)
   $(".show-message").html('');
  data.mes.forEach(function(r){
  var date = new Date(); var time = "  send "+date.getHours() + ':' + date.getMinutes() 
   $(".show-message").append("<li class='show-message-item'>" + r.message + "<small>"+time+"<small></li>");
  })
  $(".badge-light").html('');
  //console.log(data.room)
  
 
});
socket.on("server-chat", function(data){
 
  if(currentRoom==data.room){
     $(".show-message").html('');
    data.mes.forEach(function(r){
      $(".show-message").append("<li class='show-message-item'>" + r.message + "</li>");
    })

  }else{
    if(inRoom.includes(data.room)){
           $(".badge-light").html('New');
            document.getElementById(data.room).style.color='#3832a8';
      }  

  }
  $(".show-message").animate({ scrollTop: $(document).height() }, "fast");
});

$(document).ready(function(){

  $("#btnTaoRoom").click(function(){
     socket.emit("tao-room", $("#action-add").val());
        inRoom.push( $("#action-add").val())
        console.log(inRoom)
       $("#action-add").val('')
    
  
    //console.log(inRoom)
  });
   $("#btnChon").click(function(){
   // socket.emit("chon-room",'A');
   console.log("a");
  });

  $("#btnChat").click(function(){
    if($("#action-chat").val()){
        socket.emit("user-chat", $("#action-chat").val());
        $("#action-chat").val('');
        $(".show-message").animate({ scrollTop: $(document).height() }, "fast");
    }else{
      alert('Please fill this field!')
    }
    
  //  console.log("a");

  });
  $('#action-chat').keypress(function(event){
  
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
     if($("#action-chat").val()){
        socket.emit("user-chat", $("#action-chat").val());
        $("#action-chat").val('');
        $(".show-message").animate({ scrollTop: $(document).height() }, "fast");
    }else{
      alert('Please fill this field!')
    }
    }

});
  $('#action-add').keypress(function(event){
  
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
       socket.emit("tao-room", $("#action-add").val());
        inRoom.push( $("#action-add").val())
        console.log(inRoom)

       $("#action-add").val('')
      //inRoom.push( $("#action-add").val(''))
    }

});

});
