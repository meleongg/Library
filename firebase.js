// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-firestore.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWi90NJMxPoMIPJPVmHbb2j-1KywAopAs",
  authDomain: "library-4e505.firebaseapp.com",
  projectId: "library-4e505",
  storageBucket: "library-4e505.appspot.com",
  messagingSenderId: "559730057949",
  appId: "1:559730057949:web:4e51a63362aa01d65b7134"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };