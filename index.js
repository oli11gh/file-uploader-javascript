const express = require("express");
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 3000;
const app = express();
app.use(
    "/uploads",
    express.static(path.join(__dirname, 'uploads'))
  );
  app.get('/files', (req, res) => {
    const filesPath = path.join(__dirname, 'uploads');
    fs.readdir(filesPath, (err, files) => {
      if (err) {
        res.status(500).send('An error occurred while reading the files.');
      } else {
        res.json(files);
      }
    });
  });
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    const name = req.body.name || file.originalname;
    const extension = path.extname(file.originalname);
    const newFilename = `${name}${extension}`;
    const filePath = path.join(__dirname, 'uploads', newFilename);
  
    fs.rename(file.path, filePath, (err) => {
      if (err) {
        res.send('An error occurred while saving the file.');
      } else {
        res.send('The file has been uploaded');
      }
    });
  });
  const bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({ extended: true }));
  
  app.post('/delete', (req, res) => {
    const filename = req.body.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
  
    fs.unlink(filePath, (err) => {
      if (err) {
        res.send('An error occurred while deleting the file.');
      } else {
        const extension = path.extname(filename);
        const name = path.basename(filename, extension);
        res.send(`FIle ${name}${extension} has deleted`);
      }
    });
  });
  app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});