/**
 * Andi Alifsyah Dyasham - Portfolio Script
 * Modularized and optimized for performance.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initTabs();
    initSmoothScroll();
    initCounters();
    initAOS();
    initLocalization();
    initWebhook();
});

// ─── Theme Management ───
function initTheme() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    
    html.classList.toggle('dark', (localStorage.getItem('theme') || 'light') === 'dark');
    
    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    });
}

// ─── Mobile Menu ───
function initMobileMenu() {
    const mbtn = document.getElementById('mobile-menu-button');
    const mmenu = document.getElementById('mobile-menu');
    
    const updateIcon = (isHidden) => {
        mbtn.innerHTML = isHidden ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
    };

    mbtn.addEventListener('click', () => {
        mmenu.classList.toggle('hidden');
        updateIcon(mmenu.classList.contains('hidden'));
    });
    
    document.addEventListener('click', e => {
        if (!mbtn.contains(e.target) && !mmenu.contains(e.target)) {
            mmenu.classList.add('hidden');
            updateIcon(true);
        }
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            mmenu.classList.add('hidden');
            updateIcon(true);
        }
    });
}

// ─── Portfolio Tabs ───
function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(targetTab + '-portfolio').classList.add('active');
        });
    });
}

// ─── Smooth Scroll ───
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu if open
                const mmenu = document.getElementById('mobile-menu');
                const mbtn = document.getElementById('mobile-menu-button');
                mmenu.classList.add('hidden');
                mbtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
}

// ─── Animated Counters ───
function initCounters() {
    const runCounter = (el) => {
        const target = parseFloat(el.dataset.count);
        const dec = el.classList.contains('stat-dec');
        const duration = 1800;
        const steps = duration / 16;
        let cur = 0;
        const inc = target / steps;
        
        const t = setInterval(() => {
            cur = Math.min(cur + inc, target);
            el.textContent = dec ? cur.toFixed(2) : Math.floor(cur);
            if (cur >= target) clearInterval(t);
        }, 16);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                runCounter(e.target);
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-num').forEach(el => observer.observe(el));
}

// ─── AOS (Animate On Scroll) ───
function initAOS() {
    AOS.init({
        duration: 700,
        once: true,
        offset: 80,
        disable: () => window.innerWidth < 768
    });
}

// ─── Localization (i18n) ───
async function initLocalization() {
    let curLang = localStorage.getItem('lang') || 'EN';
    const langToggle = document.getElementById('lang-toggle');
    const translations = {};

    const loadTranslations = async (lang) => {
        if (!translations[lang]) {
            try {
                const response = await fetch(`./locales/${lang.toLowerCase()}.json`);
                translations[lang] = await response.json();
            } catch (err) {
                console.error(`Failed to load ${lang} translations:`, err);
                return;
            }
        }
        applyTranslations(translations[lang]);
    };

    const applyTranslations = (data) => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (data[key]) {
                el.textContent = data[key];
            }
        });
        langToggle.textContent = curLang === 'EN' ? 'ID' : 'EN';
        document.documentElement.lang = curLang.toLowerCase();
    };

    langToggle.addEventListener('click', () => {
        curLang = curLang === 'EN' ? 'ID' : 'EN';
        localStorage.setItem('lang', curLang);
        loadTranslations(curLang);
    });

    await loadTranslations(curLang);
}

// ─── Analytics Webhook ───
function initWebhook() {
    window.addEventListener('load', () => {
        fetch('https://n8n-alip.duckdns.org/webhook/quiz-login', {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ origin: window.location.href }),
        }).catch(() => {});
    });
}
