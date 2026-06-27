// src/services/dbService.js
import { db } from "../config/firebase.js";
import { doc, onSnapshot, collection, query, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export const DbService = {
    // ১. ইউজারের ওয়ালেট ব্যালেন্স রিয়েল-টাইমে ট্র্যাক করা (onSnapshot wrapper)
    trackPlayerWallet: (userId, onUpdate, onError) => {
        if (!userId) return;
        
        const userDocRef = doc(db, "users", userId);
        
        return onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const totalBalance = (data.deposit || 0) + (data.winnings || 0);
                onUpdate(totalBalance, data);
            } else {
                if (onError) onError("User data not found");
            }
        }, (error) => {
            console.error("Wallet tracking error:", error);
            if (onError) onError(error);
        });
    },

    // ২. নোটিফিকেশন লিস্ট ফেচ করা (Promise-based for Router Pages)
    getNotifications: async () => {
        try {
            const q = query(collection(db, "notifications"));
            const querySnapshot = await getDocs(q);
            const notifications = [];
            
            querySnapshot.forEach((doc) => {
                notifications.push({ id: doc.id, ...doc.data() });
            });
            
            return { success: true, data: notifications };
        } catch (error) {
            console.error("Error fetching notifications:", error);
            return { success: false, error: error.message };
        }
    }
};

// ব্যাকওয়ার্ড কম্প্যাটিবিলিটি
window.DbService = DbService;
