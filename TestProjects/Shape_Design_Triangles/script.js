var canvas;
var context;
var width;
var height;
var down = false;
var enableMouse = false;
var mouseX;
var mouseY;
var locationX = 100;
var locationY = 100;

var triangleAmount = 4;

window.onload = function () {
    window.addEventListener('resize', resize, false);

    canvas = document.getElementById('canvas');
    context = this.canvas.getContext('2d');
    width = this.canvas.width = window.innerWidth;
    height = this.canvas.height = window.innerHeight;

    locationX = width / 2;
    locationY = height / 2;

    context.clearRect(0, 0, width, height);

    setup();
}

var setup = function () {
    requestAnimationFrame(loop);
}

var loop = function () {
    draw();
    setTimeout(function () {
        //do what you need here
        requestAnimationFrame(loop);
    }, 10);

}

var draw = function () {
    //clear the canvas
    context.clearRect(0, 0, width, height);

    if (enableMouse) {
        locationX = mouseX;
        locationY = mouseY;
    } else {
        var num = 0;
        locationX = locationX + Math.random() * (num + num) - num;
        locationY = locationY + Math.random() * (num + num) - num;
    }

    var points = [];

    //draw the things
    for (var i = 0; i < Math.PI * 2; i += Math.PI / triangleAmount) {
        var x = locationX + 350 * Math.cos(i);
        var y = locationY + 350 * Math.sin(i);
        var p = new Point(x, y);
        points.push(p);
    }

    for (var i = 0; i < points.length - 1; i++) {
        var rgb = getRandomRgb();
        context.fillStyle = rgb;
        context.strokeStyle = rgb;

        context.beginPath();

        context.moveTo(locationX, locationY);
        context.lineTo(points[i].x, points[i].y);
        context.lineTo(points[i + 1].x, points[i + 1].y);
        context.lineTo(locationX, locationY);

        context.fill();
        context.stroke();
    }

    var rgb = getRandomRgb();
    context.fillStyle = rgb;
    context.strokeStyle = rgb;

    context.beginPath();
    context.moveTo(locationX, locationY);
    context.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    context.lineTo(points[0].x, points[0].y);
    context.lineTo(locationX, locationY);
    context.fill();
    context.stroke();

    points = [];
    //draw the things
    for (var i = 0; i < Math.PI * 2; i += Math.PI / triangleAmount) {
        var x = locationX + 170 * Math.cos(i);
        var y = locationY + 170 * Math.sin(i);
        var p = new Point(x, y);
        points.push(p);
    }

    context.fillStyle = 'black';
    context.strokeStyle = rgb;

    context.moveTo(locationX, locationY);
    for (var i = 0; i < points.length - 1; i++) {

        context.beginPath();

        context.moveTo(locationX, locationY);
        context.lineTo(points[i].x, points[i].y);
        context.lineTo(points[i + 1].x, points[i + 1].y);
        context.lineTo(locationX, locationY);

        context.fill();
        context.stroke();
    }

    context.beginPath();
    context.moveTo(locationX, locationY);
    context.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    context.lineTo(points[0].x, points[0].y);
    context.lineTo(locationX, locationY);
    context.fill();
    context.stroke();
}

var resize = function () {
    context = canvas.getContext('2d');
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

document.onmousedown = function (event) {
    down = true;
}

document.onmouseup = function (event) {
    down = false;
}

document.onmousemove = function (event) {
    if (down) {
        mouseX = event.x;
        mouseY = event.y;
    }
}

function getRandomRgb() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    //r = 0;
    var g = num >> 8 & 255;
    g = 0;
    var b = num & 255;
    //b = 0;
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}


class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
