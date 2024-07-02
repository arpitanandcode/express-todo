import express from 'express';

import todoList from './database/db.js';

import bodyParser from 'body-parser';

import { v4 as uuidv4 } from 'uuid';

import { fileURLToPath } from "url";

import path, { dirname } from "path";

import userList from './database/user.js';

import session from "express-session";

import mongoose from 'mongoose';
import Task from './models/taskSchema.js';

const app = express();

app.use(session({
  secret: 'express-to-do',
  resave: false,
  saveUninitialized: true
}))

app.set('view engine', 'ejs'); // Use to set the template engine

app.use(bodyParser.urlencoded({ extended: true }));

// to add an external file.

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'styl'))); // to add any external styleeshet

app.get('/', function (req, res) {
  // Select * from tasks where title='aRPIT';
  // Select title, age from task where rgmtelkrnmr;
  Task.aggregate([
    {
      $limit: 5
    },
    {
      $match: { title: /Ar/i }
    },
    {
      $addFields: { 'age': 29 }
    },
    {
      $project: {
        title: 1,
        _id: 1,
      }
    },
    {
      $sort: {
        title: -1
      }
    },
  ]).then(response => {
    console.log(response);
    res.render('index.ejs', { title: 'To do ', data: response });
  }).catch(err => {
    console.log(err);
  });
});

app.get('/add', function (req, res) {
  res.render('add.ejs', { title: 'Add to do list' });
});

app.post('/add/mypost', function (req, res) {

  // body-parser
  const list = req.body.todo;

  const obj = { title: list };

  // todoList.push(obj);

  Task.create(obj).then(response => {
    res.redirect('/');
  }).catch(err => {
    console.error(err);
  })
});

app.get('/delete/:id', function (req, res) {
  const id = (req.params.id);

  // const index = todoList.findIndex((item) => item.id === id);

  // todoList.splice(index, 1);

  Task.deleteOne({ _id: id }).then(resp => {
    console.log(res);
    res.redirect('/');
  }).catch(err => {
    console.log(err);
  })

});

app.get('/details/:id', function (req, res) {
  const id = (req.params.id);

  // const index = todoList.findIndex((item) => item.id === id);

  // const post = todoList[index];
  // Select * from tasks where _id = id;
  Task.findById(id).then(respons => {
    console.log(respons);
    res.render('details.ejs', { title: respons?.title })
  })
});

app.get('/edit/:id', (req, res) => {

  const id = (req.params.id); // Id

  // const index = todoList.findIndex((item) => item.id === id);

  // const post = todoList[index];
  Task.findById(id).then(respons => {
    console.log(respons);
    res.render('edit.ejs', { title: respons.title, id: respons.id })
  })


});

app.post('/edit/mypost/:id', (req, res) => {

  const updatedItem = req.body;

  const id = (req.params.id);

  const item = updatedItem.editedTodo; // We got update value 

  // const index = todoList.findIndex((item) => item.id === id);

  // const post = todoList[index];

  // post.title = item;
  // UPDATE TABLE-NAME SET SOMETHING WHERE USER_ID-ID
  Task.updateOne({ _id: id }, { $set: { title: item } }).then(responses => {
    res.redirect('/');
  })

});

app.get('/register', (req, res) => {
  if (req?.session?.user) {
    res.redirect('/profile');
    return false;
  }
  res.render('register.ejs', { title: 'Register me!' });
});

app.post('/register/post', (req, res) => {
  const users = userList;
  users.push(req.body);
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  if (req?.session?.user) {
    res.redirect('/profile');
    return false;
  }
  res.render('login.ejs', { title: 'Login me!' });
});

app.post('/login/post', (req, res) => {

  // This is user entered
  const user = req.body;

  const users = userList;
  const index = users.findIndex(function (item) {
    if (item.email === user.email && item.password === user.password) {
      return true;
    }
  });

  if (index !== -1) {
    // Save to session
    req.session.user = user;
    res.redirect('/profile');
  }
});

app.get('/profile', (req, res) => {
  if (req?.session?.user) {
    res.render('profile.ejs', { user: req.session.user })
  } else {
    res.redirect('/login');
  }
})

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});


app.listen(8080, function () {
  // URI
  mongoose.connect('mongodb+srv://dev:dev123@dev.qsf5a4u.mongodb.net/?retryWrites=true&w=majority&appName=dev').then(respose => {
    console.log("App is working on 8080")
  }).catch(err => {
    console.log(err);
  })
})