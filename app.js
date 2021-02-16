const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  if (req.session.authenticated === true) {
    return res.redirect('/send-money');
  }

  res.render('log-in', {
    failed: false
  });
});

app.post('/', (req, res) => {
  if (req.body.username === 'username' || req.body.password === 'password') {
    req.session.authenticated = true;
    return res.redirect('/send-money');
  }

  res.render('log-in', {
    failed: true
  });
});

app.get('/send-money', (req, res) => {
  if (req.session.authenticated === true) {
    return res.render('send-money', {
      msg: req.session.msg
    });
  }
  res.redirect('/');
});

app.post('/send-money', (req, res) => {
  const {
    accountNumber,
    amount
  } = req.body;

  if (req.session.authenticated === false) {
    return res.redirect('/');
  }

  req.session.msg = `$${amount} sent to account number ${accountNumber}`;
  res.redirect('/send-money');
});

app.post('/log-out', (req, res) => {
  req.session.authenticated = false;
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});