var canvas;
var context;
var width;
var height;

var mouseX;
var mouseY;

var tree;
var down = false;

var count = 0;

var range = new Rectangle(250, 250, 107, 75);

window.onload = function () {
    window.addEventListener('resize', resize, false);

    canvas = document.getElementById('canvas');
    context = this.canvas.getContext('2d');
    width = this.canvas.width = 800; //window.innerWidth;
    height = this.canvas.height = 800; //window.innerHeight;

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    setup();
}

document.onmousedown = function (event) {
    var m = new Point(event.x, event.y);
    tree.insert(m);
    down = true;
}

document.onmouseup = function (event) {
    down = false;
}

document.onmousemove = function (event) {
    if (down) {
        var m = new Point(event.x, event.y);
        tree.insert(m);
    }

    mouseX = event.x;
    mouseY = event.y;
}

var setup = function () {
    var boundary = new Rectangle(400, 400, 400, 400);
    tree = new QuadTree(boundary, 4);

    for (var i = 0; i < 1000; i++) {
        var p = new Point(Math.floor(Math.random() * width), Math.floor(Math.random() * height));
        tree.insert(p);
    }

    tree.show(context);

    requestAnimationFrame(loop);
}

var loop = function () {
    draw();
    requestAnimationFrame(loop);
}

var draw = function () {
    //clear the canvas
    context.clearRect(0, 0, width, height);

    //draw the black background
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    //display the tree
    tree.show(context);

    range = new Rectangle(mouseX, mouseY, 107, 75);

    //draw the collision box
    context.strokeStyle = 'green';
    context.beginPath();
    context.rect(range.x - range.w, range.y - range.h, range.w * 2, range.h * 2);
    context.stroke();

    //get the points
    var points = [];
    points = tree.query(range);

    if (count < 1) {
        console.log(points);
        count++;
    }

    if (points) {
        //display the points
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            context.fillStyle = 'blue';
            context.strokeStyle = 'blue';
            context.beginPath();
            context.arc(p.x, p.y, 3, 0, Math.PI * 2, true);
            context.stroke();
            context.fill();
        }
    }
}


var resize = function () {
    context = canvas.getContext('2d');
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

var timestamp = function () {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}
