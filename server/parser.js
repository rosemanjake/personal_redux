const { text } = require('express');
const fs = require('fs');
var path = require('path');
const { title } = require('process');

module.exports = {
    parse: function () {
        let docpath = path.join(__dirname, '..', 'sections')
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
        this.title = title.replace(/^[\d]*_/gms, "")
        this.entries = getEntries(files, this.title)
    }
}

class Entry{
    constructor(text, sectiontitle){
        this.title = getTitle(text, sectiontitle)
        this.text = toHTML(text)
    }
}

function getTitle(text, sectiontitle){
    let headpat = text.match(/(?<=^# )[^\r\n]*/)
    let match = text.match(headpat)
    
    if (match){
        return match[0]
    }
    else{
        return sectiontitle.toLowerCase()
    }
}

function getSections(docpath){
    let sections = []
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

function getEntries(files, sectiontitle){
    let entries = []

    for (let i = 0; i < files.length; i++){
        let currfile = files[i]
        let text = String(fs.readFileSync(currfile))
        entries.push(new Entry(text, sectiontitle))
    }

    return entries
}

function toHTML(text){
    paras = text.split(/[\r\n]{2}/gms)
    paras = paras.filter(para => !para.match(/^[\s]*$/gms))
    paras = paras.map(para => formatPara(para))
    text = paras.join("\n")

    return text
}

function formatPara(para){
    let headpat = /^[#]{1,} /gms
    let imgpat = /\!\[[^\]]*\]\([^\)]*\)/gms

    // Return unchanged if we have inline HTML
    if(para.match(/^</)){
        return para
    }
    // If we have a MD header
    else if (para.match(headpat)){
        let dashes = para.match(/#*/gms)[0]
        let level = dashes.length 

        para = para.replace(headpat, `<h${level}>`)
        para = `${para}</h${level}>`
    }
    // If we have a MD image
    else if(para.match(imgpat)){
        let caption = para.match(/(?<=\!\[)[^\]]*(?=\])/gms)[0]
        let src = para.match(/(?<=\!\[[^\]]*\]\()[^\)]*(?=\))/gms)[0]
        para = `<figure class="articlefig"><img src="images/${src}" class="articleimg"><figcaption class="articlecaption">${caption}</figcaption></figure>`  
    }
    // Wrap with <p> tags by default
    else{
        para = `<p>${para}</p>`
    }
    return para
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

