/* ======================================================== */
/* 💻 firebase-config.js (PERBAIKAN DATABASE URL)           */
/* ======================================================== */

const firebaseConfig = {
    apiKey: "AIzaSyCFSeZotsD4KqGOfYquDeymRzd9SfMSsw4",
    authDomain: "fooddeliv-78761.firebaseapp.com",
    projectId: "fooddeliv-78761",
    storageBucket: "fooddeliv-78761.firebasestorage.app",
    messagingSenderId: "129058802142",
    appId: "1:129058802142:web:7b6d09e7fd71ec09f7354f",
    measurementId: "G-84FYDL0VL1",
    // 👇 BARIS INI SANGAT PENTING AGAR TIDAK ERROR 👇
    databaseURL: "https://fooddeliv-78761-default-rtdb.firebaseio.com"
};

// Inisialisasi Firebase
if (!firebase.apps.length) { 
    firebase.initializeApp(firebaseConfig); 
}

const database = firebase.database();
const db = database; 
let menuCache = {}; 

let menuData = [];
let cart = [];
let currentCategory = 'all';
let currentUser = null;

window.onload = function() {
    const path = window.location.pathname;
    if (path.includes('admin.html')) {
        if(typeof initAdminMode === 'function') initAdminMode();
    } else {
        if(typeof initUserMode === 'function') initUserMode();
    }
};