var canvas;
var context;
var width;
var height;

var mouseX;
var mouseY;

var down = false;

var particleCount = 1000;
var maxParticle = 0; //to make one size changeto zero and just use min size
var minParticle = 4;
var maxParticleSize;
var particles = [];

var qt;

var enableQuadTree = true;
var showQuadTree = true;

window.onload = function () {
    setup();
}

var setup = function () {
    window.addEventListener('resize', resize, false);

    canvas = document.getElementById('canvas');
    context = this.canvas.getContext('2d');
    width = this.canvas.width = window.innerHeight;
    height = this.canvas.height = window.innerHeight;
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    for (var i = 0; i < particleCount; i++) {
        var size = Math.random() * maxParticle + minParticle;
        particles[i] = new Particle(Math.random() * width, Math.random() * height, size);
    }

    if (maxParticle == 0) {
        maxParticleSize = minParticle;
    } else {
        maxParticleSize = minParticle + maxParticle;
    }

    run();
}

var run = function () {

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

        draw();
        last = now;
        fpsmeter.tick();
        requestAnimationFrame(frame);
    }

    frame();
}



var draw = function () {
    var boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
    qt = new QuadTree(boundary, 15);

    //draw the black background
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        let point = new Point(p.x, p.y, p);
        qt.insert(point);
    }

    for (let p of particles) {
        p.highlight = false;
        var range = new Circle(p.x, p.y, maxParticleSize * 2);

        if (enableQuadTree) {
            var points = qt.query(range);
            if (points) {
                for (let point of points) {
                    let other = point.data;
                    if (p != other) {
                        let d = distsqt(p.x, p.y, other.x, other.y);
                        if (d < (p.r + other.r) * (p.r + other.r)) {
                            p.highlight = true;
                        }
                    }
                }
            }
        } else {
            for (let other of particles) {
                if (p != other) {
                    let d = distsqt(p.x, p.y, other.x, other.y);
                    if (d < (p.r + other.r) * (p.r + other.r)) {
                        p.highlight = true;
                    }
                }
            }
        }
    }

    for (let p of particles) {
        p.draw(context);
        p.move();
    }

    if (showQuadTree) {
        qt.show(context);
    }
}

var distsqt = function (x1, y1, x2, y2) {
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}


var resize = function () {
    context = canvas.getContext('2d');
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

var timestamp = function () {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}
