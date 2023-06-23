export default class CommentDto {
  id;
  author;
  text;
  date;
  likeCount;
  dislikeCount;

  constructor(commentModel, {image}) {
    this.id = commentModel.id
    this.author = commentModel.authorId;
    this.date = commentModel.date;
    this.page = commentModel.page;
    this.text = commentModel.text;
    this.likeCount = commentModel.likedUsersId.length;
    this.dislikeCount = commentModel.dislikedUsersId.length;

    (image &&  (this.image = image.url))
  }
}