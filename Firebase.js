// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAhf0lUUbHUtMc3jvxb6ko0GtxcOR4e91M",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "caa-pcc-data-ingestion",
  storageBucket: "caa-pcc-data-ingestion.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:1047801092723:android:e3f842940029d4f3e46806"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
export const db = getDatabase(app);
