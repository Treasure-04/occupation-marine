import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNe_XGaTMLTfBHc75H-5ykdfSKn5ylZ54",
  authDomain: "occupation-marine.firebaseapp.com",
  projectId: "occupation-marine",
  storageBucket: "occupation-marine.firebasestorage.app",
  messagingSenderId: "417080706411",
  appId: "1:417080706411:web:54ab26637168446534382e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);