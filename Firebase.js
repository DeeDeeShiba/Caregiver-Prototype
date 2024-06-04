// firebase.js
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAhf0lUUbHUtMc3jvxb6ko0GtxcOR4e91M",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "caa-pcc-data-ingestion",
  storageBucket: "caa-pcc-data-ingestion.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:1047801092723:android:e3f842940029d4f3e46806"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
