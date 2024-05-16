import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/database";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRyCno4y2inmJFxKtfv-kQtduKr5nO1qc",
  authDomain: "instag-solo-project.firebaseapp.com",
  databaseURL: "https://instag-solo-project-default-rtdb.firebaseio.com",
  projectId: "instag-solo-project",
  storageBucket: "instag-solo-project.appspot.com",
  messagingSenderId: "333996509925",
  appId: "1:333996509925:web:d00fb93890224d6b5ca20c",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig); 

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
