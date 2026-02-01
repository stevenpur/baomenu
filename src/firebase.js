// Firebase configuration and initialization
const firebaseConfig = {
    apiKey: "AIzaSyA9woljBSE1pnDvMbAa4q82diz-PC4IJaw",
    authDomain: "dino-restaurant.firebaseapp.com",
    projectId: "dino-restaurant",
    storageBucket: "dino-restaurant.firebasestorage.app",
    messagingSenderId: "788822847636",
    appId: "1:788822847636:web:b726d48609be859a6ac481",
    measurementId: "G-46CMBND5CR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
