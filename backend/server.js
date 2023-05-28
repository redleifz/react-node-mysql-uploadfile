import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
    // cb(null, "/Users/jongjate/Desktop/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "mydb",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }

  console.log("Connected to MySQL database!");

  // Start your server or perform any other actions here
  // ...
});

app.post("/upload", upload.single("image"), (req, res) => {
  const image = req.file.filename;
  const sql = `INSERT INTO images (url) VALUES (?)`;
  db.query(sql, [image], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ status: "Error" }); // Update the response accordingly
    }
    return res.json({ status: "Success" }); // Update the response accordingly
  });
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
