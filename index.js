// View package version
// npm view <package-name> version
// Deploy app
// gcloud app deploy

'use strict';

// [START gae_node_request_example]
const express = require('express');
const fs = require('fs')
const parser = require('./server/parser')

const app = express();

app.get('/', (req, res) => {
    //res.status(200).send('Hello, world!').end();
    res.writeHead(200, { 'content-type': 'text/html' })
    fs.createReadStream('./www/home.html').pipe(res)
});

app.get('/main.js', (req, res) => {
    //res.status(200).send('Hello, world!').end();
    res.writeHead(200, { 'content-type': 'text/javascript' })
    fs.createReadStream('./client/main.js').pipe(res)
});

app.get('/main.css', (req, res) => {
    //res.status(200).send('Hello, world!').end();
    res.writeHead(200, { 'content-type': 'text/css' })
    fs.createReadStream('./www/main.css').pipe(res)
});

app.get('/docs', (req, res) => {
    //res.status(200).send('Hello, world!').end();
    res.writeHead(200, { 
        'content-type': 'application/json', 
        'Access-Control-Allow-Origin' : '*'
    })
    res.end(JSON.stringify(parser.parse()))
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
// [END gae_node_request_example]

module.exports = app;