const express = require('express');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const searchRouter = require('./routes/search');
const writeRouter = require('./routes/write');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/search',searchRouter);
app.use('/write',writeRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});