export default class NotificationDto {
  id;
  someone;
  type;
  date;
  data;

  

  constructor(notificationModel, {someone, someoneImage}) {
    this.id = notificationModel.id;
    this.type = notificationModel.type;
    this.data = notificationModel.data;
    this.date = notificationModel.date;

    if (someone) {
      const someoneObj = {}
      someoneObj.username = someone.username;
      someoneObj.id = someone.id;
      if (someoneImage) {
        someoneObj.image = someoneImage.url;
      }
      this.sender = someoneObj;
    }
  }
}
