import React, { useState } from "react";
import firebase from "firebase";
import { db, storage } from "../firebase";
//import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { v4 as uuidv4 } from "uuid";
import { Button, CircularProgress, IconButton } from "@mui/material";
import "./ImageUpload.css";

function ImageUpload({ currentUser, openAddPost }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3000000) {
        alert("File is too big! 3 MB Max.");
      } else {
        setImage(file);
      }
    }
  };

  const handleUpload = () => {
    const uuid = uuidv4();

    const uploadTask = storage
      .ref(`images/${currentUser.uid}/posts/${uuid}`)
      .put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref(`images/${currentUser.uid}/posts`)
          .child(`${uuid}`)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              image: url,
              author: {
                uid: currentUser.uid,
                username: currentUser.displayName,
              },
            });

            setProgress(0);
            setCaption("");
            setImage(null);
            openAddPost(false);
            window.scrollTo(0, 0);
          });
      }
    );
  };

  const readURL = (input) => URL.createObjectURL(input);

  return (
    <div className="imageUpload">
      <CircularProgress
        sx={{
          visibility: progress > 0 ? "visible" : "hidden",
          opacity: progress > 0 ? 1 : 0,
        }}
        value={progress}
        max={100}
        variant="static"
      />

      {image ? (
        <img
          style={{ opacity: progress > 0 ? 0.25 : 1 }}
          className="imageUpload__preview"
          src={readURL(image)}
          alt={image.name}
        />
      ) : (
        <div className="imageUpload__previewPlaceholder"></div>
      )}

      <div className="imageUpload__inputContainer">
        <input
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleChange}
          id="icon-button-file"
          type="file"
        />
        <label htmlFor="icon-button-file">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            {/* <PhotoCamera /> */}
          </IconButton>
        </label>

        <input
          className="imageUpload__input"
          type="text"
          placeholder="Enter a caption..."
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
        />
      </div>

      <Button
        sx={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
        }}
        disabled={!image}
        onClick={handleUpload}
      >
        Post
      </Button>
    </div>
  );
}

export default ImageUpload;
