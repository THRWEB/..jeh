// src/utils/helpers.js

export const Helpers = {
    // ম্যাচ টাইম ফরম্যাট করার প্রফেশনাল ফাংশন
    formatMatchTime: (timestamp) => {
        if (!timestamp) return "TBA";
        
        // ফায়ারবেস টাইমস্ট্যাম্প (seconds) নাকি রেগুলার ডেট অবজেক্ট/স্ট্রিং তা চেক করা
        let date = (timestamp && timestamp.seconds) ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
        
        // যদি ইনভ্যালিড ডেট হয়
        if (isNaN(date.getTime())) return "TBA";

        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const dateStr = date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
        
        return `${timeStr} ${dateStr}`;
    },

    // সিকিউর ইনপুট ভ্যালিডেশন (XSS প্রোটেকশন)
    sanitizeInput: (text) => {
        if (!text) return "";
        return text.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
    }
};

// ব্যাকওয়ার্ড কম্প্যাটিবিলিটি
window.formatMatchTime = Helpers.formatMatchTime;
window.Helpers = Helpers;
