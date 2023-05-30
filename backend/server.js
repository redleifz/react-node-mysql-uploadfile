import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const app = express();

function fileFilter(req, file, cb) {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed.'));
  }
}


app.use(cors()); // Enable CORS for all routes

const uploadDestination = 'D:/employee/files'

if (!fs.existsSync(uploadDestination)) {
  fs.mkdirSync(uploadDestination, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: (req, file, cb) => {
    const uniqueIdentifier = uuidv4();
    const fileParts = file.originalname.split('.');
    const extension = fileParts.length > 1 ? fileParts.pop() : '';
    const name = fileParts.join('.');
    const modifiedFileName = `${name}-${uniqueIdentifier}.${extension}`;
    modifiedFileNameArray.push(modifiedFileName)
    cb(null, modifiedFileName);
  }
});

let modifiedFileNameArray = []; 

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.post('/api/upload', (req, res, next) => {

  modifiedFileNameArray = []; // Clear the array before multer processing
  let updatedFilesArray = []

  upload.array('files')(req, res, (err) => {
    if (err) {
      console.error(err);
      res.status(400).send('Upload failed');
    } else {
      const arrayFiles = JSON.parse(req.body.filesArray);

      let arrayIndex = 0;
      arrayFiles.map((file, index) => {
        if (file === null) {
          updatedFilesArray.push(null)
        } else {
          updatedFilesArray[index] = modifiedFileNameArray[arrayIndex]
          arrayIndex++;
        }
      })

      console.log("Server-side files array: ", arrayFiles);
      // console.log("ModifyName array: ", modifiedFileNameArray);
      console.log('updateFile array: ', updatedFilesArray)
      res.send('File upload complete!');
    }
  });
});




app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
