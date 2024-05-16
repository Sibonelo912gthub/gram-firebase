import React, { useState } from "react";
import "./Profile.css";
import { auth, db, storage } from "../firebase";
import { fixImageOrientation } from "../utils/fixImageFileOrientation";
import Avatar from "@mui/material/Avatar";
import { Button, CircularProgress, Modal } from "@mui/material";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    backdrop: "rgba(0, 0, 0, 0.5)",
  };
}

function Profile({ user }) {
  const [modalStyle] = useState(getModalStyle());
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [avatar, setAvatar] = useState(user.photoURL);
  const [progress, setProgress] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) {
        alert("File is too big! 2 MB Max.");
      } else {
        fixImageOrientation(file).then((newFile) => setImage(newFile));
      }
    }
  };

  const readURL = (input) => URL.createObjectURL(input);

  const handleSave = (event) => {
    event.preventDefault();

    const uploadTask = storage
      .ref(`images/${user.uid}/profile/${user.uid}`)
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
          .ref(`images/${user.uid}/profile`)
          .child(`${user.uid}`)
          .getDownloadURL()
          .then((url) => {
            auth.currentUser
              .updateProfile({
                photoURL: url,
              })
              .then(() => {
                db.collection("users")
                  .doc(`${user.uid}`)
                  .update({
                    photoURL: url,
                  })
                  .then(() => {
                    setAvatar(url);
                    setProgress(0);
                    setImage(null);
                    setOpen(false);
                    window.scrollTo(0, 0);
                  });
              })
              .catch((error) => alert(error.message));
          });
      }
    );
  };

  const handleDelete = () => {
    db.collection("posts")
      .where(`author.uid`, "==", user.uid)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => doc.ref.delete());
      })
      .then(() => {
        auth.currentUser.delete().catch((error) => alert(error.message));
      })
      .catch((error) => alert(error.message));

    setOpen(false);
    setOpenDelete(false);
  };

  return (
    <div className="profile">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        BackdropProps={{
          sx: { backdropFilter: "blur(25px) saturate(120%)" },
        }}
      >
        <div
          className="paper"
          style={{ marginLeft: 320, width: "50%", marginTop: 50 }}
        >
          <form className="profile__preferences">
            <CircularProgress
              style={{ display: progress > 0 ? "block" : "none" }}
              className="profile__progress"
              value={progress}
              max={100}
              variant="static"
            />
            <input
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleChange}
              id="icon-button-file"
              type="file"
            />
            <label htmlFor="icon-button-file">
              <Avatar
                style={{
                  opacity: progress > 0 ? 0.25 : 1,
                  width: "140px",
                  height: "140px",
                }}
                className="profile__addAvatar"
                alt={user.displayName}
                src={
                  image
                    ? readURL(image)
                    : avatar
                    ? avatar
                    : `/static/images/avatar/1.jpg`
                }
              />
            </label>
            <Button
              sx={{
                backgroundColor: "blue",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
              className="profile__save"
              type="submit"
              disabled={!image}
              onClick={handleSave}
            >
              Save
            </Button>

            <Button
              sx={{
                backgroundColor: "blue",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
              className="profile__logout"
              onClick={() => auth.signOut()}
            >
              Logout
            </Button>

            <Button
              sx={{
                backgroundColor: "blue",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
              className="profile__delete"
              onClick={() => setOpenDelete(true)}
            >
              Delete Account
            </Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        BackdropProps={{
          sx: { backdropFilter: "blur(25px) saturate(120%)" },
        }}
      >
        <div style={modalStyle} className="paper">
          <h3>Delete Account</h3>
          <p>
            Are you sure you want to <strong>permanently</strong> delete your
            account?
          </p>
          <div className="profile__deleteModalButtonGroup">
            <Button
              sx={{
                backgroundColor: "blue",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
              className="profile__delete"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <Avatar
        className="profile__avatar"
        alt={user.displayName}
        src={avatar}
        onClick={() => setOpen(true)}
      />
    </div>
  );
}

export default Profile;
