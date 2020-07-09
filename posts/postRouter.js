const express = require('express');

const Posts = require('./postDb.js');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let allPosts = await Posts.get();
    res.status(200).json(allPosts);
  } catch {
    res.status(500).json({ message: 'There was an error retrieving posts.' });
  }
});

router.get('/:id', validatePostId, async (req, res) => {
  try {
    let selected = await Posts.getById(req.post.id);
    res.status(200).json(selected);
  } catch {
    res
      .status(500)
      .json({ message: 'The post information could not be retrieved' });
  }
});

router.delete('/:id', validatePostId, async (req, res) => {
  try {
    await Posts.remove(req.post.id);
    res.status(200).json({ message: 'The post has been deleted.' });
  } catch {
    res.status(500).json({ message: 'There was an error deleting the post.' });
  }
});

router.put('/:id', validatePostId, async (req, res) => {
  try {
    await Posts.update(req.post.id, req.body);
    res.status(200).json({ message: 'The post has been updated.' });
  } catch {
    res.status(500).json({ message: 'There was an error modifying the post.' });
  }
});

// custom middleware

function validatePostId(req, res, next) {
  const id = req.params.id;
  Posts.getById(id)
    .then((postId) => {
      if (postId) {
        req.post = postId;
        next();
      } else {
        res.status(404).json({ message: 'invalid post id' });
      }
    })
    .catch((err) => res.status(500).json({ message: 'error validating id' }));
}

module.exports = router;
