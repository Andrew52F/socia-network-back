export default class PostDto {
  id;
  page;
  author;
  text;
  image;
  date;
  likeCount;
  dislikeCount;
  commentsCount;


  constructor(postModel, {image, commentsCount}) {
    this.id = postModel.id
    this.author = postModel.authorId;
    this.date = postModel.date;
    this.page = postModel.page;
    this.text = postModel.text;
    this.likeCount = postModel.likedUsersId.length;
    this.dislikeCount = postModel.dislikedUsersId.length;
    this.commentsCount = commentsCount;

    (image &&  (this.image = image.url))
  }
}