import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCm0M6lM6pUGVXMN-8JPwro9g_KkF7ToeI",
    authDomain: "cgpa-calculator-te.firebaseapp.com",
    projectId: "cgpa-calculator-te",
    storageBucket: "cgpa-calculator-te.firebasestorage.app",
    messagingSenderId: "766965442560",
    appId: "1:766965442560:web:54c7e7a68982d43274d0e5"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
