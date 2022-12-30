const cloudinary = require('cloudinary').v2;
//require cloudinary storage thats node package.

const { CloudinaryStorage } = require('multer-storage-cloudinary');

//Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_S3CRET
});
//This comes what you name on .ENV file.

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCampGrounds',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}