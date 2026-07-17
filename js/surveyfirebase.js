.// ============================
// Firebase初期化（Survey専用）
// ============================

import { initializeApp } 
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import { getFirestore } 
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


// Firebase設定

const firebaseConfig = {

  apiKey: "AIzaSyBkz_v4PKn7dr_Kggfy9W_4b6ClUVzFaOE",

  authDomain: "highschoolplatform-5958f.firebaseapp.com",

  projectId: "highschoolplatform-5958f",

  storageBucket: "highschoolplatform-5958f.firebasestorage.app",

  messagingSenderId: "218288282991",

  appId: "1:218288282991:web:72ceaffbcec3ffd65c1c9a"

};


// Firebase開始

const app = initializeApp(firebaseConfig);


// Survey用Firestore

export const surveyDB = getFirestore(app);