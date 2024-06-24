const express = require('express');
const path = require('path');

const app = express();

const PATH = path.join(__dirname, 'partials');

app.get('/', function (req, res) {
  res.sendFile(PATH + "/index.html");
})

app.get('/profile/', function (req, res) {
  res.sendFile(PATH + "/about.html");
})

app.listen(8080, function () {
  console.log("App is working on 8080")
})