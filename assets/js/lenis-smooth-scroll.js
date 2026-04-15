/**
 * Lenis 平滑滚动引擎
 * 提供惯性滚动和流畅的滚动体验
 */

class SmoothScrollEngine {
    constructor() {
        this.lenis = null;
        this.rafId = null;
        this.init();
    }

    init() {
        // 检查是否已加载 Lenis
        if (typeof Lenis === 'undefined') {
            console.warn('Lenis not loaded, falling back to native scroll');
            return;
        }

        // 初始化 Lenis
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        // 动画循环
        this.rafId = requestAnimationFrame(this.raf.bind(this));

        // 监听滚动事件
        this.lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
            // 更新全局滚动进度变量
            window.scrollProgress = progress;
            
            // 触发自定义事件
            window.dispatchEvent(new CustomEvent('smoothscroll', {
                detail: { scroll, limit, velocity, direction, progress }
            }));
        });

        // 与 GSAP ScrollTrigger 集成
        this.integrateWithGSAP();
    }

    raf(time) {
        if (this.lenis) {
            this.lenis.raf(time);
        }
        this.rafId = requestAnimationFrame(this.raf.bind(this));
    }

    integrateWithGSAP() {
        // 如果页面有 GSAP，则集成
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            this.lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                this.lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }

    scrollTo(target, options = {}) {
        if (this.lenis) {
            this.lenis.scrollTo(target, {
                offset: options.offset || 0,
                duration: options.duration || 1.2,
                easing: options.easing,
                immediate: options.immediate || false,
            });
        } else {
            // 降级方案
            const element = typeof target === 'string' ? document.querySelector(target) : target;
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    stop() {
        if (this.lenis) {
            this.lenis.stop();
        }
    }

    start() {
        if (this.lenis) {
            this.lenis.start();
        }
    }

    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        if (this.lenis) {
            this.lenis.destroy();
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.smoothScroll = new SmoothScrollEngine();
});
