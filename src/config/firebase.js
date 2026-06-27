// src/config/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB1vzDj_3-tymzU-EomjCIlbMhsoSnDiTU",
  authDomain: "ffth01.firebaseapp.com",
  projectId: "ffth01",
  storageBucket: "ffth01.firebasestorage.app",
  messagingSenderId: "879174774047",
  appId: "1:879174774047:web:386e99dd5c947381c4142a"
};

// অ্যাপ ইনিশিয়ালাইজেশন
const app = initializeApp(firebaseConfig);

// গ্লোবাল এক্সপোর্ট (যাতে অন্য সার্ভিস ফাইল ব্যবহার করতে পারে)
export const auth = getAuth(app);
export const db = getFirestore(app);

// ব্যাকওয়ার্ড কম্প্যাটিবিলিটি (আপাতত গ্লোবাল উইন্ডোতেও রাখছি যাতে পুরনো কোড না ভাঙে)
window.auth = auth;
window.db = db;
