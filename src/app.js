// src/app.js
import { Router } from "./router/router.js";
import { AuthService } from "./services/authService.js";
import { DbService } from "./services/dbService.js";

// অ্যাপ বুটস্ট্র্যাপ (Initialization)
function initApp() {
    console.log("PROPLAYERADDA Core Initialization Started...");
    
    // ১. রাউটার চালু করা
    Router.init();

    // ২. রিয়েল-টাইম প্লেয়ার স্টেট এবং ওয়ালেট ট্র্যাকিং
    let unsubscribeWallet = null;

    AuthService.onPlayerStateChange((user) => {
        if (user) {
            // ইউজার লগইন থাকলে এবং ভুলবশত লগইন পেজে থাকলে হোমে পাঠিয়ে দাও
            if (window.location.hash === "#login") {
                window.location.hash = "home";
            }

            // প্লেয়ারের ওয়ালেট ব্যালেন্স লাইভ ট্র্যাক করা (onSnapshot)
            if (!unsubscribeWallet) {
                unsubscribeWallet = DbService.trackPlayerWallet(user.uid, (totalBalance, fullData) => {
                    const walletAmountDOM = document.getElementById('nav-wallet-amount');
                    if (walletAmountDOM) {
                        walletAmountDOM.textContent = `₹${totalBalance}`;
                    }
                    // গ্লোবাল স্টেট হিসেবে ডাটা রাখা (যাতে অন্য পেজ রিড করতে পারে)
                    window.currentPlayerData = fullData;
                }, (err) => {
                    console.error("Wallet Sync Failed:", err);
                });
            }
        } else {
            // ইউজার লগইন না থাকলে এবং অলরেডি লগইন পেজে না থাকলে লগইন পেজে রিডাইরেক্ট করো
            if (window.location.hash !== "#login") {
                // যদি ওয়ালেট ট্র্যাকিং চালু থাকে তবে তা বন্ধ (Clean up) করো
                if (unsubscribeWallet) {
                    unsubscribeWallet();
                    unsubscribeWallet = null;
                }
                window.location.hash = "login";
            }
        }
    });
}

// ডম রেডি হলে অ্যাপ রান করো
document.addEventListener("DOMContentLoaded", initApp);
