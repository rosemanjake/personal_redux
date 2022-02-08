const fs = require('fs');
var path = require('path');

module.exports = {
    parse: function () {
        let docpath = path.join(__dirname, '..', 'docs')
        return new Corpus(docpath)
    },
    addDash: function(title){
        return title.replace(/[ ]/gms, "-")
    },
    removeDash: function(title){
        return title.replace(/[-]/gms, " ")
    }      
}

class Corpus {
    constructor(docpath) {   
        this.sections = getSections(docpath)
        let [smap, emap] = getMaps(this.sections)
        this.sectionmap = smap 
        this.entrymap = emap // key = section title, value = list of entry titles
    }
}

class Section{
    constructor(files, title){
        this.title = title
        this.entries = getEntries(files)
    }
}

class Entry{
    constructor(text){
        this.title = text.match(/(?<=^# )[^\r\n]*/)[0]
        this.text = toHTML(text)
    }
}

function getSections(docpath){
    let sections = []
    //let dirs = fs.readdirSync(docPath, 'utf8');
    let dirs = fs.readdirSync(docpath).filter(function (file) {
        return fs.statSync(`${docpath}/${file}`).isDirectory();
    });

    for (let i = 0; i < dirs.length; i++){
        let dir = dirs[i]
        let currdir = `${docpath}/${dir}`
        let files = fs.readdirSync(currdir, 'utf8').map(file => `${currdir}/${file}`);
        sections.push(new Section(files, dir))
    }

    return sections
}

function getEntries(files){
    let entries = []

    for (let i = 0; i < files.length; i++){
        let currfile = files[i]
        let text = String(fs.readFileSync(currfile))
        entries.push(new Entry(text))
    }

    return entries
}

function toHTML(text){
    return text
}

function getMaps(sections){
    let sectionmap = {}
    let entrymap = {}

    for (let i = 0; i < sections.length; i++){
        let currsection = sections[i]
        let entrylist = []
        for (let j = 0; j < currsection.entries.length; j++){
            let currentry = currsection.entries[j]
            //let dashtitle = addDash(currentry.title)

            entrylist.push(currentry.title)
            entrymap[currentry.title] = currentry
        }
        sectionmap[currsection.title] = entrylist
    }

    return [sectionmap, entrymap]
}

