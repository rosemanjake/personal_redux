const express = require('express');
var morgan  = require('morgan')

const app = express();
const PORT = 8080;
const HOST = "localhost";

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(morgan('combined'))

app.listen(PORT, HOST, function(err) {
    if (err) return console.log(err);
    console.log("Listening at http://%s:%s", HOST, PORT);
  });

