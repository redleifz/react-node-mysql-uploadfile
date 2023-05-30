import axios from "axios";
import React, { useState, useRef } from "react";

const FileUpload = () => {
  const [files, setFiles] = useState(Array(9).fill(null));

  const fileInputs = useRef([]);

  const handleFileChange = (e, index) => {
    const updatedFiles = [...files];
    updatedFiles[index] = e.target.files[0];
    setFiles(updatedFiles);
  };

  const handleUpload = () => {
    const formData = new FormData();

    const filesArray = Array(9).fill(null);

    files.forEach((file, index) => {
      if (file) {
        formData.append(`files`, file);
        filesArray[index] = file.name;
      }
    });

    // console.log("Client-side files array:", filesArray);

    // Append filesArray to the formData
    formData.append('filesArray', JSON.stringify(filesArray));

    axios
      .post("http://localhost:8080/api/upload", formData)
      .then((res) => {
        console.log(res.data);

        // Clear file input values after successful upload
        fileInputs.current.forEach((input) => {
          input.value = null; // Reset the value to null
        });

        // Clear the files state
        setFiles(Array(9).fill(null));
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
    <div>
      {files.map((file, index) => (
        <div key={index}>
          {index + 1}
          <input
            ref={(input) => (fileInputs.current[index] = input)}
            type="file"
            onChange={(e) => handleFileChange(e, index)}
          />
        </div>
      ))}
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
