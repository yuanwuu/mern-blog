// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-c92db.firebaseapp.com",
  projectId: "mern-blog-c92db",
  storageBucket: "mern-blog-c92db.appspot.com",
  messagingSenderId: "338240015593",
  appId: "1:338240015593:web:d1f89763719f9ecd8bb478"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);