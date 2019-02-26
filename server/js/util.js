class Util {
    static getRandomId() {
        return Math.random().toString(20).substr(2, 11);
    }
}

module.exports = Util;
