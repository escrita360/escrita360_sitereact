// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBclR2rnW6kxLvgbojbJkWG9uM5V49til8",
  authDomain: "siteescrita360.firebaseapp.com",
  projectId: "siteescrita360",
  storageBucket: "siteescrita360.firebasestorage.app",
  messagingSenderId: "1070194097995",
  appId: "1:1070194097995:web:b25754f0383d77872f32ce",
  measurementId: "G-93E7FRBQSW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);