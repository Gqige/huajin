/**
 * 全局磁性效果
 * 导航、卡片、图标等元素都有磁性吸附
 */

class GlobalMagnetic {
    constructor() {
        this.mouse = { x: 0, y: 0 };
        this.elements = [];
        this.init();
    }

    init() {
        // 收集所有需要磁性效果的元素
        this.collectElements();
        
        // 监听鼠标移动
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        }, { passive: true });

        // 开始动画循环
        this.animate();
    }

    collectElements() {
        // 导航链接
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(el => this.addElement(el, { strength: 0.3, radius: 100 }));

        // 卡片
        const cards = document.querySelectorAll('.about-card, .service-circular');
        cards.forEach(el => this.addElement(el, { strength: 0.15, radius: 150 }));

        // 图标
        const icons = document.querySelectorAll('.about-card-icon');
        icons.forEach(el => this.addElement(el, { strength: 0.4, radius: 80 }));

        // 按钮
        const buttons = document.querySelectorAll('.btn, .cta-btn-primary, .cta-btn-secondary');
        buttons.forEach(el => this.addElement(el, { strength: 0.5, radius: 120 }));

        // Logo
        const logo = document.querySelector('.logo');
        if (logo) {
            this.addElement(logo, { strength: 0.2, radius: 100 });
        }

        // 页码指示器
        const dots = document.querySelectorAll('.page-dot');
        dots.forEach(el => this.addElement(el, { strength: 0.6, radius: 60 }));
    }

    addElement(element, options) {
        // 包装元素以便变换
        const wrapper = document.createElement('span');
        wrapper.className = 'magnetic-wrapper';
        wrapper.style.display = 'inline-block';
        wrapper.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // 将原元素内容移到 wrapper
        while (element.firstChild) {
            wrapper.appendChild(element.firstChild);
        }
        element.appendChild(wrapper);

        this.elements.push({
            element: wrapper,
            parent: element,
            strength: options.strength,
            radius: options.radius,
            x: 0,
            y: 0
        });
    }

    animate() {
        this.elements.forEach(item => {
            const rect = item.parent.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // 计算距离
            const distX = this.mouse.x - centerX;
            const distY = this.mouse.y - centerY;
            const distance = Math.sqrt(distX * distX + distY * distY);

            // 如果在影响范围内
            if (distance < item.radius) {
                // 计算吸引力（距离越近越强）
                const force = (1 - distance / item.radius) * item.strength;
                
                // 目标位置
                const targetX = distX * force;
                const targetY = distY * force;

                // 平滑跟随
                item.x += (targetX - item.x) * 0.15;
                item.y += (targetY - item.y) * 0.15;
            } else {
                // 回到原位
                item.x += (0 - item.x) * 0.1;
                item.y += (0 - item.y) * 0.1;
            }

            // 应用变换
            item.element.style.transform = `translate(${item.x}px, ${item.y}px)`;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.globalMagnetic = new GlobalMagnetic();
});
