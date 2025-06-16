// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBb2mrSM0XXrF_OBwq7sOmc96fhN34J4Sw",
  authDomain: "knust-bus-management-app.firebaseapp.com",
  projectId: "knust-bus-management-app",
  storageBucket: "knust-bus-management-app.firebasestorage.app",
  messagingSenderId: "116877819302",
  appId: "1:116877819302:web:fb0b29028444c329346367"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore
export const db = getFirestore(app);
export const auth = getAuth(app);
