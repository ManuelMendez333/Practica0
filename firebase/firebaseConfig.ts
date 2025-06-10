import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3wDiOde6CAtDuhF_qsR24y6PoPyPayDw",
  authDomain: "bddconcesionaria.firebaseapp.com",
  projectId: "bddconcesionaria",
  storageBucket: "bddconcesionaria.firebasestorage.app",
  messagingSenderId: "133601895068",
  appId: "1:133601895068:web:485e7b0fe052de0d33c359"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
