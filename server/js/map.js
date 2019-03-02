var Util = require('./util.js');
var Tile = require('./tile.js');

class Map {

    constructor(w, h) {
        this.width = w;
        this.height = h;
        this.map = [];

        for (var i = 0; i < this.width / 500; i += 10) {
            for (var j = 0; j < this.height / 500; j += 10) {
                var t = new Tile(i, j, 10, 10, Util.getRandomColor());
                this.map.push(t);
            }
        }
    }

    getInfo() {
        var data = [];
        for (var i = 0; i < this.map.length; i++) {
            var info = {
                x: this.map[i].x,
                y: this.map[i].y,
                width: this.map[i].width,
                height: this.map[i].height,
                color: this.map[i].color
            }

            data[i] = info;
        }

        return data;
    }


}

module.exports = Map;
