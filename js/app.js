/**
 * Andi Alifsyah Dyasham - Portfolio Script
 * Modularized and optimized for performance.
 */

// ─── Inline Translations (avoids fetch/CORS issues on file:// and HTTP) ───
const TRANSLATIONS = {
    EN: {
        nav_home: "Home",
        nav_about: "About",
        nav_exp: "Experience",
        nav_edu: "Education",
        nav_skills: "Skills",
        nav_portfolio: "Portfolio",
        nav_research: "Research",
        nav_awards: "Awards",
        hero_eyebrow: "Software Engineer \u00b7 AI Researcher \u00b7 Sovereign AI",
        hero_title_prefix: "Hi, I'm ",
        hero_sub: "Engineer with 3+ years in high-scale banking systems. Best Graduate of Universitas Brawijaya (GPA\u00a03.95). Slashed development cycles by 70% through AI automation.",
        hero_cta_contact: "Get In Touch",
        hero_cta_cv: "Download CV",
        about_eyebrow: "About Me",
        about_title: "Background & Expertise",
        about_p1: "An engineer primarily focused on backend development and artificial intelligence with 3+ years of experience in high-scale banking systems, managing core migrations of 114+ transaction types, and pioneering Sovereign AI solutions.",
        about_p2: "Contributed to scientific publications in NLP at international conferences. In 2023, achieved the distinction of Best Graduate from the Faculty of Computer Science at Universitas Brawijaya (GPA 3.95), and has received over 15 national and international awards.",
        about_quote: "\"Slashed development cycles by 70% through AI automation and engineered core migrations of 114+ transaction types in high-scale banking infrastructure.\"",
        stat_years: "Years Experience",
        stat_awards: "Awards Won",
        stat_gpa: "GPA \u00b7 Summa Cum Laude",
        stat_projects: "Projects Completed",
        exp_eyebrow: "Experience",
        exp_title: "Professional Journey",
        edu_eyebrow: "Education",
        edu_title: "Academic Background",
        skills_eyebrow: "Skills",
        skills_title: "Technologies & Expertise",
        skills_cat1: "Languages & Tools",
        skills_cat2: "Expertise Areas",
        portfolio_eyebrow: "Portfolio",
        portfolio_title: "Projects & Case Studies",
        tab_casestudy: "Case Studies",
        tab_ai: "AI & Data Science",
        tab_web: "Full-Stack & AI Apps",
        cs_title: "From 23% SLA to an AI-Powered Intelligent Operational Monitoring System",
        cs_desc: "Helping the operations team gain full visibility over hundreds of transactions per day \u2014 and prevent SLA breaches before they happen.",
        cs_lbl_before: "SLA before",
        cs_lbl_after: "SLA after",
        cs_lbl_tx: "Transactions monitored",
        cs_lbl_team: "Team members",
        cs_tag_duration: "~3 Months",
        cs_btn: "Read Full Case Study",
        research_eyebrow: "Research",
        research_title: "Publications & Scientific Work",
        research_item1_title: "Prefix-Tuned Encoder-Decoder Pretrained Model",
        research_item1_desc: "Mitigating Low-Resource Domain Cases in Chatbot Development. Master's Thesis focused on Intelligent Systems and NLP.",
        research_item2_title: "Retrieval-Based Chatbot for Helpdesk Automation",
        research_item2_desc: "Design and development of an automated support system for the Faculty of Computer Science, Brawijaya University.",
        research_item3_title: "International NLP Research",
        research_item3_desc: "Contributions to scientific publications in NLP at various international conferences.",
        awards_eyebrow: "Awards & Recognition",
        awards_title: "Excellence & Achievements",
        contact_eyebrow: "Contact",
        contact_title: "Get In Touch",
        contact_desc: "Let's connect and discuss opportunities",
        footer_copy: "\u00a9 2026 Andi Alifsyah. All rights reserved.",
        cs2_title: "A Prefix-Tuned Encoder-Decoder Pretrained Model for Mitigating Low-Resource Domains",
        cs2_desc: "Overcoming data scarcity and informal linguistic variations using Parameter-Efficient Fine-Tuning (PEFT) on Large Language Models.",
        cs2_lbl_before: "BLEU before",
        cs2_lbl_after: "BLEU after",
        cs2_lbl_param: "Params updated",
        cs3_title: "Building a High-Scale SNAP-BI Open API Gateway",
        cs3_desc: "Migrating 114+ legacy monolithic endpoints to a distributed, highly-available Go microservices architecture compliant with Indonesia's National Open API Standards.",
        cs3_lbl_microservices: "Microservices",
        cs3_lbl_compliance: "SNAP-BI Compliant"
    },
    ID: {
        nav_home: "Beranda",
        nav_about: "Tentang",
        nav_exp: "Pengalaman",
        nav_edu: "Pendidikan",
        nav_skills: "Keahlian",
        nav_portfolio: "Portofolio",
        nav_research: "Riset",
        nav_awards: "Penghargaan",
        hero_eyebrow: "Software Engineer \u00b7 Peneliti AI \u00b7 Sovereign AI",
        hero_title_prefix: "Hai, saya ",
        hero_sub: "Engineer dengan 3+ tahun pengalaman di sistem perbankan skala tinggi. Lulusan Terbaik Universitas Brawijaya (IPK 3,95). Memangkas siklus pengembangan hingga 70% melalui otomasi AI.",
        hero_cta_contact: "Hubungi Saya",
        hero_cta_cv: "Unduh CV",
        about_eyebrow: "Tentang Saya",
        about_title: "Latar Belakang & Keahlian",
        about_p1: "Engineer yang berfokus pada pengembangan backend dan kecerdasan buatan dengan 3+ tahun pengalaman di sistem perbankan skala tinggi, mengelola migrasi core 114+ jenis transaksi, dan menjadi pionir solusi Sovereign AI.",
        about_p2: "Berkontribusi pada publikasi ilmiah NLP di konferensi internasional. Pada 2023, meraih predikat Lulusan Terbaik dari Fakultas Ilmu Komputer Universitas Brawijaya (IPK 3,95), serta telah menerima lebih dari 15 penghargaan nasional dan internasional.",
        about_quote: "\"Memangkas siklus pengembangan hingga 70% melalui otomasi AI dan mengelola migrasi core 114+ jenis transaksi dalam infrastruktur perbankan skala tinggi.\"",
        stat_years: "Tahun Pengalaman",
        stat_awards: "Penghargaan",
        stat_gpa: "IPK \u00b7 Summa Cum Laude",
        stat_projects: "Proyek Selesai",
        exp_eyebrow: "Pengalaman",
        exp_title: "Perjalanan Karier",
        edu_eyebrow: "Pendidikan",
        edu_title: "Latar Belakang Akademik",
        skills_eyebrow: "Keahlian",
        skills_title: "Teknologi & Kompetensi",
        skills_cat1: "Bahasa & Alat",
        skills_cat2: "Bidang Keahlian",
        portfolio_eyebrow: "Portofolio",
        portfolio_title: "Proyek & Studi Kasus",
        tab_casestudy: "Studi Kasus",
        tab_ai: "AI & Data Science",
        tab_web: "Aplikasi Full-Stack & AI",
        cs_title: "Dari SLA 23% ke Sistem Monitoring Operasional Cerdas Berbasis AI",
        cs_desc: "Membantu tim operasional mendapatkan visibilitas penuh atas ratusan transaksi per hari \u2014 dan mencegah SLA breach sebelum terjadi.",
        cs_lbl_before: "SLA sebelum",
        cs_lbl_after: "SLA sesudah",
        cs_lbl_tx: "Transaksi dipantau",
        cs_lbl_team: "Anggota tim",
        cs_tag_duration: "~3 Bulan",
        cs_btn: "Baca Case Study Lengkap",
        research_eyebrow: "Riset",
        research_title: "Publikasi & Karya Ilmiah",
        research_item1_title: "Prefix-Tuned Encoder-Decoder Pretrained Model",
        research_item1_desc: "Mitigasi Kasus Domain Rendah-Sumberdaya dalam Pengembangan Chatbot. Tesis Magister berfokus pada Intelligent Systems dan NLP.",
        research_item2_title: "Retrieval-Based Chatbot untuk Otomasi Helpdesk",
        research_item2_desc: "Desain dan pengembangan sistem dukungan otomatis untuk Fakultas Ilmu Komputer, Universitas Brawijaya.",
        research_item3_title: "Riset NLP Internasional",
        research_item3_desc: "Kontribusi pada publikasi ilmiah NLP di berbagai konferensi internasional.",
        awards_eyebrow: "Penghargaan & Pengakuan",
        awards_title: "Prestasi & Pencapaian",
        contact_eyebrow: "Kontak",
        contact_title: "Hubungi Saya",
        contact_desc: "Mari terhubung dan diskusikan peluang bersama",
        footer_copy: "\u00a9 2026 Andi Alifsyah. Hak cipta dilindungi.",
        cs2_title: "Prefix-Tuned Encoder-Decoder Pretrained Model untuk Mitigasi Domain Rendah Sumber Daya",
        cs2_desc: "Mengatasi keterbatasan data dan variasi bahasa informal menggunakan Parameter-Efficient Fine-Tuning (PEFT) pada Large Language Models.",
        cs2_lbl_before: "BLEU sebelum",
        cs2_lbl_after: "BLEU sesudah",
        cs2_lbl_param: "Parameter di-update",
        cs3_title: "Membangun SNAP-BI Open API Gateway Skala Tinggi",
        cs3_desc: "Migrasi 114+ endpoint monolitik lawas ke arsitektur microservices Go yang terdistribusi, ketersediaan tinggi, dan mematuhi Standar Nasional Open API Pembayaran (SNAP-BI) Indonesia.",
        cs3_lbl_microservices: "Microservices",
        cs3_lbl_compliance: "Kepatuhan SNAP-BI"
    }
};

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
function initLocalization() {
    let curLang = localStorage.getItem('lang') || 'EN';
    const langToggle = document.getElementById('lang-toggle');

    // Set button label immediately so there's no flash of wrong state
    langToggle.textContent = curLang === 'EN' ? 'ID' : 'EN';

    const loadTranslations = (lang) => {
        const data = TRANSLATIONS[lang];
        if (!data) {
            console.error(`No translations found for language: ${lang}`);
            return false;
        }
        applyTranslations(lang, data);
        return true;
    };

    // lang param is passed explicitly so the button label is always derived
    // from the language whose content was just applied, not from curLang
    const applyTranslations = (lang, data) => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (data[key] !== undefined) {
                el.textContent = data[key];
            }
        });
        langToggle.textContent = lang === 'EN' ? 'ID' : 'EN';
        document.documentElement.lang = lang.toLowerCase();
    };

    langToggle.addEventListener('click', () => {
        const nextLang = curLang === 'EN' ? 'ID' : 'EN';
        if (loadTranslations(nextLang)) {
            curLang = nextLang;
            localStorage.setItem('lang', curLang);
        }
    });

    loadTranslations(curLang);
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
