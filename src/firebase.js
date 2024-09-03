// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyCNzJwEMVQRF3caZPyd2HFIjwUjr-zdbYI",
  authDomain: "product-inventory-b5b54.firebaseapp.com",
  projectId: "product-inventory-b5b54",
  storageBucket: "product-inventory-b5b54.appspot.com",
  messagingSenderId: "20464569604",
  appId: "1:20464569604:web:668ec831d5bbaafdb7d451"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyBAJ1Nz64MVMmWKwtFGoqOXCCxRpc-aC7c",
//   authDomain: "product-inventory-39cdc.firebaseapp.com",
//   projectId: "product-inventory-39cdc",
//   storageBucket: "product-inventory-39cdc.appspot.com",
//   messagingSenderId: "193908714038",
//   appId: "1:193908714038:web:e7a8e7d108bb27b04d0697"
// };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 

export default db;