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

socket.on('connected', function (data) {

    ID = data;

    if (DEBUG) {
        console.log("connected");
        console.log("Your ID: " + ID);
    }
});

socket.on('update', function (data) {
    update(data);
});

function setup() {
    canvas = document.getElementById('canvas');
    context = this.canvas.getContext('2d');
    width = this.canvas.width = window.innerWidth;
    height = this.canvas.height = window.innerHeight;

    run();
}

function draw(dt) {
    context.clearRect(0, 0, width, height);

    for (var i = 0; i < players.length; i++) {
        var p = players[i];
        if (p.id == ID) {
            context.fillStyle = "blue";
            context.beginPath();
            context.arc(width / 2, height / 2, p.r, 0, Math.PI * 2, true);
            context.stroke();
            context.fill();
        }
    }
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
}

function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
