import User from "../models/User.js";
import UsersError from "../exceptions/usersError.js";
import ProfileUserDto from "../dtos/ProfileUserDto.js";
import UserDto from "../dtos/UserDto.js";
import CommentDto from '../dtos/CommentDto.js';
import Image from "../models/Image.js";
import Comment from '../models/Comment.js';
import imagesService from "./imagesService.js";
import UserFriends from "../models/UserFriends.js";
import Notification from "../models/Notification.js";
import NotificationDto from "../dtos/NotificationDto.js";


import Post from "../models/Post.js";
import PostDto from "../dtos/PostDto.js";

class PostsService {

#getRated(post, ourId) {
  if (post.likedUsersId.includes(ourId)) {
    return 'like';
  }
  else if (post.dislikedUsersId.includes(ourId)) {
    return 'dislike';
  }
  else return null;
}

async createPost(ourId, data, pageId = null) {
  const ourUser = await User.findById(ourId).populate('imageId');
  if (!ourUser) {
    throw UsersError.NotFound();
  }
  // const imageId = data.image? (await imagesService.add(data.image)).id : undefined;
  // const page = (page) && await
  const postData = {
    authorId: ourId,
    text: data.text,
  }
    let image;
  if (data.image) {
    image = await imagesService.add(data.image);
    postData.imageId = image.id;
  }
  const newPost = new Post(postData)
  newPost.save();
  const postDto = new PostDto(newPost, {image: image});
  const ourDto = new UserDto(ourUser, ourUser.imageId);
  return {post: postDto, user: ourDto}
}

async getUsersPosts(ourId, username, dozen = 1) {
  const user = await User.findOne({username}).populate('imageId');
  if (!user) {
    throw UsersError.NotFound();
  }
  const skip = (dozen - 1) * 12;
  const posts = await Post.find({authorId: user.id}).sort({ date: 'desc' }).skip(skip).limit(12).populate('imageId');
  const postsDto = posts.map(post => {
    const postDto = new PostDto(post, {image: post.imageId});
    postDto.rated = this.#getRated(post, ourId);
    return postDto;
  });
  const userDto = new UserDto(user, user.imageId);
  return {posts: postsDto, user: userDto};
}

async updatePost(ourId, data, postId) {
  console.log('UPDATE DATA ', ourId, data, postId)
  const post = await Post.findById(postId)
  if (post.authorId.toString() !== ourId) {
    throw UsersError.BadRequest();
  }

if (data.image) {
  imagesService.updateImage(data.image, 'post', post.imageId);
}
if (data.text) {
  post.text = data.text;
}
await post.save();
const newPost = Post.findById(postId).populate('imageId');
const postDto =  new PostDto(post, {image: post.imageId});
return postDto
}

async removePost(ourId, postId) {
  const post = await Post.findById(postId);
  if (post.authorId.toString() !== ourId) {
    throw UsersError.BadRequest();
  }
  await Image.deleteOne({_id: post.imageId});
  await Comment.deleteMany({_id: {$in: post.commentsId}});
  await Post.deleteOne({_id: postId});
  return postId;
}

async ratePost(ourId, postId, type) {
  const post = await Post.findById(postId).populate('imageId');
  if (post[`${type}dUsersId`].includes(ourId)) {
    post[`${type}dUsersId`] = post[`${type}dUsersId`].filter(userId => userId.toString() !== ourId);
  } else {
    post.likedUsersId = post.likedUsersId.filter(userId => userId.toString() !== ourId);
    post.dislikedUsersId = post.dislikedUsersId.filter(userId => userId.toString() !== ourId);

    post[`${type}dUsersId`].push(ourId);
  }
  await post.save();

  const postDto = new PostDto(post, {image: post.imageId});
  postDto.rated = this.#getRated(post, ourId)
  return postDto;
}


async getUsersPosts(ourId, username, dozen = 1) {
  const user = await User.findOne({username}).populate('imageId');
  if (!user) {
    throw UsersError.NotFound();
  }
  const skip = (dozen - 1) * 12;
  const posts = await Post.find({authorId: user.id}).sort({ date: 'desc' }).skip(skip).limit(12).populate('imageId');
  const postsDto = posts.map(post => {
    const postDto = new PostDto(post, {image: post.imageId});
    postDto.rated = this.#getRated(post, ourId);
    return postDto;
  });
  const userDto = new UserDto(user, user.imageId);
  return {posts: postsDto, user: userDto};
}


async getPostComments(ourId, postId, dozen = 1) {
  const post = await User.findById(postId);
  if (!post) {
    throw UsersError.NotFound();
  }
  const skip = (dozen - 1) * 12;
  const comment = await Comment.find({postId: postId}).sort({ date: 'desc' }).skip(skip).limit(12);
  const usersIds = [];
  const commentsDto = comments.map(comment => {
    const commentDto = new CommentDto(comment);
    commentDto.rated = this.#getRated(comment, ourId);
    if (!usersIds.includes(commentDto.authorId)) {
      usersIds.push(commentDto.authorId)
    }
    return commentDto;
  })
  const users = await User.find({'_id': {$in: usersIds}}).populate('imageId')
  console.log('Comments Users ' , users);
  const usersDto = users.map(user => new UserDto(user, user.imageId))
  return {comments: commentsDto, users: usersDto};
}
async createPostComment(ourId, data, postId) {

  const post = Post.findById(postId);
  if (!post) {
    throw UsersError.BadRequest();
  }
  const user = User.findById(ourId);
  if (!user) {
    throw UsersError.BadRequest();
  }
  const comment = new Comment({
    postId,
    ...{data},
    authorId: ourId,
  })
  await comment.save()
  return new CommentDto(comment);


}
async updatePostComment(ourId, data, commentId) {
  const user = User.findById(ourId);
  if (!user) {
    throw UsersError.BadRequest();
  }
  const comment = Comment.findById(commentId);
  if (!comment) {
    throw UsersError.BadRequest();
  }
  if (comment.authorId.toString() !== ourId) {
    throw UsersError.BadRequest();
  }
  if (data.text) {
    comment.text = data.text;
  }

  await comment.save()
  return new CommentDto(comment);
}

async removePostComment(ourId, commentId) {
  const user = User.findById(ourId);
  if (!user) {
    throw UsersError.BadRequest();
  }
  const comment = Comment.findById(commentId);
  if (!comment) {
    throw UsersError.BadRequest();
  }
  if (comment.authorId.toString() !== ourId) {
    throw UsersError.BadRequest();
  }
  await Comment.deleteOne({_id: commentId});
  return commentId
}

}

export default new PostsService();