import React, { useState } from "react";
import axios from "axios";

const FileUPload = () => {
  const [file, setFile] = useState();

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    console.log(file);
  };

  const handleUpload = () => {
    const formdata = new FormData();
    formdata.append("image", file);
    axios
      .post(`http://localhost:8080/upload`, formdata)
      .then((res) => {
        if (res.data.status === "Success") {
          console.log("Succeeded");
        } else {
          console.log("Failed");
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log("Server responded with an error:", err.response.data);
        } else if (err.request) {
          console.log("No response received from the server");
        } else {
          console.log("Error setting up the request", err.message);
        }
      });
  };

  return (
    <div className="container text-white">
      <input onChange={handleFile} type="file" />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUPload;
