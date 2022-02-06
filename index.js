const express = require('express')
const app = express()
const port = 80

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, function () {
    console.log('Express started on http://localhost:' + port + '; press Ctrl-C to terminate.');
});