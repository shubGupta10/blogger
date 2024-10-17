import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import {getFirestore} from 'firebase/firestore'
import {getDatabase} from 'firebase/database'

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)

export const realtimedb = getDatabase(app) 

export const storage = getStorage(app);