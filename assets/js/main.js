/**
 * 华进（河南）教育科技有限公司
 * 官方网站交互脚本 v2.0
 * 功能：粒子特效、打字机动效、数字计数器、页面过渡动画
 */

// ===================================
// 全局变量
// ===================================
const navbarToggle = document.getElementById('navbarToggle');
const navbarNav = document.getElementById('navbarNav');
const navbar = document.getElementById('navbar');

// ===================================
// DOM加载完成后执行
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    initCriticalCSS();
    initNavbar();
    initSmoothScroll();
    initFormValidation();
    initActiveNav();
    initAnimations();
    initBackToTop();
    initNumberCounters();
    initParticles();
    initTypewriter();
    initBannerSlideshow();
    initMagneticButtons();
    initScrollProgressBar();
    initCustomCursor();
    initTiltCards();
    initLazyLoading();
});

// ===================================
// 粒子背景特效
// ===================================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(37, 99, 235, ${this.opacity})`;
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(37, 99, 235, ${0.15 * (1 - distance / 120)})`;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        connectParticles();
        animationId = requestAnimationFrame(animate);
    }

    createParticles();
    animate();

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
}

// ===================================
// 打字机动效
// ===================================
function initTypewriter() {
    const container = document.getElementById('typewriter-text');
    if (!container) return;

    const text = '华进教育科技——AI与短视频融合赋能';
    let index = 0;
    let isDeleting = false;
    let typingSpeed = 80;
    let isFinished = false;

    function type() {
        if (isFinished) return;

        if (isDeleting) {
            container.textContent = text.substring(0, index - 1);
            index--;
            typingSpeed = 30;
        } else {
            container.textContent = text.substring(0, index + 1);
            index++;
            typingSpeed = 80 + Math.random() * 40;
        }

        if (!isDeleting && index === text.length) {
            isFinished = true;
            // 打字完成后高亮"华进教育科技"
            setTimeout(() => {
                container.innerHTML = '<span class="highlight">华进教育科技</span>——AI与短视频融合赋能';
            }, 300);
            return;
        }

        if (isDeleting && index === 0) {
            isDeleting = false;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 800);
}

// ===================================
// Banner 背景轮播
// ===================================
function initBannerSlideshow() {
    const slides = document.querySelectorAll('.banner-bg-slide');
    if (slides.length < 2) return;

    let currentIndex = 0;
    const interval = 5000; // 5秒切换一次

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    // 启动轮播
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }, interval);

    // 初始显示第一张
    showSlide(0);
}

// ===================================
// 导航栏功能
// ===================================
function initNavbar() {
    if (!navbarToggle || !navbarNav) return;

    navbarToggle.addEventListener('click', function() {
        navbarNav.classList.toggle('active');
        const isOpen = navbarNav.classList.contains('active');
        navbarToggle.textContent = isOpen ? '✕' : '☰';
    });

    const navLinks = navbarNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navbarNav.classList.remove('active');
                navbarToggle.textContent = '☰';
            }
        });
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===================================
// 平滑滚动
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// 表单验证
// ===================================
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', handleSubmit);
}

function handleSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name) {
        alert('请输入您的姓名');
        return;
    }
    if (!phone) {
        alert('请输入联系方式');
        return;
    }
    if (!message) {
        alert('请输入需求描述');
        return;
    }

    const formData = {
        name: name,
        phone: phone,
        service: document.getElementById('service').value || '未选择',
        message: message,
        submitTime: new Date().toLocaleString('zh-CN')
    };

    const submitBtn = document.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';

    setTimeout(() => {
        console.log('表单数据：', formData);

        document.getElementById('contactForm').style.display = 'none';
        const success = document.getElementById('submitSuccess');
        if (success) success.style.display = 'block';

        submitBtn.disabled = false;
        submitBtn.textContent = '提交留言';

        setTimeout(() => {
            document.getElementById('contactForm').style.display = 'block';
            if (success) success.style.display = 'none';
            document.getElementById('contactForm').reset();
        }, 5000);
    }, 1000);
}

// ===================================
// 导航栏高亮当前页面
// ===================================
function initActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav a');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = link.getAttribute('href');

        if (currentPath.endsWith(linkPath) ||
            (currentPath === '/' && linkPath === 'index.html') ||
            (currentPath === '/index.html' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ===================================
// 滚动动画
// ===================================
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
        observer.observe(el);
    });
}

// ===================================
// 回到顶部按钮
// ===================================
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('aria-label', '回到顶部');
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===================================
// 数字计数器动画
// ===================================
function initNumberCounters() {
    // 同时选择 .counter-number 和 .banner-stat-number
    const counters = document.querySelectorAll('.counter-number, .banner-stat-number');

    if (counters.length === 0) return;

    // Banner 区域的统计卡片直接启动动画，不需要滚动触发
    const bannerCounters = document.querySelectorAll('.banner-stat-number');
    if (bannerCounters.length > 0) {
        setTimeout(() => {
            bannerCounters.forEach(counter => {
                const target = parseInt(counter.dataset.target);
                const duration = parseInt(counter.dataset.duration) || 2000;
                animateCounter(counter, target, duration);
            });
        }, 500); // 延迟 0.5 秒启动
    }

    // 其他计数器使用滚动触发
    const otherCounters = document.querySelectorAll('.counter-number');
    if (otherCounters.length === 0) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                const duration = parseInt(counter.dataset.duration) || 2000;
                animateCounter(counter, target, duration);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    otherCounters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ===================================
// 高级微交互：磁性按钮 + 滚动进度条 + 自定义光标 + 3D卡片倾斜
// ===================================
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn, .btn-primary, .btn-secondary, .btn-outline, .form-submit, .back-to-top');
    if (buttons.length === 0) return;
    
    // 触摸设备跳过
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
        
        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'transform 0.1s ease';
        });
    });
}

function initScrollProgressBar() {
    // 创建进度条元素
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);
    
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

function initCustomCursor() {
    // 触摸设备跳过
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    // 创建光标元素
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    document.body.appendChild(cursorDot);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;
    let rafId = null;
    let isActive = true;
    
    function animate() {
        if (!isActive) return;
        
        // 外圈缓动跟随
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // 内点快速跟随
        dotX += (mouseX - dotX) * 0.35;
        dotY += (mouseY - dotY) * 0.35;
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
        
        rafId = requestAnimationFrame(animate);
    }
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isActive) {
            isActive = true;
            animate();
        }
    }, { passive: true });
    
    // 悬停交互元素时放大
    const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea, .card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorDot.classList.add('dot-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorDot.classList.remove('dot-hover');
        });
    });
    
    // 页面不可见时暂停
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isActive = false;
            if (rafId) cancelAnimationFrame(rafId);
        }
    });
    
    animate();
}

// ===================================
// 3D 卡片倾斜效果（跟随鼠标）
// ===================================
function initTiltCards() {
    const cards = document.querySelectorAll('.about-card, .service-card, .product-card');
    if (cards.length === 0) return;

    // 触摸设备跳过
    if (window.matchMedia('(pointer: coarse)').matches) return;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });
}

// ===================================
// 性能优化：图片懒加载
// ===================================
function initLazyLoading() {
    // 检查浏览器是否支持原生懒加载
    if ('loading' in HTMLImageElement.prototype) {
        // 浏览器支持，给所有图片添加 loading="lazy"
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.loading = 'lazy';
        });
    } else {
        // 降级方案：使用 Intersection Observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===================================
// 性能优化：CSS关键路径优化（预加载关键资源）
// ===================================
function initCriticalCSS() {
    // 检测用户是否偏好减少动画
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.documentElement.classList.add('reduce-motion');
    }

    // 预加载关键资源提示
    const criticalResources = [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = resource.rel;
        link.href = resource.href;
        if (resource.crossOrigin) link.crossOrigin = resource.crossOrigin;
        document.head.appendChild(link);
    });
}

// ===================================
// 控制台输出
// ===================================
console.log('%c华进（河南）教育科技有限公司', 'color: #2563EB; font-size: 16px; font-weight: bold;');
console.log('%c官网 v2.0 已加载完成', 'color: #10B981; font-size: 12px;');

// ===================================
// Vibecoding 特效：鼠标跟随光晕 + 滚动进度条 + GSAP动画
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    initGlowCursor();
    initScrollProgress();
    initGSAPAnimations();
    initTiltCards();
    initVideoCards();
    initScrollSequence();
    initMicroAnimations();
});

function initGlowCursor() {
    const cursor = document.getElementById('glowCursor');
    if (!cursor) return;
    
    // 检测是否为触摸设备
    if (window.matchMedia('(pointer: coarse)').matches) {
        cursor.style.display = 'none';
        return;
    }
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let rafId = null;
    let isActive = false;
    let inactivityTimeout = null;
    
    function updateCursor() {
        if (!isActive) return;
        
        // 平滑跟随
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        
        document.documentElement.style.setProperty('--mouse-x', currentX + 'px');
        document.documentElement.style.setProperty('--mouse-y', currentY + 'px');
        
        rafId = requestAnimationFrame(updateCursor);
    }
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isActive) {
            isActive = true;
            rafId = requestAnimationFrame(updateCursor);
        }
        
        // 清除不活跃定时器
        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(() => {
            isActive = false;
            if (rafId) cancelAnimationFrame(rafId);
        }, 100);
    }, { passive: true });
    
    // 页面不可见时暂停
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isActive = false;
            if (rafId) cancelAnimationFrame(rafId);
        }
    });
}

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
    
    // 初始化
    updateProgress();
}

// ===================================
// GSAP 动画效果
// ===================================
function initGSAPAnimations() {
    // 检查 GSAP 是否加载
    if (typeof gsap === 'undefined') {
        console.log('GSAP not loaded, skipping animations');
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);
    
    // 1. Hero 文字分词飞入动画
    initHeroTextAnimation();
    
    // 2. Hero 视差滚动
    initHeroParallax();
    
    // 3. 磁性按钮效果
    initMagneticButtons();
    
    // 4. 卡片滚动入场
    initCardScrollAnimations();
    
    // 5. 统计数据弹性动画
    initStatsBounce();
}

function initHeroTextAnimation() {
    // 首页 Banner 标题动画
    const bannerWords = document.querySelectorAll('.banner .hero-word');
    if (bannerWords.length > 0) {
        gsap.set(bannerWords, {
            opacity: 0,
            y: 60,
            rotateX: -45,
            transformOrigin: 'center bottom'
        });
        
        gsap.to(bannerWords, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'back.out(1.2)',
            delay: 0.3
        });
    }
    
    // 子页面 Page Hero 标题动画
    const pageHeroWords = document.querySelectorAll('.page-hero .hero-word');
    if (pageHeroWords.length > 0) {
        gsap.set(pageHeroWords, {
            opacity: 0,
            y: 40,
            rotateX: -30,
            transformOrigin: 'center bottom'
        });
        
        gsap.to(pageHeroWords, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'back.out(1.2)',
            delay: 0.2
        });
    }
}

function initHeroParallax() {
    const bannerBg = document.querySelector('.banner-bg-slideshow');
    const bannerGrid = document.querySelector('.banner-bg-grid');
    const bannerGlow = document.querySelector('.banner-glow');
    const bannerContent = document.querySelector('.banner-content');
    const bannerStats = document.querySelector('.banner-stats');
    
    // 三层视差系统
    // 第1层：背景网格 - 最慢
    if (bannerGrid) {
        gsap.to(bannerGrid, {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
                trigger: '.banner',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.8
            }
        });
    }
    
    // 第2层：背景轮播 - 中等速度
    if (bannerBg) {
        gsap.to(bannerBg, {
            yPercent: 25,
            scale: 1.1,
            ease: 'none',
            scrollTrigger: {
                trigger: '.banner',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
    
    // 第3层：光晕层 - 较快，带旋转
    if (bannerGlow) {
        gsap.to(bannerGlow, {
            yPercent: 35,
            rotation: 5,
            scale: 1.2,
            ease: 'none',
            scrollTrigger: {
                trigger: '.banner',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
    
    // 内容层 - 最快，带淡出
    if (bannerContent) {
        gsap.to(bannerContent, {
            y: -120,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '.banner',
                start: 'top top',
                end: '40% top',
                scrub: true
            }
        });
    }
    
    // 统计卡片 - 独立视差
    if (bannerStats) {
        gsap.to(bannerStats, {
            y: -60,
            opacity: 0.5,
            ease: 'none',
            scrollTrigger: {
                trigger: '.banner',
                start: 'top top',
                end: '60% top',
                scrub: true
            }
        });
    }
    
    // 子页面 page-hero 视差效果
    initPageHeroParallax();
}

function initPageHeroParallax() {
    const pageHero = document.querySelector('.page-hero');
    const pageHeroContent = document.querySelector('.page-hero-content');
    
    if (!pageHero) return;
    
    // page-hero 内容视差
    if (pageHeroContent) {
        gsap.to(pageHeroContent, {
            y: -80,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '.page-hero',
                start: 'top top',
                end: '50% top',
                scrub: true
            }
        });
    }
}

function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn');
    if (buttons.length === 0) return;
    
    // 触摸设备跳过
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

function initCardScrollAnimations() {
    // 核心优势卡片 - 3D翻转入场
    gsap.utils.toArray('.features-grid .card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 80,
            rotateX: -30,
            rotateY: i % 2 === 0 ? -15 : 15,
            transformOrigin: 'center bottom',
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            delay: i * 0.15
        });
    });
    
    // 服务卡片 - 缩放弹性入场
    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 100,
            scale: 0.8,
            duration: 1,
            ease: 'back.out(1.2)',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            delay: i * 0.12
        });
    });
    
    // 产品卡片 - 滑入带旋转
    gsap.utils.toArray('.product-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            x: i % 2 === 0 ? -100 : 100,
            rotateZ: i % 2 === 0 ? -5 : 5,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });
    
    // 案例卡片 - 透视翻转
    gsap.utils.toArray('.case-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 80,
            rotateX: 20,
            transformOrigin: 'center top',
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            delay: i * 0.1
        });
    });
    
    // 视频卡片 - 序列入场
    gsap.utils.toArray('.video-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 60,
            scale: 0.95,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            delay: i * 0.08
        });
    });
}

function initStatsBounce() {
    const statItems = document.querySelectorAll('.stat-item');
    if (statItems.length === 0) return;
    
    gsap.from(statItems, {
        opacity: 0,
        y: 40,
        scale: 0.9,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.5)',
        scrollTrigger: {
            trigger: '.stats-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
}

// ===================================
// 滚动动画链 - 区块依次入场
// ===================================
function initScrollSequence() {
    // 获取所有主要区块
    const sections = [
        '.features-grid',
        '.stats-section',
        '.video-section',
        '.service-grid',
        '.product-grid',
        '.why-us-grid',
        '.case-grid',
        '.testimonials-grid',
        '.compliance-list'
    ];
    
    sections.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (!element) return;
        
        // 每个区块的标题先入场
        const title = element.closest('section')?.querySelector('.section-title');
        if (title) {
            gsap.from(title, {
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }
    });
    
    // CTA区块特殊处理 - 从两侧汇聚
    const ctaSection = document.querySelector('.banner-actions');
    if (ctaSection) {
        gsap.from(ctaSection, {
            opacity: 0,
            y: 60,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: ctaSection,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    }
}

// ===================================
// 3D 倾斜卡片效果
// ===================================
function initTiltCards() {
    const tiltCards = document.querySelectorAll('.tilt-card');
    if (tiltCards.length === 0) return;
    
    // 触摸设备跳过
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.setProperty('--rotateX', `${rotateX}deg`);
            card.style.setProperty('--rotateY', `${rotateY}deg`);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--rotateX', '0deg');
            card.style.setProperty('--rotateY', '0deg');
        });
    });
}

// ===================================
// 视频卡片悬停播放
// ===================================
function initVideoCards() {
    const videoCards = document.querySelectorAll('.video-card');
    if (videoCards.length === 0) return;
    
    videoCards.forEach(card => {
        const video = card.querySelector('video');
        if (!video) return;
        
        card.addEventListener('mouseenter', () => {
            card.classList.add('video-glow');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('video-glow');
        });
    });
}

// ===================================
// 持续微动效 - 粒子浮动 + 卡片脉动
// ===================================
function initMicroAnimations() {
    // 粒子画布增强 - 浮动效果
    enhanceParticles();
    
    // 卡片呼吸脉动
    initCardPulse();
    
    // 图标浮动
    initIconFloat();
}

function enhanceParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    // 添加浮动动画到现有粒子
    canvas.style.animation = 'canvasFloat 20s ease-in-out infinite';
}

function initCardPulse() {
    const cards = document.querySelectorAll('.card, .service-card, .product-card');
    
    cards.forEach((card, index) => {
        // 错开时间，避免同步
        const delay = index * 0.5;
        card.style.animation = `cardPulse 4s ease-in-out ${delay}s infinite`;
    });
}

function initIconFloat() {
    const icons = document.querySelectorAll('.card-icon, .service-icon');
    
    icons.forEach((icon, index) => {
        const delay = index * 0.3;
        icon.style.animation = `iconFloat 3s ease-in-out ${delay}s infinite`;
    });
}
