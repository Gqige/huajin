/**
 * 滚动触发动画链
 * 元素按序列依次入场，形成视觉节奏
 */

class ScrollAnimationChain {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        // 创建 Intersection Observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateEntry(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -10% 0px'
        });

        // 观察所有需要动画的元素
        this.observeElements();
    }

    observeElements() {
        // 为不同区块设置动画链
        const sections = document.querySelectorAll('.fullscreen-section');
        
        sections.forEach(section => {
            // 为每个区块内的元素添加动画类
            this.prepareSectionAnimations(section);
        });
    }

    prepareSectionAnimations(section) {
        // 标题动画
        const titles = section.querySelectorAll('h1, h2, .hero-title-main, .about-simple-title, .about-card-title');
        titles.forEach((el, i) => {
            el.classList.add('scroll-animate', 'animate-title');
            el.style.setProperty('--delay', `${i * 0.1}s`);
            this.observer.observe(el);
        });

        // 副标题/描述动画
        const subtitles = section.querySelectorAll('.hero-subtitle, .about-simple-subtitle, .about-card-desc, .service-circular-subtitle');
        subtitles.forEach((el, i) => {
            el.classList.add('scroll-animate', 'animate-fade-up');
            el.style.setProperty('--delay', `${0.2 + i * 0.1}s`);
            this.observer.observe(el);
        });

        // 卡片动画
        const cards = section.querySelectorAll('.about-card, .service-circular');
        cards.forEach((el, i) => {
            el.classList.add('scroll-animate', 'animate-card');
            el.style.setProperty('--delay', `${i * 0.15}s`);
            this.observer.observe(el);
        });

        // 按钮动画
        const buttons = section.querySelectorAll('.btn, .cta-btn-primary, .cta-btn-secondary');
        buttons.forEach((el, i) => {
            el.classList.add('scroll-animate', 'animate-scale');
            el.style.setProperty('--delay', `${0.3 + i * 0.1}s`);
            this.observer.observe(el);
        });

        // 标签动画
        const labels = section.querySelectorAll('.about-simple-label, .service-label, .about-cards-label');
        labels.forEach((el, i) => {
            el.classList.add('scroll-animate', 'animate-fade');
            el.style.setProperty('--delay', `${i * 0.05}s`);
            this.observer.observe(el);
        });

        // 数据/统计动画
        const stats = section.querySelectorAll('.stat-big, .stat-number-big');
        stats.forEach((el, i) => {
            el.classList.add('scroll-animate', 'animate-count');
            el.style.setProperty('--delay', `${i * 0.1}s`);
            this.observer.observe(el);
        });

        // 分隔线动画
        const dividers = section.querySelectorAll('.service-divider');
        dividers.forEach((el, i) => {
            el.classList.add('scroll-animate', 'animate-line');
            el.style.setProperty('--delay', `${0.2 + i * 0.1}s`);
            this.observer.observe(el);
        });

        // 图标动画
        const icons = section.querySelectorAll('.about-card-icon');
        icons.forEach((el, i) => {
            el.classList.add('scroll-animate', 'animate-icon');
            el.style.setProperty('--delay', `${0.1 + i * 0.1}s`);
            this.observer.observe(el);
        });
    }

    animateEntry(element) {
        const delay = parseFloat(element.style.getPropertyValue('--delay') || '0');
        
        setTimeout(() => {
            element.classList.add('animate-in');
        }, delay * 1000);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.scrollAnimations = new ScrollAnimationChain();
});
