import express from 'express';

import todoList from './database/db.js';

import bodyParser from 'body-parser';

import { v4 as uuidv4 } from 'uuid';

const app = express();

app.set('view engine', 'ejs'); // Use to set the template engine

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('styles'))

app.get('/', function (req, res) {

  const data = todoList;

  res.render('index.ejs', { title: 'To do ', data: data });
});

app.get('/add', function (req, res) {

  res.render('add.ejs', { title: 'Add to do list' });

});

app.post('/add/mypost', function (req, res) {

  // body-parser
  const list = req.body.todo;

  const obj = { id: uuidv4(), title: list };

  todoList.push(obj);

  res.redirect('/');
});

app.get('/delete/:id', function (req, res) {
  const id = Number(req.params.id);

  const index = todoList.findIndex((item) => item.id === id);

  todoList.splice(index, 1);

  res.redirect('/');
});

app.get('/details/:id', function (req, res) {
  const id = Number(req.params.id);

  const index = todoList.findIndex((item) => item.id === id);

  const post = todoList[index];

  res.render('details.ejs', { title: post.title })

});

app.get('/edit/:id', (req, res) => {

  const id = Number(req.params.id); // Id

  const index = todoList.findIndex((item) => item.id === id);

  const post = todoList[index];

  res.render('edit.ejs', { title: post.title, id: post.id })
});

app.post('/edit/mypost/:id', (req, res) => {

  const updatedItem = req.body;

  const id = Number(req.params.id);

  const item = updatedItem.editedTodo; // We got update value 

  const index = todoList.findIndex((item) => item.id === id);

  const post = todoList[index];

  post.title = item;

  res.redirect('/');
});

app.listen(8080, function () {
  console.log("App is working on 8080")
})