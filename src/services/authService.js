// src/services/authService.js
import { auth } from "../config/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

export const AuthService = {
    // ইউজারের লগইন স্টেট মনিটর করা (Professional Wrapper)
    onPlayerStateChange: (callback) => {
        if (!auth) {
            console.error("Firebase Auth initialized হয়নি!");
            return;
        }
        return onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Player Logged In:", user.uid);
                callback(user);
            } else {
                console.log("No player active. Redirecting...");
                callback(null);
            }
        });
    },

    // লগআউট ফাংশন
    logoutPlayer: async () => {
        try {
            await signOut(auth);
            window.location.hash = "login";
        } catch (error) {
            console.error("Logout করতে সমস্যা হয়েছে:", error);
            alert("Logout failed. Please try again.");
        }
    },

    // বর্তমানে লগইন থাকা ইউজারের ডাটা সরাসরি নেওয়া
    getCurrentPlayer: () => {
        return auth.currentUser;
    }
};

// ব্যাকওয়ার্ড কম্প্যাটিবিলিটি (উইন্ডো অবজেক্টে এক্সপোজ করা)
window.AuthService = AuthService;
