const cloudinary = require('cloudinary').v2;
const { RemoteStorage } = require ('multer-remote-storage');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.API_SECRET
})

const storage = new RemoteStorage({
    client:cloudinary,
    params: {
        folder:'threads'
    }
});

module.exports = {
    cloudinary,
    storage
}