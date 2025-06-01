import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBZ0KE8NLwaykEKXUCjl4QU2KjRyQ6W9Ks',
    authDomain: 'project-choir.firebaseapp.com',
    projectId: 'project-choir',
    storageBucket: 'project-choir.firebasestorage.app',
    messagingSenderId: '282344050418',
    appId: '1:282344050418:web:5426836d0e68df868f8a6b'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth, app }; 