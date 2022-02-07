const fs = require('fs');
var path = require('path');

module.exports = {
    parse: function () {
        docPath = path.join(__dirname, '..', 'docs')
        let files = fs.readdirSync(docPath, 'utf8');
        return files
    },      
}