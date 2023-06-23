
import ImageDto from '../dtos/ImageDto.js';
import Image from '../models/Image.js';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_KEY, 
  api_secret: process.env.CLOUD_SECRET
});

const imageTypes = {
  user: {
    folder: 'users',
    width: 300,
    height: 300,
    crop: 'fill'
  },
  post: {
    folder: 'posts',
    // width: 900,
    // height: 900,
    // crop: 'fill'
  }

}

class ImagesService {

  async add(imageData, type = 'post') {

    const config = imageTypes[type];
    console.log('WORKS')
    const imageResponse = await cloudinary.uploader.upload(imageData, config)
    console.log('IMAGE RESPONSE: ', imageResponse);
    if (!imageResponse) {
      throw new Error('Image upload error')
    }
    const image = new Image({public_id: imageResponse.public_id, url: imageResponse.secure_url})
    await image.save();

    console.log('NEW IMAGE: ', image)
    return image;
  }
  
  async getImage(imageId) {
    const image = await Image.findById(imageId);
    return image;
  }

  async updateImage(imageData, type='post', imageId) {
    const image = await Image.findById(imageId);

    const config = imageTypes[type];

    config.public_id = image.public_id;

    const imageResponse = await cloudinary.uploader.upload(imageData, config)
    if (!imageResponse) {
      throw new Error('Image update error')
    }
    return image;
  }
}

export default new ImagesService();