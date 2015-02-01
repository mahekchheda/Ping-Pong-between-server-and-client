var server_name = "http://127.0.0.1:3000/";
var socket = io.connect(server_name);
// To record messages coming from Server
socket.on('ss-confirmation', function(data) {
   console.log('Client: Received server message: '+data.text);
   });
// To send a ping message when a button is clicked
$('#ping').click(function(){
   socket.emit('ping',{text:'Ping from Client'});
   console.log('Ping sent');
});
// To intercept a ping message from server and replying back with pong
socket.on('ping', function(data) {
   console.log('Client: Received server message: '+data.text);
   socket.emit('pong',{text: 'Pong from Client'});
});
