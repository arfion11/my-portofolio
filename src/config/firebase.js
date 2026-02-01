import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAtojiVD_24NlOnkqiyfIdkm24W77o23Ys",
  authDomain: "qa-portfolio-3af21.firebaseapp.com",
  projectId: "qa-portfolio-3af21",
  storageBucket: "qa-portfolio-3af21.firebasestorage.app",
  messagingSenderId: "266354651606",
  appId: "1:266354651606:web:803e2d5f1a35b7ad9cf477",
  measurementId: "G-6SP9XTDCJ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);