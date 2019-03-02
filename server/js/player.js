class Player {
    constructor(id, x, y) {
        this.x = x;
        this.y = y;
        this.socket_id = id;
        this.blobs = [];
        this.screenWidth = 0;
        this.screenHeight = 0;
        this.pressingRight = false;
        this.pressingLeft = false;
        this.pressingUp = false;
        this.pressingDown = false;
        this.vx = 4;
        this.vy = 4;
    }

    getInfo() {
        return {
            x: this.x,
            y: this.y,
        }
    }

    updatePosition() {
        if (this.pressingUp) {
            this.y -= this.vy;
        }

        if (this.pressingDown) {
            this.y += this.vy;
        }

        if (this.pressingLeft) {
            this.x -= this.vx;
        }

        if (this.pressingRight) {
            this.x += this.vx;
        }
    }

    updateScreen(w, h) {
        this.screenWidth = w;
        this.screenHeight = h;
    }
}

module.exports = Player;
