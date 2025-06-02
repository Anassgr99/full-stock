import path from 'path';

// Define the absolute path for the images directory
const absoluteImagesPath = '/var/www/react-app/images';

export const saveFile = (file) => {
  const filePath = path.join(absoluteImagesPath, file.filename);
  return filePath;
};
