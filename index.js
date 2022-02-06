const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(8080, function () {
    console.log('Express started on http://localhost:' + 8080 + '; press Ctrl-C to terminate.');
});