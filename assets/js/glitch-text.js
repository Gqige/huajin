/**
 * 文字故障效果 (Glitch Effect)
 * RGB分离 + 错位抖动
 */

class GlitchText {
    constructor(element, options = {}) {
        this.element = element;
        this.originalText = element.textContent;
        this.options = {
            intensity: options.intensity || 0.3,
            duration: options.duration || 2000,
            interval: options.interval || 5000,
            ...options
        };
        
        this.init();
    }
    
    init() {
        // 包装元素
        this.wrapElement();
        
        // 开始故障循环
        this.startGlitchLoop();
        
        // 鼠标悬停时触发
        this.element.addEventListener('mouseenter', () => {
            this.triggerGlitch();
        });
    }
    
    wrapElement() {
        const wrapper = document.createElement('span');
        wrapper.className = 'glitch-text-wrapper';
        
        // 创建 RGB 层
        const rLayer = document.createElement('span');
        rLayer.className = 'glitch-layer glitch-r';
        rLayer.textContent = this.originalText;
        rLayer.setAttribute('aria-hidden', 'true');
        
        const gLayer = document.createElement('span');
        gLayer.className = 'glitch-layer glitch-g';
        gLayer.textContent = this.originalText;
        gLayer.setAttribute('aria-hidden', 'true');
        
        const bLayer = document.createElement('span');
        bLayer.className = 'glitch-layer glitch-b';
        bLayer.textContent = this.originalText;
        bLayer.setAttribute('aria-hidden', 'true');
        
        // 保留原始文本
        this.element.innerHTML = '';
        this.element.appendChild(rLayer);
        this.element.appendChild(gLayer);
        this.element.appendChild(bLayer);
        
        // 添加原始文本作为可见层
        const original = document.createElement('span');
        original.className = 'glitch-original';
        original.textContent = this.originalText;
        this.element.appendChild(original);
        
        // 保存引用
        this.layers = { r: rLayer, g: gLayer, b: bLayer };
    }
    
    startGlitchLoop() {
        setInterval(() => {
            if (Math.random() < this.options.intensity) {
                this.triggerGlitch();
            }
        }, this.options.interval);
    }
    
    triggerGlitch() {
        const duration = this.options.duration;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                this.resetLayers();
                return;
            }
            
            // 故障强度随时间衰减
            const intensity = (1 - progress) * this.options.intensity;
            
            // 随机偏移
            this.layers.r.style.transform = `translate(${this.randomOffset(intensity)}, ${this.randomOffset(intensity)})`;
            this.layers.g.style.transform = `translate(${this.randomOffset(intensity)}, ${this.randomOffset(intensity)})`;
            this.layers.b.style.transform = `translate(${this.randomOffset(intensity)}, ${this.randomOffset(intensity)})`;
            
            // 随机透明度
            this.layers.r.style.opacity = 0.5 + Math.random() * 0.5;
            this.layers.g.style.opacity = 0.5 + Math.random() * 0.5;
            this.layers.b.style.opacity = 0.5 + Math.random() * 0.5;
            
            // 随机裁剪
            if (Math.random() < 0.3) {
                this.applyClipPath();
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    randomOffset(intensity) {
        return (Math.random() - 0.5) * 10 * intensity + 'px';
    }
    
    applyClipPath() {
        const top = Math.random() * 100;
        const bottom = top + Math.random() * 20;
        const clipPath = `inset(${top}% 0 ${100 - bottom}% 0)`;
        
        Object.values(this.layers).forEach(layer => {
            layer.style.clipPath = clipPath;
        });
    }
    
    resetLayers() {
        Object.values(this.layers).forEach(layer => {
            layer.style.transform = 'translate(0, 0)';
            layer.style.opacity = '0';
            layer.style.clipPath = 'none';
        });
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    // 为特定元素添加故障效果
    const glitchElements = document.querySelectorAll('.glitch-effect, .hero-title-main, .about-simple-title');
    
    glitchElements.forEach((el, index) => {
        // 错开初始化时间
        setTimeout(() => {
            new GlitchText(el, {
                intensity: 0.4,
                duration: 1500,
                interval: 8000 + Math.random() * 4000
            });
        }, index * 500);
    });
});
