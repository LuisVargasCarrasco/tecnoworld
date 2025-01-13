import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCS00q9D9gKeRUFPQwF38gWVZPKiRtu9Uk",
    authDomain: "e-comerce-40b17.firebaseapp.com",
    projectId: "e-comerce-40b17",
    storageBucket: "e-comerce-40b17.firebasestorage.app",
    messagingSenderId: "624496744884",
    appId: "1:624496744884:web:bdfa8528f66e80c2127ae1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
