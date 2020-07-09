const express = require('express');

const server = express();

server.use(express.json());

const userRouter = require('./users/userRouter.js');
const postRouter = require('./posts/postRouter.js');

server.use('/api/users', logger, userRouter);
server.use('/api/posts', postRouter);

server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log('Method:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('Timestamp:', new Date());
  next();
}

module.exports = server;
