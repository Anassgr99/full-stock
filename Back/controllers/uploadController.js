// const multer = require('multer');
// const path = require('path');

// // Configure storage: save files in front/public/images
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Adjust the relative path according to your project structure
//     const uploadPath = path.join(__dirname, '../../front/public/images');
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     // Generate a unique file name with a timestamp and original extension
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage });

// // Controller function to handle file upload
// const uploadFile = (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded');
//   }
//   // Return the relative URL path of the uploaded file (adjust as needed)
//   res.status(200).send({
//     message: 'File uploaded successfully',
//     // Since the file is now in front/public/images, you might reference it like so:
//     filePath: `/images/${req.file.filename}`,
//   });
// };

// module.exports = { upload, uploadFile };
const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../front/public/images');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique name with timestamp
  },
});

const upload = multer({ storage });

const uploadFile = (req, res) => {
  if (!req.file) {
    apm.captureError(new Error('No file uploaded'));
    return res.status(400).send('No file uploaded');
  }
  res.status(200).send({
    message: 'File uploaded successfully',
    filePath: `/images/${req.file.filename}`, // Return relative URL
  });
};

module.exports = { upload, uploadFile };
const multer = require('multer');
const path = require('path');

// // Define the absolute path for the images directory
const absoluteImagesPath = '/var/www/react-app/images';

// Storage configuration with absolute path
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, absoluteImagesPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique name with timestamp
  },
});

const upload = multer({ storage });

const uploadFile = (req, res) => {
  if (!req.file) {
    apm.captureError(new Error('No file uploaded'));
    return res.status(400).send('No file uploaded');
  }
  res.status(200).send({
    message: 'File uploaded successfully',
    filePath: `/images/${req.file.filename}`, // Returning a relative URL for serving the image
  });
};

module.exports = { upload, uploadFile };