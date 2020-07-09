const express = require('express');

const server = express();

server.use(express.json());

const userRouter = require('./users/userRouter.js');
const postRouter = require('./posts/postRouter.js');

server.use('/api/users', logger, userRouter);
server.use('/api/posts', logger, postRouter);

server.get('/', logger, (req, res) => {
  const message = process.env.MESSAGE;
  res.status(200).json({ message });
});

//custom middleware

function logger(req, res, next) {
  console.log('Method:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('Timestamp:', new Date());
  next();
}

module.exports = server;
