/**
 * 页面转场动画系统
 * 提供 App 般的页面切换体验
 */

class PageTransition {
    constructor() {
        this.isTransitioning = false;
        this.currentPage = window.location.pathname;
        this.init();
    }

    init() {
        // 创建转场遮罩
        this.createOverlay();
        
        // 拦截所有内部链接点击
        this.interceptLinks();
        
        // 监听浏览器前进后退
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.url) {
                this.transitionTo(e.state.url, false);
            }
        });

        // 页面加载完成后的入场动画
        this.pageEnterAnimation();
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'page-transition-overlay';
        this.overlay.innerHTML = `
            <div class="transition-loader">
                <div class="transition-loader-ring"></div>
                <div class="transition-loader-ring"></div>
                <div class="transition-loader-ring"></div>
            </div>
        `;
        document.body.appendChild(this.overlay);
    }

    interceptLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            
            // 只处理内部链接
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || 
                href.startsWith('tel:') || href.startsWith('http')) {
                return;
            }

            // 阻止默认跳转
            e.preventDefault();
            
            // 执行转场
            this.transitionTo(href, true);
        });
    }

    async transitionTo(url, pushState = true) {
        if (this.isTransitioning || url === this.currentPage) return;
        
        this.isTransitioning = true;

        // 页面退出动画
        await this.pageExitAnimation();

        try {
            // 预加载新页面内容
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');

            // 更新历史记录
            if (pushState) {
                history.pushState({ url }, '', url);
            }

            // 替换内容
            this.replaceContent(newDoc);

            // 更新当前页面标记
            this.currentPage = url;

            // 页面入场动画
            await this.pageEnterAnimation();

        } catch (error) {
            console.error('Page transition failed:', error);
            // 降级到传统跳转
            window.location.href = url;
        } finally {
            this.isTransitioning = false;
        }
    }

    replaceContent(newDoc) {
        // 替换 body 内容
        const newBody = newDoc.body;
        const oldBody = document.body;

        // 保留转场遮罩和脚本
        const overlay = oldBody.querySelector('.page-transition-overlay');
        const scripts = oldBody.querySelectorAll('script[src]');

        // 替换主要内容
        oldBody.innerHTML = newBody.innerHTML;

        // 恢复转场遮罩
        if (overlay) {
            oldBody.appendChild(overlay);
        }

        // 恢复脚本（如果需要）
        scripts.forEach(script => {
            if (!oldBody.querySelector(`script[src="${script.src}"]`)) {
                const newScript = document.createElement('script');
                newScript.src = script.src;
                oldBody.appendChild(newScript);
            }
        });

        // 更新标题
        document.title = newDoc.title;

        // 触发页面加载事件
        window.dispatchEvent(new Event('DOMContentLoaded'));
        window.dispatchEvent(new Event('load'));
    }

    pageExitAnimation() {
        return new Promise((resolve) => {
            // 显示转场遮罩
            this.overlay.classList.add('active');

            // 页面内容淡出并下移
            const mainContent = document.querySelector('main') || document.body;
            mainContent.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(-20px)';

            setTimeout(resolve, 400);
        });
    }

    pageEnterAnimation() {
        return new Promise((resolve) => {
            const mainContent = document.querySelector('main') || document.body;
            
            // 初始状态：透明且下移
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(20px)';

            // 强制重绘
            mainContent.offsetHeight;

            // 动画进入
            requestAnimationFrame(() => {
                mainContent.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                mainContent.style.opacity = '1';
                mainContent.style.transform = 'translateY(0)';

                // 隐藏转场遮罩
                setTimeout(() => {
                    this.overlay.classList.remove('active');
                    resolve();
                }, 500);
            });
        });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.pageTransition = new PageTransition();
});
