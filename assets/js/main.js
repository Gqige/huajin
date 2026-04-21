/**
 * 华进科技官网 - Revolut风格 v4.0
 * 核心功能：GSAP动画、滚动触发、数字计数、导航交互
 */

document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initScrollProgress();
    initGSAPAnimations();
    initNumberCounters();
    initMobileMenu();
});

// ===================================
// 导航栏滚动效果
// ===================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

// ===================================
// 滚动进度条
// ===================================
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    let ticking = false;

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateProgress);
            ticking = true;
        }
    }, { passive: true });

    updateProgress();
}

// ===================================
// GSAP 动画
// ===================================
function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.log('GSAP not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Hero文字动画
    initHeroTextAnimation();

    // 业务卡片入场
    initBusinessCardsAnimation();

    // 产品展示动画
    initProductShowcaseAnimation();

    // 统计数据入场
    initStatsAnimation();
}

// Hero文字逐词飞入
function initHeroTextAnimation() {
    const words = document.querySelectorAll('.hero-word');
    if (words.length === 0) return;

    gsap.to(words, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3
    });

    // Hero数据动画
    const stats = document.querySelectorAll('.hero-stat');
    gsap.from(stats, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.8
    });

    // CTA按钮动画
    const cta = document.querySelector('.hero-cta-revolut');
    if (cta) {
        gsap.from(cta, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power3.out',
            delay: 1.2
        });
    }
}

// 业务卡片滚动入场
function initBusinessCardsAnimation() {
    const cards = document.querySelectorAll('.business-card-revolut');
    if (cards.length === 0) return;

    cards.forEach((card, index) => {
        const delay = parseFloat(card.dataset.delay) || 0;

        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            delay: delay
        });
    });
}

// 产品展示动画
function initProductShowcaseAnimation() {
    const content = document.querySelector('.product-showcase-content');
    const visual = document.querySelector('.product-showcase-visual');

    if (content) {
        gsap.to(content, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: content,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    }

    if (visual) {
        gsap.to(visual, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: visual,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            delay: 0.2
        });
    }
}

// 统计数据入场
function initStatsAnimation() {
    const statCards = document.querySelectorAll('.stat-card-revolut');
    if (statCards.length === 0) return;

    statCards.forEach((card, index) => {
        const delay = parseFloat(card.dataset.delay) || 0;

        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            delay: delay
        });
    });
}

// ===================================
// 数字计数器动画
// ===================================
function initNumberCounters() {
    const counters = document.querySelectorAll('[data-target]');
    if (counters.length === 0) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 使用easeOutQuart缓动
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (target - start) * easeProgress);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

// ===================================
// 移动端菜单
// ===================================
function initMobileMenu() {
    const toggle = document.getElementById('navbarToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!toggle || !mobileMenu) return;

    toggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        toggle.textContent = mobileMenu.classList.contains('open') ? '✕' : '☰';
    });

    // 点击链接后关闭菜单
    const links = mobileMenu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mobileMenu.classList.remove('open');
                toggle.textContent = '☰';
            }
        });
    });
}

// ===================================
// 平滑滚动
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// 控制台输出
// ===================================
console.log('%c华进科技', 'color: #FFD700; font-size: 20px; font-weight: bold;');
console.log('%c官网 v4.0 Revolut风格', 'color: #00D4FF; font-size: 12px;');
