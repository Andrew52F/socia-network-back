import express from 'express';
import Post from '../models/Post.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  }
  catch (error) {
    res.json({message: error})
  }
})

router.get('/:postId', async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    res.json(post);
  }
  catch(error) {
    req.json({message: error})
  }
})

router.post('/', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
  })
  try {
    const savedPost = await post.save();
    res.json(savedPost);
  }
  catch (error) {
    res.json({message: error});
  }
})

router.patch('/:postId', async (req, res) => {
  const postId = req.params.postId;
  const updatedParameters = req.body;
  try {
    const updatedPost = await Post.updateOne({_id: postId}, {$set: {...updatedParameters}})
    res.json(updatedPost);
  }
  catch (error) {
    res.json({message: error})
  }
})

router.delete('/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const removedPost = await Post.remove({_id: postId})
    res.json(removedPost);
  }
  catch (error) {
    res.json({message: error})
  }
})

export default router;