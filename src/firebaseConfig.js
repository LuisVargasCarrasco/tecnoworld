import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCS00q9D9gKeRUFPQwF38gWVZPKiRtu9Uk",
    authDomain: "e-comerce-40b17.firebaseapp.com",
    projectId: "e-comerce-40b17",
    storageBucket: "e-comerce-40b17.firebasestorage.app",
    messagingSenderId: "624496744884",
    appId: "1:624496744884:web:bdfa8528f66e80c2127ae1"
};

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);

// Exporta la instancia de Firestore
export const db = getFirestore(app);
