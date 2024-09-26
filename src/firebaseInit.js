// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9LrzdiN3_F5PFyWIdCsoC1WWip1BvAMk",
  authDomain: "react-cf59a.firebaseapp.com",
  projectId: "react-cf59a",
  storageBucket: "react-cf59a.appspot.com",
  messagingSenderId: "87390316731",
  appId: "1:87390316731:web:a6956cf51afb41d61e619e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default db;
export { app, auth };

