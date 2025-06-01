import { initializeApp } from 'firebase/app';
import {
      initializeAuth,
      getReactNativePersistence,
    } from 'firebase/auth';
    import AsyncStorage from '@react-native-async-storage/async-storage';
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBZ0KE8NLwaykEKXUCjl4QU2KjRyQ6W9Ks',
    authDomain: 'project-choir.firebaseapp.com',
    projectId: 'project-choir',
    storageBucket: 'project-choir.firebasestorage.app',
    messagingSenderId: '282344050418',
    appId: '1:282344050418:web:5426836d0e68df868f8a6b'
};


export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
