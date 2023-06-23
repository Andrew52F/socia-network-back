import express from 'express';
import { body } from 'express-validator';
import PostsController from '../controllers/PostsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();


router.get('/user/:username', [], PostsController.getUsersPosts);

// router.get('/page/:pagename', [], PostsController.getPagesPosts);

// router.get('/feed', [], PostsController.getFeed);

router.post('/create', [], PostsController.createPost);

router.patch('/:postId', [], PostsController.updatePost);
router.delete('/:postId', [], PostsController.removePost);



export default router;