class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point) {
        return (point.x >= this.x - this.w &&
            point.x <= this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y <= this.y + this.h);
    }

    intersects(range) {
        return !(range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.y < this.y - this.h);
    }
}

class QuadTree {
    constructor(boundary, c) {
        this.boundary = boundary;
        this.capacity = c;
        this.points = [];
        this.divided = false;
    }

    subdivide() {
        var x = this.boundary.x;
        var y = this.boundary.y;
        var w = this.boundary.w;
        var h = this.boundary.h;

        var ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
        this.northeast = new QuadTree(ne, this.capacity);
        var nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
        this.northwest = new QuadTree(nw, this.capacity);
        var se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
        this.southeast = new QuadTree(se, this.capacity);
        var sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
        this.southwest = new QuadTree(sw, this.capacity);

        this.divided = true;

    }

    insert(point) {

        if (!this.boundary.contains(point)) {
            return false; //Just get out of here, you don't need this point!
        }


        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }

            if (this.northeast.insert(point)) {
                return true;
            }
            if (this.northwest.insert(point)) {
                return true;
            }
            if (this.southeast.insert(point)) {
                return true;
            }
            if (this.southwest.insert(point)) {
                return true;
            }
        }
    }

    query(range, found) {

        if (!found) {
            found = [];
        }

        if (!this.boundary.intersects(range)) {
            //empty array
            return;
        } else {
            for (var p of this.points) {
                if (range.contains(p)) {
                    found.push(p);
                }
            }

            if (this.divided) {
                this.northeast.query(range, found);
                this.northwest.query(range, found);
                this.southeast.query(range, found);
                this.southwest.query(range, found);
            }
        }

        return found;
    }

    show(context) {
        context.strokeStyle = 'white';
        context.beginPath();
        context.rect(this.boundary.x - this.boundary.w, this.boundary.y - this.boundary.h, this.boundary.w * 2, this.boundary.h * 2);
        context.stroke();

        if (this.divided) {
            this.northeast.show(context);
            this.northwest.show(context);
            this.southeast.show(context);
            this.southwest.show(context);
        }

        context.fillStyle = 'red';
        context.strokeStyle = 'red';

        for (var p of this.points) {
            context.beginPath();
            context.arc(p.x, p.y, 2, 0, Math.PI * 2, true);
            context.stroke();
            context.fill();
        }
    }
}
