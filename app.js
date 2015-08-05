var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var project = require('./routes/project');

var app = express();

var cp = require('child_process');
var io = require('socket.io').listen(8080);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/project', project);

var worker;
io.sockets.on('connection', function(socket){
	
	socket.on('message', function(data){
		data = JSON.parse(data);
		if(data.action === 'start'){
			worker = cp.fork('./lib/spider.js');
			worker.send(data.name);
			worker.on("message", function(log){
				socket.emit('log', log);
			});
			worker.on("close", function(code, signal){
				!code && socket.emit('log', {info: '已手动停止抓取'});
			});			
		}else if(data.action === 'stop'){
			worker.kill();
		}
		
	});
});


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
