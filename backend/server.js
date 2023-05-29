import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors()); // Enable CORS for all routes

app.post('/api/upload', upload.array('files'), (req, res) => {
  let filesArray = [];
  
  try {
    filesArray = JSON.parse(req.body.filesArray);
  } catch (error) {
    console.error('Error parsing filesArray:', error);
    res.status(400).json({ error: 'Invalid filesArray' });
    return;
  }

  const processedFilesArray = filesArray.map((filename) => {
    if (!filename) {
      return null;
    }
    
    const uniqueIdentifier = uuidv4();
    const fileParts = filename.split('.');
    const extension = fileParts.length > 1 ? fileParts.pop() : '';
    const name = fileParts.join('.');
    const modifiedFileName = `${name}-${uniqueIdentifier}.${extension}`;
    return modifiedFileName;
  });

  console.log(processedFilesArray)

  // Process the files and processedFilesArray as needed
  // ...

  res.json({ message: 'Upload successful' });
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
