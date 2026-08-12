import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDt4KL96oJU2mzcbjX0maZIoBA241ovWnA",
  authDomain: "atelie-maria-dias.firebaseapp.com",
  projectId: "atelie-maria-dias",
  storageBucket: "atelie-maria-dias.appspot.com",
  messagingSenderId: "372109462086",
  appId: "1:372109462086:web:56dd9006e9badcfcf55847",
  measurementId: "G-J2112WWCD9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);