import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBfZLtq7NFQyVTSJTFpksGxWV_sd3izhGg",
    authDomain: "globaltrotter-3d4bd.firebaseapp.com",
    projectId: "globaltrotter-3d4bd",
    storageBucket: "globaltrotter-3d4bd.firebasestorage.app",
    messagingSenderId: "598454203707",
    appId: "1:598454203707:web:db051c8487003a005f331e",
    measurementId: "G-GT9MWEVGTJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
