import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyC_3Ue0Wd4oW8BjkPnB7BtTfM_9fKmpESw",
  authDomain: "urlshortner-40bac.firebaseapp.com",
  projectId: "urlshortner-40bac",
  storageBucket: "urlshortner-40bac.appspot.com",
  messagingSenderId: "433122466895",
  appId: "1:433122466895:web:4f79a3f183e76acc3c9e3a",
  measurementId: "G-2LBRTQQDY3",
};

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
