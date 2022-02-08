// View package version
// npm view <package-name> version
// Deploy app
// gcloud app deploy

'use strict';

// [START gae_node_request_example]
const express = require('express');
const fs = require('fs');
const { addDash } = require('./server/parser');
const parser = require('./server/parser')

const app = express();

const corpus = parser.parse()

app.get('/', (req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' })
    fs.createReadStream('./www/home.html').pipe(res)
});

app.get('/r', (req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' })
    fs.createReadStream('./www/home.html').pipe(res)
});

app.get('/main.js', (req, res) => {
    res.writeHead(200, { 'content-type': 'text/javascript' })
    fs.createReadStream('./client/main.js').pipe(res)
});

app.get('/main.css', (req, res) => {
    //res.status(200).send('Hello, world!').end();
    res.writeHead(200, { 'content-type': 'text/css' })
    fs.createReadStream('./www/main.css').pipe(res)
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
// [END gae_node_request_example]

module.exports = app;