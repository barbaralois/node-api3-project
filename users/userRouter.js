const express = require('express');

const Users = require('./userDb.js');
const Posts = require('../posts/postDb.js');

const router = express.Router();

router.post('/', validateUser, async (req, res) => {
  const newUser = req.body;
  try {
    await Users.insert(newUser);
    res.status(201).json(newUser);
  } catch {
    res
      .status(500)
      .json({ message: 'There was an error saving the user to the database.' });
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  const newPost = req.body;
  newPost.user_id = req.user.id;
  try {
    console.log(req.body);
    await Posts.insert(newPost);
    res.status(201).json(newPost);
  } catch {
    res.status(500).json({
      message: 'There was an error saving the post to the database.',
    });
  }
});

router.get('/', async (req, res) => {
  try {
    let allUsers = await Users.get();
    res.status(200).json(allUsers);
  } catch {
    res.status(500).json({ message: 'There was an error retrieving users.' });
  }
});

router.get('/:id', validateUserId, async (req, res) => {
  try {
    let selected = await Users.getById(req.user.id);
    res.status(200).json(selected);
  } catch {
    res
      .status(500)
      .json({ message: 'The user information could not be retrieved' });
  }
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  try {
    let posts = await Users.getUserPosts(req.user.id);
    res.status(200).json(posts);
  } catch {
    res.status(500).json({ message: 'The posts could not be retrieved.' });
  }
});

router.delete('/:id', validateUserId, async (req, res) => {
  try {
    await Users.remove(req.user.id);
    res.status(200).json({ message: 'The user has been deleted.' });
  } catch {
    res.status(500).json({ message: 'There was an error deleting the user.' });
  }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
  try {
    await Users.update(req.user.id, req.body);
    res.status(200).json({ message: 'The user has been updated.' });
  } catch {
    res
      .status(500)
      .json({ message: 'There was an error modifying the user information.' });
  }
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;
  Users.getById(id)
    .then((userId) => {
      if (userId) {
        req.user = userId;
        next();
      } else {
        res.status(404).json({ message: 'invalid user id' });
      }
    })
    .catch((err) => res.status(500).json({ message: 'error validating id' }));
}

function validateUser(req, res, next) {
  const body = req.body;
  if (!body) {
    res.status(400).json({ message: 'missing user data' });
  } else if (!body.name) {
    res.status(400).json({ message: 'missing required name field' });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  const body = req.body;
  if (!body) {
    res.status(400).json({ message: 'missing post data' });
  } else if (!body.text) {
    res.status(400).json({ message: 'missing required text field' });
  } else {
    next();
  }
}

module.exports = router;
