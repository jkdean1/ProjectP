//Import Required Libraries
var Log = require('./js/log.js');
var Util = require('./js/util.js');
var express = require('express');
var fs = require('fs');
var Player = require('./js/player.js');

//Load Config Data
var rawdata = fs.readFileSync('./config.json');
var c = JSON.parse(rawdata);

//Create Server Variables
var app = express();
var serv = require('http').Server(app);
var gameport = c.port;

//Default location for the client
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

//If the client specifies something specific, it has to be in the client folder.
app.use('/client', express.static(__dirname + '/client'));

serv.listen(gameport);

Log("app", "Server Started", "info", true);

var SOCKET_LIST = {};
var PLAYER_LIST = [];

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    socket.id = Util.getRandomId();
    SOCKET_LIST[socket.id] = socket;

    socket.emit('connected', socket.id);

    Log("app", "Socket Created: " + socket.id, "info", false);

    var player = new Player(socket.id);
    PLAYER_LIST[socket.id] = player;

    socket.on('disconnect', function () {
        Log("app", "Socket Deleted: " + socket.id, "info", false);
        delete PLAYER_LIST[socket.id];
        delete SOCKET_LIST[socket.id];
    });
});
