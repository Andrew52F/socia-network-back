import { validationResult } from 'express-validator';
import authUserService from '../services/authUserService.js';
import AuthError from '../exceptions/authError.js';
import postsService from '../services/postsService.js';


class PostsController {

  async createPost (req, res, next) {
    try {
      const data = req.body;
      const ourId = req.authUser.id;

      const newPost = await postsService.createPost(ourId, data);

      return res.json(newPost);
    }
    catch (error) {
      next(error)
    }
  }

  async updatePost (req, res, next) {
    try {
      const ourId = req.authUser.id;
      const data = req.body;
      const { postId } = req.params;

      const updatedPost = await postsService.updatePost(ourId, data, postId);
      return res.json(updatedPost);
    }
    catch (error) {
      next(error)
    }
  }

  async removePost (req, res, next) {
    try {
      const ourId = req.authUser.id;
      const { postId } = req.params;
      const deletedPostId = await postsService.removePost(ourId, postId);
      return res.json(deletedPostId);
    }
    catch (error) {
      next(error)
    }
  }

  async getUsersPosts (req, res, next) {
    try {
      const { username } = req.params;
      const ourId = req.authUser.id;
      const { dozen } = req.query;

      const posts = await postsService.getUsersPosts(ourId, username, dozen)

      return res.json(posts);
    }
    catch (error) {
      next(error)
    }
  }

  async getPostsComments(req, res, next) {
    try {
      const { postId } = req.params;
      const ourId = req.authUser.id;
      const { dozen } = req.query;

      const comments = await postsService.getPostsComments(ourId, postId, dozen);
      return res.json(comments)
    }
    catch (error) {
      next(error)
    }
  }
}

export default new PostsController;