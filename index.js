// ssh -i C:\Users\rosem\Desktop\PEM_FILES\personalwebsiteEC2.pem ubuntu@18.216.155.21

const express = require('express');
const morgan  = require('morgan');
const http = require('http');

const app = express();
const PORT = 80;
const HOST = "localhost";

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/test', (req, res) => {
    res.send('test')
  })

app.use(morgan('combined'))

app.listen(PORT)

/*app.listen(PORT, HOST, function(err) {
    if (err) return console.log(err);
    console.log("Listening at http://%s:%s", HOST, PORT);
});/*

http.createServer(function(req, res){
    res.writeHead( 200, { "content-Type" : 'text/plain' } )
    res.end('Hello world!!');
}).listen(PORT);*/
