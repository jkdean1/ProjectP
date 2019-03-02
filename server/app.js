//Import Required Libraries
var Log = require('./js/log.js');
var Util = require('./js/util.js');
var express = require('express');
var fs = require('fs');
var Player = require('./js/player.js');
var Map = require('./js/map.js');

//Load Config Data
var rawdata = fs.readFileSync('./config.json');
var c = JSON.parse(rawdata);

//Create Server Variables
var app = express();
var serv = require('http').Server(app);
var gameport = c.port;

var map = new Map(c.mapsize, c.mapsize);

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

    var randomX = Util.getRandomInt(0, c.mapsize);
    var randomY = Util.getRandomInt(0, c.mapsize);
    //var player = new Player(socket.id, randomX, randomY);
    var player = new Player(socket.id, 1000, 1000);
    PLAYER_LIST[socket.id] = player;

    socket.on('disconnect', function () {
        Log("app", "Socket Deleted: " + socket.id, "info", false);
        delete PLAYER_LIST[socket.id];
        delete SOCKET_LIST[socket.id];
    });

    socket.on('windowResized', function (data) {
        player.updateScreen(data.w, data.h);
    });

    socket.on('keyPress', function (data) {
        if (data.inputId === 'left') {
            player.pressingLeft = data.state;
        } else if (data.inputId === 'right') {
            player.pressingRight = data.state;
        } else if (data.inputId === 'up') {
            player.pressingUp = data.state;
        } else if (data.inputId === 'down') {
            player.pressingDown = data.state;
        } else if (data.inputId === 'space') {
            player.pressingSpace = data.state;
        }
    });
});

setInterval(function () {
    for (var p in PLAYER_LIST) {
        var player = PLAYER_LIST[p];
        var socket = SOCKET_LIST[player.socket_id]
        socket.emit('updateLocation', player.getInfo());

        socket.emit('square', {
            x: 1000,
            y: 1000,
            size: 200
        });

        player.updatePosition();
    }
}, 1000 / 60); //60 times a second
