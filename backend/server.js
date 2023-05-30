import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import dbConfig from './dbConfig.js';
import mysql from 'mysql2'

// Create a connection
const connection = mysql.createConnection(dbConfig);

// Connect to the MySQL server
// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//   }
//   console.log('Connected to MySQL server');
// });

// connection.end((err) => {
//   if (err) {
//     console.error('Error closing MySQL connection:', err);
//     return;
//   }
//   console.log('MySQL connection closed');
// });

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


      // Connect to the MySQL server
      connection.connect((err) => {
        if (err) {
          console.error('Error connecting to MySQL:', err);
          return;
        }
        console.log('Connected to MySQL server');

        // const updatedFilesArray = ['filename1', null, 'filename3', null, null, 'filename6', null, 'filename8', 'filename9'];

        const query = `
    INSERT INTO applyforwork (fileAttach1, fileAttach2, fileAttach3, fileAttach4, fileAttach5, fileAttach6, fileAttach7, fileAttach8, fileAttach9)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

        const dataArray = updatedFilesArray.map((file, index) => {
          return file !== null ? file : '';
        });

        connection.query(query, dataArray, (error, results) => {
          if (error) {
            console.error('Error inserting data into MySQL:', error);
            return;
          }
          console.log('Data inserted successfully');

        });
      });

      // console.log("Server-side files array: ", arrayFiles);
      // console.log("ModifyName array: ", modifiedFileNameArray);
      // console.log('updateFile array: ', updatedFilesArray)
      res.send('File upload complete!');
    }
  });
});




app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
