// View package version
// npm view <package-name> version
// Deploy app
// gcloud app deploy

'use strict';

const express = require('express');
const fs = require('fs');
const { addDash } = require('./server/parser');
const parser = require('./server/parser')
const studio = require('./server/gallery_s')
const path = require('path');

const app = express();

const corpus = parser.parse()
const gallery = studio.get()

app.use(express.static(__dirname+'/public'));

app.use("/images", express.static(path.join(__dirname, "public")));
app.use("/js", express.static(path.join(__dirname, "public")));
app.use("/svg", express.static(path.join(__dirname, "public")));
app.use("/photos", express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' })
    fs.createReadStream('./home.html').pipe(res)
});

app.get('/gallery', (req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' })
    fs.createReadStream('./home.html').pipe(res)
});

app.get('/about', (req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' })
    fs.createReadStream('./home.html').pipe(res)
});

app.get('/r', (req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' })
    fs.createReadStream('./home.html').pipe(res)
});

app.get('/g', (req, res) => {
    res.writeHead(200, { 'content-type': 'application/json', 'Access-Control-Allow-Origin' : '*'})
    res.end(JSON.stringify(gallery.images))
});

app.get('/d', (req, res) => {
    let section
    if(req.query.s){
        section = req.query.s;
    }

    let entry
    if(req.query.e){
        entry = req.query.e;
    }

    res.writeHead(200, { 
        'content-type': 'application/json', 
        'Access-Control-Allow-Origin' : '*'
    })
    
    if(section){
        res.end(JSON.stringify(corpus.sectionmap[section]))
    }
    else if (entry){
        entry = parser.removeDash(entry)
        res.end(JSON.stringify(corpus.entrymap[entry]))
    }
    else{
        res.end(JSON.stringify(corpus.sectionmap))
    } 
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

module.exports = app;