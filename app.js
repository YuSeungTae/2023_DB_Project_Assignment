const express = require('express');
const session = require('express-session');



const app = express();
const port = 3000;

// Set up static files in the public directory
app.use(express.static('public'));
app.use(express.urlencoded({extended:true})) // url : Uniform Resource 
app.use(express.json());

app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const searchRouter = require('./routes/search');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/search',searchRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});