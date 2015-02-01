var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//socket.io changes
var server = require('http').createServer(app);
var port = 3000;
server.listen(port);
console.log("Socket.io server listening at http://127.0.0.1:" + port);

var sio = require('socket.io').listen(server);
//Functions that need to be done when a client connects
sio.sockets.on('connection', function(socket){
   console.log('Web client connected');
//To ensure a client has connected
   socket.emit('ss-confirmation', {text: 'Successfully connected'});
//A function to handle Ping coming from the client
   socket.on('ping',function(data) {
      console.log('Server: Received client message: '+data.text);
      socket.emit('ss-confirmation', {text: 'Pong from Server'});  //Sending Pong as a reply
});
   socket.on('pong', function(data) {
      console.log('Server: Received client message: '+data.text);  // Logging the response when client sends pong
});

// Sending a Ping response after every 5 to 10 secs
    setInterval(function(){
        socket.emit('ping', {text: 'Ping from Server'});
    }, 5000+Math.round(4000*Math.random()));
   socket.on('disconnect', function() {
      console.log('Web client disconnected');
   });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
