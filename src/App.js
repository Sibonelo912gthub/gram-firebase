import React, { useState, useEffect } from "react";
import Post from "./components/Post";
import ImageUpload from "./components/ImageUpload";
import "./App.css";
import { auth } from "./firebase";
import { db } from "./firebase";
import Profile from "./components/Profile";
import firebase from "firebase";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
//import AddIcon from "@mui/icons-material/Add";
//import FavoriteIcon from "@mui/icons-material/Favorite";
import Akhil from "./components/assets/akhil.png";

function getModalStyle() {
  const top = "auto";
  const left = "auto";
  const width = 500;

  return {
    top: `${top}%`,
    left: `${left}%`,
    // transform: `translate(-${top}%, -${left}%)`,
    backdrop: "rgba(0, 0, 0, 0.5)",
    width: `${width}px`,
  };
}

function App() {
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openAddPost, setOpenAddPost] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setDisplay(true);
    }, 300);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const handleSignUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        db.collection("users").doc(authUser.user.uid).set({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          uid: authUser.user.uid,
          photoURL: authUser.user.photoURL,
        });
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const handleSignIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  const handlePostUpload = () => {
    setOpenAddPost(true);
  };

  return (
    <div className="app">
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Modal open={open} onClose={() => setOpen(false)} sx={modalStyle}>
          {/* Sign Up Modal Content */}

          <div style={modalStyle}>
            <form
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                marginLeft: "390px",
              }}
              sx={{
                backgroundColor: "#17a2b8",
                color: "#fff",
                borderColor: "#17a2b8",
                padding: "10px 20px",
                borderRadius: "5px",
                marginRight: "5px",
                marginTop: "5px",
              }}
              className="app__signUp"
            >
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt="instagram logo"
                style={{ width: 102, marginLeft: 125 }}
              />
              <input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                // sx={{
                //   backgroundColor: "blue",
                //   color: "white",
                //   padding: "10px 20px",
                //   borderRadius: "5px",
                // }}
                style={{
                  marginLeft: 0,
                  color: "#17a2b8",
                  borderColor: "#17a2b8",
                  width: "100%",
                  marginRight: "300px",
                }}
                type="submit"
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </form>
          </div>
        </Modal>

        <Modal
          open={openSignIn}
          onClose={() => setOpenSignIn(false)}
          sx={modalStyle}
        >
          {/* Sign In Modal Content */}

          <div style={modalStyle}>
            <form
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                marginLeft: "390px",
              }}
              className="app__signUp"
            >
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt="instagram logo"
                style={{ width: 102, marginLeft: 125 }}
              />
              <input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                // sx={{
                //   backgroundColor: "blue",
                //   color: "white",
                //   padding: "10px 20px",
                //   borderRadius: "5px",
                // }}
                style={{
                  marginLeft: 0,
                  color: "#17a2b8",
                  borderColor: "#17a2b8",
                  width: "100%",
                  marginRight: "300px",
                }}
                type="submit"
                onClick={handleSignIn}
              >
                Sign In
              </Button>
            </form>
          </div>
        </Modal>
      </div>

      {user && (
        <Modal
          open={openAddPost}
          onClose={() => setOpenAddPost(false)}
          sx={modalStyle}
        >
          <div>
            <ImageUpload
              currentUser={user}
              openAddPost={(boolean) => setOpenAddPost(boolean)}
            />
          </div>
        </Modal>
      )}

      <div>
        {user && (
          <div>
            {/* App Header */}
            <div
              className="app__header"
              style={{
                opacity: display && 1,
                backgroundColor: "#ffffff",
                height: 20,
                borderBottom: "1px solid #ffffff",
              }}
            >
              {/* Header Content */}

              <div
                className="navbar"
                style={{
                  height: 54,
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#ffffff",
                }}
              >
                <div
                  className="navbar-inner"
                  style={{
                    width: 975,
                    height: "100%",
                    display: "flex",
                    padding: "0px 20px",
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <div className="logo cursor" style={{ width: 360 }}>
                    <img
                      src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                      alt="instagram logo"
                      style={{ width: 102 }}
                    />
                  </div>

                  <div className="search-bar">
                    <div
                      className="search-bar-inner"
                      styles={{
                        backgroundColor: "#fafafa",
                        borderRadius: 3,
                        padding: 2,
                        border: "1px solid #dbdbdb",
                        alignItems: "center",
                        justifyItems: "center",
                      }}
                    >
                      <input
                        placeholder="Search"
                        style={{ border: 0, backgroundColor: "#fafafa" }}
                      />
                    </div>
                  </div>

                  {/* upload button */}
                  <span>
                    <Button
                      className="upload-btn"
                      style={{
                        marginLeft: 22,
                        color: "#17a2b8",
                        borderColor: "#17a2b8",
                        borderRadius: 3,
                      }}
                      onClick={handlePostUpload}
                    >
                      Upload
                    </Button>
                  </span>

                  <div
                    className="class"
                    style={{ marginLeft: 22, paddingTop: 1 }}
                  >
                    <a href="/" tabindex="0">
                      <svg
                        aria-label="Home"
                        class="_8-yf5"
                        fill="#262626"
                        height="22"
                        viewBox="0 0 48 48"
                        width="22"
                      >
                        <path d="M45.5 48H30.1c-.8 0-1.5-.7-1.5-1.5V34.2c0-2.6-2.1-4.6-4.6-4.6s-4.6 2.1-4.6 4.6v12.3c0 .8-.7 1.5-1.5 1.5H2.5c-.8 0-1.5-.7-1.5-1.5V23c0-.4.2-.8.4-1.1L22.9.4c.6-.6 1.6-.6 2.1 0l21.5 21.5c.3.3.4.7.4 1.1v23.5c.1.8-.6 1.5-1.4 1.5z"></path>
                      </svg>
                    </a>
                  </div>

                  <div
                    className="margin-left"
                    style={{ marginLeft: 22, paddingTop: 1 }}
                  >
                    <a class="xWeGp" href="/direct/inbox/" tabindex="0">
                      <svg
                        aria-label="Direct"
                        class="_8-yf5"
                        fill="#262626"
                        height="22"
                        viewBox="0 0 48 48"
                        width="22"
                      >
                        <path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"></path>
                      </svg>
                    </a>
                  </div>

                  <div
                    className="margin-left"
                    style={{ marginLeft: 22, paddingTop: 1 }}
                  >
                    <a href="/explore/" tabindex="0">
                      <svg
                        aria-label="Find People"
                        class="_8-yf5"
                        fill="#262626"
                        height="22"
                        viewBox="0 0 48 48"
                        width="22"
                      >
                        <path
                          clip-rule="evenodd"
                          d="M24 0C10.8 0 0 10.8 0 24s10.8 24 24 24 24-10.8 24-24S37.2 0 24 0zm0 45C12.4 45 3 35.6 3 24S12.4 3 24 3s21 9.4 21 21-9.4 21-21 21zm10.2-33.2l-14.8 7c-.3.1-.6.4-.7.7l-7 14.8c-.3.6-.2 1.3.3 1.7.3.3.7.4 1.1.4.2 0 .4 0 .6-.1l14.8-7c.3-.1.6-.4.7-.7l7-14.8c.3-.6.2-1.3-.3-1.7-.4-.5-1.1-.6-1.7-.3zm-7.4 15l-5.5-5.5 10.5-5-5 10.5z"
                          fill-rule="evenodd"
                        ></path>
                      </svg>
                    </a>
                  </div>

                  <div
                    className="margin-left"
                    style={{ marginLeft: 22, paddingTop: 1 }}
                  >
                    <a class="_0ZPOP kIKUG" href="/accounts/activity/">
                      <svg
                        aria-label="Activity Feed"
                        class="_8-yf5"
                        fill="#262626"
                        height="22"
                        viewBox="0 0 48 48"
                        width="22"
                      >
                        <path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                      </svg>
                    </a>
                  </div>

                  <div
                    className="profile-pic"
                    style={{ marginLeft: 22, marginTop: 1, width: 35 }}
                  >
                    {user ? (
                      <div className="app__logoutContainer">
                        <Profile user={user} setUser={(usr) => setUser(usr)} />
                      </div>
                    ) : (
                      <div className="app__loginContainer">
                        <Button
                          sx={{
                            backgroundColor: "blue",
                            color: "white",
                            padding: "10px 20px",
                            borderRadius: "5px",
                          }}
                          onClick={() => setOpenSignIn(true)}
                        >
                          Sign In
                        </Button>
                        <Button
                          sx={{
                            backgroundColor: "blue",
                            color: "white",
                            padding: "10px 20px",
                            borderRadius: "5px",
                          }}
                          onClick={() => setOpen(true)}
                        >
                          Sign Up
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* <p style={{ marginLeft: 22 }}>{user.username}</p> */}
                </div>
              </div>

              {/* logout btn */}
              <Button
                sx={{
                  color: "#17a2b8",
                  borderColor: "#17a2b8",
                  padding: "10px 20px",
                  borderRadius: "5px",
                }}
                className="upload-btn"
                style={{
                  marginLeft: 22,
                  color: "#17a2b8",
                  borderColor: "#17a2b8",
                }}
                onClick={() => auth.signOut()}
              >
                logout
              </Button>
            </div>

            <div
              className="stories-posts-sidebar"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fafafa",
              }}
            >
              {/* stories and profile */}
              <div
                className="stories-posts"
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <div
                  className="app__posts"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    // justifyContent: "center",
                    alignItems: "start",
                  }}
                >
                  <div
                    className="stories"
                    style={{
                      opacity: display && 1,
                      paddingTop: 30,
                      paddingBottom: 30,
                      marginBottom: 10,
                      border: "1px solid #dbdbdb",
                      borderRadius: 15,
                      backgroundColor: "white",
                      width: 525,
                      height: 80,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="stories-inner"
                      style={{
                        opacity: display && 1,
                        paddingLeft: 22,
                        paddingTop: 10,
                        display: "flex",
                      }}
                    >
                      <div
                        className="story"
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          width: 65,
                          height: 95,
                          marginRight: 15,
                        }}
                      >
                        <img
                          style={{
                            borderRadius: "50%",
                            width: 65,
                          }}
                          class="story-image"
                          alt="akhilboddu"
                          data-testid="user-avatar"
                          draggable="false"
                          src={Akhil}
                        />
                        <div
                          className="story-border"
                          style={{
                            position: "absolute",
                            marginTop: 1.9,
                            marginLeft: 1.9,
                            height: 64,
                            width: 64,
                            top: -4,
                            left: -4,
                            border: "2px solid #e03d67",
                            borderRadius: "50%",
                          }}
                        ></div>
                        <span
                          className="story-text"
                          style={{
                            justifyContent: "center",
                            marginLeft: -5,
                            marginTop: 6,
                            marginBottom: 16,
                            letterSpacing: ".01em",
                            maxWidth: 74,
                            fontSize: 12,
                            fontWeight: 400,
                          }}
                        >
                          akhilboddu
                        </span>
                      </div>

                      <div
                        className="story"
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          width: 65,
                          height: 95,
                          marginRight: 15,
                        }}
                      >
                        <img
                          style={{
                            borderRadius: "50%",
                            width: 65,
                          }}
                          class="story-image"
                          alt="akhilboddu"
                          data-testid="user-avatar"
                          draggable="false"
                          src={Akhil}
                        />
                        <div
                          className="story-border"
                          style={{
                            position: "absolute",
                            marginTop: 1.9,
                            marginLeft: 1.9,
                            height: 64,
                            width: 64,
                            top: -4,
                            left: -4,
                            border: "2px solid #e03d67",
                            borderRadius: "50%",
                          }}
                        ></div>
                        <span
                          className="story-text"
                          style={{
                            justifyContent: "center",
                            marginLeft: -5,
                            marginTop: 6,
                            marginBottom: 16,
                            letterSpacing: ".01em",
                            maxWidth: 74,
                            fontSize: 12,
                            fontWeight: 400,
                          }}
                        >
                          sbnlomua
                        </span>
                      </div>

                      <div
                        className="story"
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          width: 65,
                          height: 95,
                          marginRight: 15,
                        }}
                      >
                        <img
                          style={{
                            borderRadius: "50%",
                            width: 65,
                          }}
                          class="story-image"
                          alt="akhilboddu"
                          data-testid="user-avatar"
                          draggable="false"
                          src={Akhil}
                        />
                        <div
                          className="story-border"
                          style={{
                            position: "absolute",
                            marginTop: 1.9,
                            marginLeft: 1.9,
                            height: 64,
                            width: 64,
                            top: -4,
                            left: -4,
                            border: "2px solid #e03d67",
                            borderRadius: "50%",
                          }}
                        ></div>
                        <span
                          className="story-text"
                          style={{
                            justifyContent: "center",
                            marginLeft: -5,
                            marginTop: 6,
                            marginBottom: 16,
                            letterSpacing: ".01em",
                            maxWidth: 74,
                            fontSize: 12,
                            fontWeight: 400,
                          }}
                        >
                          Nikhilagarw
                        </span>
                      </div>

                      <div
                        className="story"
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          width: 65,
                          height: 95,
                          marginRight: 15,
                        }}
                      >
                        <img
                          style={{
                            borderRadius: "50%",
                            width: 65,
                          }}
                          class="story-image"
                          alt="akhilboddu"
                          data-testid="user-avatar"
                          draggable="false"
                          src={Akhil}
                        />
                        <div
                          className="story-border"
                          style={{
                            position: "absolute",
                            marginTop: 1.9,
                            marginLeft: 1.9,
                            height: 64,
                            width: 64,
                            top: -4,
                            left: -4,
                            border: "2px solid #e03d67",
                            borderRadius: "50%",
                          }}
                        ></div>
                        <span
                          className="story-text"
                          style={{
                            justifyContent: "center",
                            marginLeft: -5,
                            marginTop: 6,
                            marginBottom: 16,
                            letterSpacing: ".01em",
                            maxWidth: 74,
                            fontSize: 12,
                            fontWeight: 400,
                          }}
                        >
                          cleverqazi
                        </span>
                      </div>

                      <div
                        className="story"
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          width: 65,
                          height: 95,
                          marginRight: 15,
                        }}
                      >
                        <img
                          style={{
                            borderRadius: "50%",
                            width: 65,
                          }}
                          class="story-image"
                          alt="akhilboddu"
                          data-testid="user-avatar"
                          draggable="false"
                          src={Akhil}
                        />
                        <div
                          className="story-border"
                          style={{
                            position: "absolute",
                            marginTop: 1.9,
                            marginLeft: 1.9,
                            height: 64,
                            width: 64,
                            top: -4,
                            left: -4,
                            border: "2px solid #e03d67",
                            borderRadius: "50%",
                          }}
                        ></div>
                        <span
                          className="story-text"
                          style={{
                            justifyContent: "center",
                            marginLeft: -5,
                            marginTop: 6,
                            marginBottom: 16,
                            letterSpacing: ".01em",
                            maxWidth: 74,
                            fontSize: 12,
                            fontWeight: 400,
                          }}
                        >
                          jayshetty
                        </span>
                      </div>

                      <div
                        className="story"
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          width: 65,
                          height: 95,
                          marginRight: 15,
                        }}
                      >
                        <img
                          style={{
                            borderRadius: "50%",
                            width: 65,
                          }}
                          class="story-image"
                          alt="akhilboddu"
                          data-testid="user-avatar"
                          draggable="false"
                          src={Akhil}
                        />
                        <div
                          className="story-border"
                          style={{
                            position: "absolute",
                            marginTop: 1.9,
                            marginLeft: 1.9,
                            height: 64,
                            width: 64,
                            top: -4,
                            left: -4,
                            border: "2px solid #e03d67",
                            borderRadius: "50%",
                          }}
                        ></div>
                        <span
                          className="story-text"
                          style={{
                            justifyContent: "center",
                            marginLeft: -5,
                            marginTop: 6,
                            marginBottom: 16,
                            letterSpacing: ".01em",
                            maxWidth: 74,
                            fontSize: 12,
                            fontWeight: 400,
                          }}
                        >
                          nastycsa
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* App Posts */}
                <div className="app__posts">
                  {posts.map(({ id, post }) => (
                    <Post
                      key={id}
                      postId={id}
                      image={post.image}
                      user={user}
                      author={post.author}
                      caption={post.caption}
                      date={post.timestamp && `${post.timestamp.toDate()}`}
                      modal={{ modalStyle }}
                    />
                  ))}
                </div>
              </div>

              <div
                className="sidebar"
                style={{
                  position: "fixed",
                  top: "120px",
                  right: 90,
                  zIndex: 1000,
                  alignItems: "baseline",
                }}
              >
                <div>
                  <div
                    className="profile-details"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "18px 0 10px 0",
                      padding: 10,
                    }}
                  >
                    <div class="profile-details-pic">
                      <img
                        style={{ height: 56, width: 56, borderRadius: "50%" }}
                        className="story-image"
                        alt="akhilboddu"
                        data-testid="user-avatar"
                        draggable="false"
                        src={Akhil}
                      />
                    </div>
                    <div
                      class="user-details"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: 20,
                      }}
                    >
                      <span
                        class="username"
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        akhilboddu
                      </span>
                      <span
                        class="name"
                        style={{
                          fontSize: 12,
                          fontWeight: 400,
                        }}
                      >
                        Akhil Boddu
                      </span>
                    </div>
                  </div>
                  {/* ****** */}

                  {/* suggestion for you text */}
                  <div className="suggestions">
                    <div
                      className="suggestions-header"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        className="title"
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#8e8e8e",
                          marginRight: 60,
                        }}
                      >
                        Suggestions for you
                      </span>
                      <a
                        className="see-all-btn"
                        href="/"
                        style={{
                          color: "#0056b3",
                          textDecoration: "underline",
                          cursor: "pointer",
                          fontSize: 14,
                        }}
                      >
                        See all
                      </a>
                    </div>
                  </div>

                  {/* suggestions */}
                  <div
                    className="suggestion"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                    }}
                  >
                    <div
                      className="suggestion-details"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div className="suggestion-pic">
                        <img
                          style={{ width: 32, height: 32, borderRadius: "50%" }}
                          alt="imharjotsingh"
                          data-testid="user-avatar"
                          draggable="false"
                          src={Akhil}
                        />
                      </div>

                      <div className="suggestion-profile-details">
                        <div
                          className="profile-name"
                          style={{
                            marginLeft: "10px", // Correcting the units
                            fontSize: "12px", // Adding px unit
                            fontWeight: "bold",
                          }}
                        >
                          imharjot
                        </div>
                        <div
                          className="text-muted"
                          style={{
                            padding: 0,
                            fontSize: "12px", // Adding px unit
                            margin: 0,
                            fontWeight: 400,
                            lineHeight: "14px", // Adding px unit
                            marginLeft: "10px", // Adding px unit
                          }}
                        >
                          New to instagram
                        </div>
                      </div>
                    </div>
                    <a
                      className="follow-btn"
                      style={{ fontSize: 12, textDecoration: "none" }}
                      href="/"
                    >
                      Follow
                    </a>
                  </div>

                  <div
                    className="suggestion"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                    }}
                  >
                    <div
                      className="suggestion-details"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div className="suggestion-pic">
                        <img
                          style={{ width: 32, height: 32, borderRadius: "50%" }}
                          alt="imharjotsingh"
                          data-testid="user-avatar"
                          draggable="false"
                          src={Akhil}
                        />
                      </div>

                      <div className="suggestion-profile-details">
                        <div
                          className="profile-name"
                          style={{
                            marginLeft: "10px", // Correcting the units
                            fontSize: "12px", // Adding px unit
                            fontWeight: "bold",
                          }}
                        >
                          imharjot
                        </div>
                        <div
                          className="text-muted"
                          style={{
                            padding: 0,
                            fontSize: "12px", // Adding px unit
                            margin: 0,
                            fontWeight: 400,
                            lineHeight: "14px", // Adding px unit
                            marginLeft: "10px", // Adding px unit
                          }}
                        >
                          New to instagram
                        </div>
                      </div>
                    </div>
                    <a
                      className="follow-btn"
                      style={{ fontSize: 12, textDecoration: "none" }}
                      href="/"
                    >
                      Follow
                    </a>
                  </div>

                  <div
                    className="suggestion"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                    }}
                  >
                    <div
                      className="suggestion-details"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div className="suggestion-pic">
                        <img
                          style={{ width: 32, height: 32, borderRadius: "50%" }}
                          alt="imharjotsingh"
                          data-testid="user-avatar"
                          draggable="false"
                          src={Akhil}
                        />
                      </div>

                      <div className="suggestion-profile-details">
                        <div
                          className="profile-name"
                          style={{
                            marginLeft: "10px", // Correcting the units
                            fontSize: "12px", // Adding px unit
                            fontWeight: "bold",
                          }}
                        >
                          imharjot
                        </div>
                        <div
                          className="text-muted"
                          style={{
                            padding: 0,
                            fontSize: "12px", // Adding px unit
                            margin: 0,
                            fontWeight: 400,
                            lineHeight: "14px", // Adding px unit
                            marginLeft: "10px", // Adding px unit
                          }}
                        >
                          New to instagram
                        </div>
                      </div>
                    </div>
                    <a
                      className="follow-btn"
                      style={{ fontSize: 12, textDecoration: "none" }}
                      href="/"
                    >
                      Follow
                    </a>
                  </div>

                  <div
                    className="suggestion"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                    }}
                  >
                    <div
                      className="suggestion-details"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div className="suggestion-pic">
                        <img
                          style={{ width: 32, height: 32, borderRadius: "50%" }}
                          alt="imharjotsingh"
                          data-testid="user-avatar"
                          draggable="false"
                          src={Akhil}
                        />
                      </div>

                      <div className="suggestion-profile-details">
                        <div
                          className="profile-name"
                          style={{
                            marginLeft: "10px", // Correcting the units
                            fontSize: "12px", // Adding px unit
                            fontWeight: "bold",
                          }}
                        >
                          imharjot
                        </div>
                        <div
                          className="text-muted"
                          style={{
                            padding: 0,
                            fontSize: "12px", // Adding px unit
                            margin: 0,
                            fontWeight: 400,
                            lineHeight: "14px", // Adding px unit
                            marginLeft: "10px", // Adding px unit
                          }}
                        >
                          New to instagram
                        </div>
                      </div>
                    </div>
                    <a
                      className="follow-btn"
                      style={{ fontSize: 12, textDecoration: "none" }}
                      href="/"
                    >
                      Follow
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* signup and signin logic */}
      {!user ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            sx={{
              backgroundColor: "#17a2b8",
              color: "#fff",
              borderColor: "#17a2b8",
              padding: "10px 20px",
              borderRadius: "5px",
              marginRight: "5px",
              marginTop: "5px",
            }}
            onClick={() => setOpen(true)}
          >
            Sign up
          </Button>

          <Button
            sx={{
              backgroundColor: "#17a2b8",
              color: "#fff",
              borderColor: "#17a2b8",
              padding: "10px 20px",
              borderRadius: "5px",
              marginLeft: "5px",
              marginTop: "5px",
            }}
            onClick={() => setOpenSignIn(true)}
          >
            Sign in
          </Button>
        </div>
      ) : null}

      <footer className="app__footer">
        <p>
          <span className="MadeWithLove">
            Zaio project by {/* <FavoriteIcon />  */}
            <a
              href="https://sibonelo-portfolio.vercel.app/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Sibonelo Mbambo
            </a>{" "}
            &copy; {new Date().getFullYear()}
          </span>
        </p>
      </footer>
    </div>
  );
}

export default App;
