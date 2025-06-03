import { initializeApp } from 'firebase/app';
import {
      initializeAuth,
      getReactNativePersistence,
    } from 'firebase/auth';
    import AsyncStorage from '@react-native-async-storage/async-storage';
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBZ0KE8NLxxxxxxx',
    authDomain: 'project-choir.firebaseapp.com',
    projectId: 'project-choir',
    storageBucket: 'project-choir.firebasestorage.app',
    messagingSenderId: '2xxxxxx',
    appId: '1:234568:web:123456'
};


export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
