const express = require('express');
const morgan  = require('morgan');
const http = require('http');

const app = express();
const PORT = 80;
const HOST = "localhost";

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(morgan('combined'))

/*app.listen(PORT, HOST, function(err) {
    if (err) return console.log(err);
    console.log("Listening at http://%s:%s", HOST, PORT);
  });*/

http.createServer(function(req, res){

res.writeHead( 200, { "content-Type" : 'text/plain' } )
res.end('Hello world!!');

}).listen(PORT);
