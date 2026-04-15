/**
 * 5层视差深度系统
 * 背景网格 → 光晕 → 内容 → 浮动元素 → 前景粒子
 */

class ParallaxDepthSystem {
    constructor() {
        this.layers = [];
        this.scrollY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        this.setupLayers();
        this.addEventListeners();
        this.animate();
    }

    setupLayers() {
        // Layer 1: 背景网格 (最慢)
        const bgGrid = document.querySelector('.bg-grid');
        if (bgGrid) {
            this.layers.push({
                element: bgGrid,
                scrollSpeed: 0.1,
                mouseSpeed: 0.02,
                z: -100
            });
        }

        // Layer 2: 光晕效果
        const bgGlow = document.querySelector('.bg-glow');
        if (bgGlow) {
            this.layers.push({
                element: bgGlow,
                scrollSpeed: 0.2,
                mouseSpeed: 0.05,
                z: -50
            });
        }

        // Layer 3: WebGL 流体背景
        const fluidCanvas = document.getElementById('fluid-canvas');
        if (fluidCanvas) {
            this.layers.push({
                element: fluidCanvas,
                scrollSpeed: 0.3,
                mouseSpeed: 0.08,
                z: 0
            });
        }

        // Layer 4: 主内容
        const mainContent = document.querySelector('.hero-content, .about-simple, .about-cards-container');
        if (mainContent) {
            this.layers.push({
                element: mainContent,
                scrollSpeed: 1,
                mouseSpeed: 0.02,
                z: 50
            });
        }

        // Layer 5: 浮动元素 (最快)
        const floatingElements = document.querySelectorAll('.about-bg-text, .stat-big');
        floatingElements.forEach((el, i) => {
            this.layers.push({
                element: el,
                scrollSpeed: 1.2 + i * 0.1,
                mouseSpeed: 0.1,
                z: 100
            });
        });
    }

    addEventListeners() {
        // 滚动监听
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        }, { passive: true });

        // 鼠标监听
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });
    }

    animate() {
        this.layers.forEach(layer => {
            if (!layer.element) return;

            // 计算视差偏移
            const scrollOffset = this.scrollY * layer.scrollSpeed;
            const mouseOffsetX = this.mouseX * 30 * layer.mouseSpeed;
            const mouseOffsetY = this.mouseY * 20 * layer.mouseSpeed;

            // 应用变换
            const transform = `
                translate3d(${mouseOffsetX}px, ${-scrollOffset + mouseOffsetY}px, ${layer.z}px)
            `;

            layer.element.style.transform = transform;
            layer.element.style.willChange = 'transform';
        });

        requestAnimationFrame(() => this.animate());
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.parallaxSystem = new ParallaxDepthSystem();
});
