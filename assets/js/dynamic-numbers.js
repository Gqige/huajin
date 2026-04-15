/**
 * 动态数字展示
 * 实时数字跳动效果
 */

class DynamicNumbers {
    constructor() {
        this.counters = [];
        this.init();
    }

    init() {
        this.setupCounters();
        this.startAnimation();
    }

    setupCounters() {
        // 找到所有统计数字
        const statNumbers = document.querySelectorAll('.stat-number-big');
        
        statNumbers.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'));
            const current = 0;
            
            this.counters.push({
                element: el,
                target: target,
                current: current,
                displayed: current,
                velocity: 0
            });
        });
    }

    startAnimation() {
        const animate = () => {
            this.counters.forEach(counter => {
                // 模拟实时增长
                if (counter.current < counter.target) {
                    // 计算增长速度（越接近目标越慢）
                    const remaining = counter.target - counter.current;
                    const speed = Math.max(0.5, remaining * 0.02);
                    
                    // 添加随机波动
                    const fluctuation = (Math.random() - 0.5) * speed * 0.3;
                    
                    counter.current += speed + fluctuation;
                    
                    // 确保不超过目标
                    if (counter.current > counter.target) {
                        counter.current = counter.target;
                    }
                    
                    // 显示整数
                    const displayValue = Math.floor(counter.current);
                    if (displayValue !== counter.displayed) {
                        counter.displayed = displayValue;
                        counter.element.textContent = displayValue;
                        
                        // 添加跳动效果
                        this.addBounceEffect(counter.element);
                    }
                }
            });

            requestAnimationFrame(animate);
        };

        animate();
    }

    addBounceEffect(element) {
        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 100);
    }

    // 添加新数据点
    addDataPoint(value) {
        this.counters.forEach(counter => {
            counter.target += value;
        });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.dynamicNumbers = new DynamicNumbers();
});
