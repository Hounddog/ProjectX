var connect = require('connect');
var app = connect()
  .use(connect.logger('dev'))
  .use(connect.static('public'))
  .use(function(req, res){
	var body = '404 page not found';
        res.statusCode = 404;
        res.setHeader('Content-Length', body.length);
        res.end(body);
  })
 .listen(8080);
 
 var  io = require('socket.io').listen(app)

io.sockets.on('connection', function (socket) {
    socket.chatName = null;
  socket.on('message', function (message) {
      var nick = socket.id;
      if(socket.chatName) {
          nick = socket.chatName;
      }
      socket.broadcast.emit('message', {message:[nick,message]});
  });
  
  socket.on('chatName', function(chatName){
      socket.chatName = chatName;
  })
});
