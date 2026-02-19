import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-O7Pbhh04_dPKWbmi6m11Z_xuXL4DNu4",
    authDomain: "resume-analyzer-and-builder.firebaseapp.com",
    projectId: "resume-analyzer-and-builder",
    storageBucket: "resume-analyzer-and-builder.firebasestorage.app",
    messagingSenderId: "415344104829",
    appId: "1:415344104829:web:93eca75c6350acfc662814",
    measurementId: "G-C4BZQVVR6W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider, signInWithPopup };