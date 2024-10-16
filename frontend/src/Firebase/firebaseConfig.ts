import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC7b9MKreH-iMXsmdG784-wH3kCEYORG5s",
    authDomain: "fir-31914.firebaseapp.com",
    projectId: "fir-31914",
    storageBucket: "fir-31914.appspot.com",
    messagingSenderId: "943833159563",
    appId: "1:943833159563:web:0f6f2be111060b5122818e"
  };

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
