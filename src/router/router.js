// src/router/router.js

export const Router = {
    routes: ['home', 'mymatches', 'refer', 'profile', 'wallet', 'transactions', 'match-list', 'match-details', 'login', 'admin'],
    
    init: function() {
        // হ্যাশ চেঞ্জ এবং পেজ লোড ইভেন্ট লিসেনার
        window.addEventListener('hashchange', () => this.handleRouting());
        window.addEventListener('load', () => this.handleRouting());
    },

    handleRouting: function() {
        const hash = window.location.hash.replace('#', '') || 'home';
        
        if (this.routes.includes(hash)) {
            this.navigate(hash);
        } else {
            this.navigate('home'); // ডিফল্ট রুট
        }
    },

    navigate: function(page) {
        const loader = document.getElementById('router-loader');
        const outlet = document.getElementById('app-outlet');
        
        if (loader) {
            loader.style.display = 'flex';
            loader.style.opacity = '1';
        }

        // ক্যাশ এড়ানোর জন্য টাইমস্ট্যাম্প ট্রিকসহ পেজ ফেচ করা
        fetch(`./pages/${page}.html?v=${Date.now()}`)
            .then(response => {
                if (!response.ok) throw new Error("Page not found");
                return response.text();
            })
            .then(html => {
                if (outlet) {
                    outlet.innerHTML = html;
                    // পেজ লোড হওয়ার পর তার ভেতরের স্ক্রিপ্ট নিরাপদে রান করানো
                    this.executePageScripts(outlet);
                }
                
                // নেভিগেশন বাটনের একটিভ ক্লাস আপডেট করা
                this.updateNavHighlights(page);
            })
            .catch(err => {
                console.error("Routing error:", err);
                if (outlet) outlet.innerHTML = `<div class="p-6 text-center text-red-500">Failed to load page.</div>`;
            })
            .finally(() => {
                // লোডার হাইড করা
                setTimeout(() => {
                    if (loader) {
                        loader.style.opacity = '0';
                        setTimeout(() => loader.style.display = 'none', 300);
                    }
                }, 500);
            });
    },

    executePageScripts: function(container) {
        if (!container) return;

        // আগের পেজের ডাইনামিক স্ক্রিপ্ট থাকলে তা রিমুভ (Clean up) করো (No Memory Leak)
        const oldDynamicScript = document.getElementById('dynamic-page-script');
        if (oldDynamicScript) oldDynamicScript.remove();

        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            
            // সব অ্যাট্রিবিউট কপি করা
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            
            newScript.textContent = oldScript.textContent;
            newScript.id = 'dynamic-page-script'; // ইউনিক আইডি সেট করা

            document.head.appendChild(newScript);
            oldScript.remove(); // ডম ক্লিন রাখা
        });
    },

    updateNavHighlights: function(page) {
        document.querySelectorAll('.nav-btn, .center-nav-wrapper').forEach(btn => {
            btn.classList.remove('active');
        });
        
        let activeBtn = document.querySelector(`.nav-btn[data-route="${page}"]`);
        if (!activeBtn && page === 'refer') {
            activeBtn = document.querySelector('.center-nav-wrapper');
        }
        if (activeBtn) activeBtn.classList.add('active');
    }
};

// গ্লোবাল রাউটার অবজেক্ট এক্সপোজ করা
window.router = Router;
