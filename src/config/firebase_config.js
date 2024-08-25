import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";

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
const auth = firebase.auth(); // Use firebase.auth() instead of app.auth()
const googleAuthProvider = new firebase.auth.GoogleAuthProvider(); // Instantiate the provider correctly
const analytics = firebase.analytics();

const signInWithGoogleRedirect = () => auth.signInWithRedirect(googleAuthProvider);

export { firebase, auth, googleAuthProvider, analytics, signInWithGoogleRedirect, clientId };


