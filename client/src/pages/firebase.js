import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBm8WFXRv8HeB_Tn6-3kaf2hEVH_5Zr924",
  authDomain: "master-ai-ea401.firebaseapp.com",
  projectId: "master-ai-ea401",
  storageBucket: "master-ai-ea401.firebasestorage.app",
  messagingSenderId: "767196110561",
  appId: "1:767196110561:web:87d62a3dda4b48d155e1a0",
  measurementId: "G-G0LL433B9G"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
