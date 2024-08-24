import firebase from "firebase";
const firebaseConfig = {
    apiKey: "AIzaSyDYpG7SbXbSzPdh_bd-74zTTh4GdV6edYY",
    authDomain: "rekpark-d6987.firebaseapp.com",
    databaseURL: "https://rekpark-d6987-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "rekpark-d6987",
    storageBucket: "rekpark-d6987.appspot.com",
    messagingSenderId: "123433979350",
    appId: "1:123433979350:web:3703e806b326e0a8026877",
    measurementId: "G-FHBB07043Q"
  };
const clientId = "123433979350-9m6bm26sm837cc94gtmu5udkaiuh5j6s.apps.googleusercontent.com";
const app = firebase.initializeApp(firebaseConfig);
const googleAuthProvider = firebase.auth.GoogleAuthProvider;
const auth = app.auth();
const analytics = app.analytics();
export { firebase, auth, clientId, googleAuthProvider, analytics};