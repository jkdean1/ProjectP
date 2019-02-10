var Log = require('./js/log.js');
var Util = require('./js/util.js');
var express = require('express');

var app = express();
var serv = require('http').Server(app);
var gameport = 3000;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
//If the server specifies something specific but it has to be in the client folder.
app.use('/client', express.static(__dirname + '/client'));

serv.listen(gameport);

Log("app", "Server Started", "info", true);

var SOCKET_LIST = {};

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    socket.id = Util.getRandomId();
    SOCKET_LIST[socket.id] = socket;

    socket.emit('connected', socket.id);

    Log("app", "Socket Created: " + socket.id, "info", false);

    socket.on('disconnect', function () {
        Log("app", "Socket Deleted: " + socket.id, "info", false);
        delete SOCKET_LIST[socket.id];
    });
});
