import  firebase  from "firebase/compat/app";
import database from 'firebase/compat/database'

const firebaseConfig = {
  apiKey: "AIzaSyCsIf1vn-3qHQQlFBlGAZOvITI9AnFPVd4",
  authDomain: "datacrowd-15dbf.firebaseapp.com",
  databaseURL: "https://datacrowd-15dbf-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "datacrowd-15dbf",
  storageBucket: "datacrowd-15dbf.appspot.com",
  messagingSenderId: "607668547224",
  appId: "1:607668547224:web:2ebb4d213b8f561d976aed"
};


firebase.initializeApp(firebaseConfig);
export const realTimeDataBase = firebase.database();