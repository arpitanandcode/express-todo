import express from 'express';
import todoList from './database/db.js';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
const app = express();

app.set('view engine', 'ejs'); // Use to set the template engine

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  const data = todoList;
  res.render('index.ejs', { title: 'To do ', data: data });
});

app.get('/add', function (req, res) {
  res.render('add.ejs', { title: 'Add to do list' });
});

app.post('/add/mypost', function (req, res) {
  // need the submitted value
  // body-parser
  const list = req.body.todo;
  const obj = { id: uuidv4(), title: list };
  todoList.push(obj);

  res.redirect('/');
});

app.listen(8080, function () {
  console.log("App is working on 8080")
})