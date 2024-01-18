const express = require('express');
const exphbs = require('express-handlebars').create({
  extname: '.hbs',
  layoutsDir: __dirname + '/views/layouts/', // Specify a non-existent directory
  defaultLayout: false, // Disable layouts
});
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB (replace 'your_connection_url' with your actual MongoDB connection URL)
mongoose.connect('mongodb://0.0.0.0:27017/paramshah', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a Mongoose schema and model for storing image information
const ImageSchema = new mongoose.Schema({
  filename: String,
  path: String,
});

const Image = mongoose.model('Image', ImageSchema, 'userimages'); // Specify 'userimages' as the collection name

// Set up Handlebars as the view engine
app.engine('.hbs', exphbs.engine);
app.set('view engine', '.hbs');

// Set the 'views' directory for your templates
app.set('views', path.join(__dirname, 'views'));

// Set up Multer storage and specify the destination for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Uploads will be stored in the 'uploads/' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Set the filename to be unique
  },
});

const upload = multer({ storage: storage });

// Render the file upload form
app.get('/', (req, res) => {
  res.render('upload');
});

// Use Multer middleware for handling file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
  // Access uploaded file details using req.file
  const { filename, path } = req.file;

  // Save image information to MongoDB
  const newImage = new Image({ filename, path });
  await newImage.save();

  res.send('File uploaded and information saved to MongoDB!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
