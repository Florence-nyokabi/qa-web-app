import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBPp2fhRNiZ7_eiZKAKBn8OA18TCnI1zRY",
  authDomain: "qa-web-app-e212b.firebaseapp.com",
  projectId: "qa-web-app-e212b",
  storageBucket: "qa-web-app-e212b.appspot.com",
  messagingSenderId: "957948758162",
  appId: "1:957948758162:web:32f1f2ea1ccc6344f97e4b",
  measurementId: "G-MRJPGNHLH4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };