import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDkmQT8WyNFRwTSzvBYlB_xUNDqQS_UMjk",
    authDomain: "luckychat-286b1.firebaseapp.com",
    databaseURL: "https://luckychat-286b1.firebaseio.com",
    projectId: "luckychat-286b1",
    storageBucket: "luckychat-286b1.appspot.com",
    messagingSenderId: "74950354939",
    appId: "1:74950354939:web:6e54a8159ed01be3eecd5e"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

export {firebase, auth};