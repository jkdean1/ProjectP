//Global Variables
var socket = io();
var ID;
var DEBUG = true;

//render Variables
var canvas;
var context;
var width;
var height;

//containers
var players = [];

//player variables
var x;
var y;

socket.on('connected', function (data) {

    ID = data;

    if (DEBUG) {
        console.log("connected");
        console.log("Your ID: " + ID);
    }
});

socket.on('message', function (data) {
    console.log(data);
});

socket.on('updateLocation', function (data) {
    x = data.x;
    y = data.y;
});

function setup() {
    canvas = document.getElementById('canvas');
    context = this.canvas.getContext('2d');
    width = this.canvas.width = window.innerWidth;
    height = this.canvas.height = window.innerHeight;

    x = width / 2;
    y = height / 2;

    run();
}

function draw(dt) {
    var canvasX = x - width / 2;
    var canvasY = y - height / 2;
    var moveX = 0 - canvasX;
    var moveY = 0 - canvasY;

    context.resetTransform();
    context.clearRect(0, 0, width, height);

    context.translate(moveX, moveY);
    context.fillStyle = "white";

    context.fillStyle = "orange";
    context.beginPath();
    context.arc(x, y, 5, 0, Math.PI * 2);
    context.closePath();
    context.fill();
    context.textAlign = 'center';
    context.fillText('[ ' + x + ',' + y + ']', x, y - 10);

    context.fillStyle = "black";
}

function update(data) {
    players = [];
    for (var i = 0; i < data.players.length; i++) {
        players[i] = data.players[i];
    }
}

function run() {
    var now;
    var dt = 0;
    var last = timestamp();
    var slow = 1; // slow motion scaling factor
    var step = 1 / 60;
    var slowStep = slow * step;

    var fpsmeter = new FPSMeter({
        decimals: 0,
        graph: true,
        heat: true,
        heatOn: 'backgroundColor',
        theme: 'colorful',
        left: '5px'
    });

    var frame = function () {
        fpsmeter.tickStart();
        now = timestamp();
        dt = dt + Math.min(1, (now - last) / 1000);

        while (dt > slowStep) {
            dt = dt - slowStep;
        }

        draw(dt / slow);
        last = now;
        fpsmeter.tick();
        requestAnimationFrame(frame);
    }

    frame();
}

window.onload = function () {
    window.addEventListener('resize', resize, false);

    window.addEventListener("load", function () {
        window.scrollTo(0, 0);
    });

    document.addEventListener("touchmove", function (e) {
        e.preventDefault()
    });
    setup();
}

function resize() {
    context.clearRect(0, 0, width, height);
    context = this.canvas.getContext('2d');
    width = this.canvas.width = window.innerHeight;
    height = this.canvas.height = window.innerHeight;

    socket.emit('windowResized', {
        w: width,
        h: height
    });
}

function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var onkeydown = function (event) {
    if (event.keyCode === 68) //d
        this.socket.emit('keyPress', {
            inputId: 'right',
            state: true
        });
    else if (event.keyCode === 83) //s
        this.socket.emit('keyPress', {
            inputId: 'down',
            state: true
        });
    else if (event.keyCode === 65) //a
        this.socket.emit('keyPress', {
            inputId: 'left',
            state: true
        });
    else if (event.keyCode === 87) // w
        this.socket.emit('keyPress', {
            inputId: 'up',
            state: true
        });
    else if (event.keyCode === 32) // space
        this.socket.emit('keyPress', {
            inputId: 'space',
            state: true
        });
}

var onkeyup = function (event) {
    if (event.keyCode === 68) //d
        this.socket.emit('keyPress', {
            inputId: 'right',
            state: false
        });
    else if (event.keyCode === 83) //s
        this.socket.emit('keyPress', {
            inputId: 'down',
            state: false
        });
    else if (event.keyCode === 65) //a
        this.socket.emit('keyPress', {
            inputId: 'left',
            state: false
        });
    else if (event.keyCode === 87) // w
        this.socket.emit('keyPress', {
            inputId: 'up',
            state: false
        });
    else if (event.keyCode === 32) // space
        this.socket.emit('keyPress', {
            inputId: 'space',
            state: false
        });
}
