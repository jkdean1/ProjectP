class Particle {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.r = size;
        this.highlight = false;
        this.moveAmount = 2;
    }

    intersects(other) {
        var d = (other.x - this.x) * (other.x - this.x) + (other.y - this.y) * (other.y - this.y);
        return d < (this.r + other.r) * (this.r + other.r);
    }

    move() {
        this.x = this.x + Math.random() * (this.moveAmount + this.moveAmount) - this.moveAmount;
        this.y = this.y + Math.random() * (this.moveAmount + this.moveAmount) - this.moveAmount;
    }

    draw(context) {
        if (this.highlight) {
            context.fillStyle = 'red';
            context.strokeStyle = 'red';
        } else {
            context.fillStyle = 'white';
            context.strokeStyle = 'white';
        }

        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        context.stroke();
        context.fill();
    }
}
