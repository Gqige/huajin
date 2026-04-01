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
// 控制台输出
// ===================================
console.log('%c华进（河南）教育科技有限公司', 'color: #2563EB; font-size: 16px; font-weight: bold;');
console.log('%c官网 v2.0 已加载完成', 'color: #10B981; font-size: 12px;');
