const { text } = require('express');
const fs = require('fs');
var path = require('path');
const { title } = require('process');

module.exports = {
    get: function () {
        let galpath = path.join(__dirname, '..', 'public', 'photos')
        return new Gallery(galpath)
    },
}

class Gallery {
    constructor(galpath) {   
        this.images = getImgs(galpath)
    }
}

function getImgs(galpath){
    let imgs = fs.readdirSync(galpath, 'utf8')
    return imgs.map(img => `photos/${img}`)
}