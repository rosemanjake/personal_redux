const express = require('express');
const app = express();
const PORT = 8080;
const HOST = "http://localhost:";

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, HOST, function(err) {
    if (err) return console.log(err);
    console.log("Listening at http://%s:%s", HOST, PORT);
  });