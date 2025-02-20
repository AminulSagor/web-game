import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// 🔥 Your web app's Firebase configuration (Replace with your own values)
const firebaseConfig = {
  apiKey: "AIzaSyCXJRpcTkhTBT61merLQ0QPrDGwNAWYF00",
  authDomain: "instagram-clone-f45ae.firebaseapp.com",
  projectId: "instagram-clone-f45ae",
  storageBucket: "instagram-clone-f45ae.appspot.com",
  messagingSenderId: "92536314385",
  appId: "1:92536314385:web:bca58f7e7a1d67556f740",
  measurementId: "G-XP7NL9M8SM"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, doc, setDoc, getDoc, updateDoc };
