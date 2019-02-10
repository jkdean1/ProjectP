//Global Variables
var socket = io();
var ID;
var DEBUG = true;

//render Variables
var canvas;
var context;
var width;
var height;

socket.on('connected', function (data) {

    ID = data;

    if (DEBUG) {
        console.log("connected");
        console.log("Your ID: " + this.ID);
    }
});

function setup() {
    canvas = document.getElementById('canvas');
    context = this.canvas.getContext('2d');
    width = this.canvas.width = window.innerHeight;
    height = this.canvas.height = window.innerHeight;

    run();
}

function draw(dt) {
    context.clearRect(0, 0, width, height);

    context.fillStyle = "green";
    context.beginPath();
    context.fillRect(50, 50, 100, 100);
    context.fill();
}

function update() {
    //currently does nothing
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
