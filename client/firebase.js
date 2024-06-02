
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyCfLArdpDrc0wWYDfokCwhi1EMl2rRX6to",
  authDomain: "i-m-rishabh.firebaseapp.com",
  projectId: "i-m-rishabh",
  storageBucket: "i-m-rishabh.appspot.com",
  messagingSenderId: "328768501566",
  appId: "1:328768501566:web:b31c81d2ad558b53759e6f",
  measurementId: "G-6JVLY1JWGZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export { app, analytics };