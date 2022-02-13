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
    // Replace ``` with pre tags
    text = codeToHTML(text)
    // Remove new lines from code snippets marked with <pre>, to prevent it breaking the splitter
    premap = removeLines(/<pre.*?(?<=<\/pre>)/gms, text)
    if (premap){
        text = mapSwap(premap, text)
    }
    // Split into paras
    paras = text.split(/[\r\n]{2}/gms)
    // Remove empty paras
    paras = paras.filter(para => !para.match(/^[\s]*$/gms))
    // Format paras
    paras = paras.map(para => formatPara(para))
    // Rejoin text
    text = paras.join("\n")
    // Restore whitespace to snippets
    if (premap){
        premapinverse = inversemap(premap)
        text = mapSwap(premapinverse, text)    
    }

    return text
}

function codeToHTML(text){
    let codeblocks = text.match(/[`]{3}.*?[`]{3}/gms)
    if (!codeblocks){
        return text
    }

    codeblocks.forEach((block) => {
        let newblock = block.replace(/^[`]{3}/, "<pre class=\"prettyprint\">")
        newblock = newblock.replace(/[`]{3}$/, "</pre>")
        text = text.replace(block, newblock)
    })

    return text
}

// Flip keys and values in a Map
function inversemap(map){
    let inverse = new Map()
    let keys = Array.from(map.keys())

    keys.forEach((oldkey) => {
        let oldv = map.get(oldkey)
        inverse.set(oldv, oldkey)
    })

    return inverse
}

/* Wherever a match for the pattern is found in the given string,
this function will reduce the number of new lines in the string to just one
Returns a Map where key = original substring, value = substring with reduced spaces
*/
function removeLines(pattern, string){
    let matches = string.match(pattern)
    if (!matches){
        return
    }

    let map = new Map()

    matches.forEach((match) => {
        map.set(match, match.replace(/[\r\n]{2,}/gms, "\n"))
    })

    return map
}

// Apply correct MD formatting to the given paragraph
function formatPara(para){
    let headpat = /^[#]{1,} /gms
    let imgpat = /\!\[[^\]]*\]\([^\)]*\)/gms

    // Return unchanged if we have inline HTML
    if(para.match(/^[\s]*</)){
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

    para = para.replace(/`\b/gms, "<code>")
    para = para.replace(/\b`/gms, "</code>")
    para = linksToHTML(para)

    return para
}

// Converts Md links to HTML
function linksToHTML(para){
    const linkpat = /(?<!\!)\[[^\]]*\]\([^\)]*\)/gms
    let links = para.match(linkpat)
    if (!links){
        return para
    }

    const targetpat = /(?<=\()[^\s]*/gms
    const textpat = /(?<=\[)[^\]]*/gms
    const targetcleanpat = /[\)]{1}[.,?!:;"'\/-_+=|]*(?=$)/gms // I want it to be possible to include parentheses in the link target, which can be important when linking to technical references. So for the the target I catch everything up to the next whitespace, necessity cleaning up a little afterwards.

    linkmap = new Map()

    for (let i = 0; i < links.length; i++){
        let currlink = links[i]
        let target = currlink.match(targetpat)[0].replace(targetcleanpat, "")
        let text = currlink.match(textpat)[0]
        linkmap.set(currlink, `<a href="${target}">${text}</a>`)
    }

    return mapSwap(linkmap, para)
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

// Takes a map where key = original string and value = replacement. Replace all occurrences of the key in the string with the value.
// In Node v15 it's possible to use replaceAll rather than my findSubstrings() hack. I'm running v14
function mapSwap(map, string){
    let keys = Array.from(map.keys())

    keys.forEach((key) => {
        let substringcount = findSubstrings(string, key).length
        for (let i = 0; i< substringcount; i++){
            string = string.replace(key, map.get(key))
        }       
    })

    return string
}

// Returns array where of all occurrences of substring in string
function findSubstrings(string, substring){
    let substrings = [];
    for (i = 0; i < string.length; ++i) {
        if (string.substring(i, i + substring.length) == substring) {
            substrings.push(i);
        }
    }
    return substrings;
}