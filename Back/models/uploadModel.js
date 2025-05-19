const path = require('path');

// Define the absolute path for the images directory
const absoluteImagesPath = '/var/www/react-app/images';

const saveFile = (file) => {
  // Construct the absolute path to the saved file
  const filePath = path.join(absoluteImagesPath, file.filename);
  return filePath;
};

module.exports = { saveFile };
