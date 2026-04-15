/**
 * 预测性预加载
 * 鼠标悬停链接时开始预加载目标页面
 */

class PredictivePrefetch {
    constructor() {
        this.prefetchCache = new Set();
        this.isPrefetching = false;
        this.init();
    }

    init() {
        // 监听所有内部链接的鼠标悬停
        document.addEventListener('mouseover', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            
            // 只处理内部链接
            if (this.shouldPrefetch(href)) {
                this.prefetch(href);
            }
        }, { passive: true });

        // 监听触摸开始（移动端）
        document.addEventListener('touchstart', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (this.shouldPrefetch(href)) {
                this.prefetch(href);
            }
        }, { passive: true });
    }

    shouldPrefetch(href) {
        // 排除无效链接
        if (!href) return false;
        
        // 排除锚点、邮件、电话、外部链接
        if (href.startsWith('#') || 
            href.startsWith('mailto:') || 
            href.startsWith('tel:') ||
            href.startsWith('http') ||
            href.startsWith('//')) {
            return false;
        }

        // 排除已缓存的
        if (this.prefetchCache.has(href)) {
            return false;
        }

        // 排除当前页面
        if (href === window.location.pathname) {
            return false;
        }

        return true;
    }

    async prefetch(url) {
        if (this.isPrefetching) return;
        
        this.isPrefetching = true;
        this.prefetchCache.add(url);

        try {
            // 使用 fetch 预加载
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(url, {
                method: 'GET',
                signal: controller.signal,
                priority: 'low'
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                // 缓存页面内容
                const html = await response.text();
                this.cachePage(url, html);
                console.log(`[Prefetch] Cached: ${url}`);
            }
        } catch (error) {
            // 静默失败，不影响用户体验
            console.log(`[Prefetch] Failed: ${url}`);
        } finally {
            this.isPrefetching = false;
        }
    }

    cachePage(url, html) {
        // 存储在 sessionStorage 中
        try {
            const key = `prefetch_${url}`;
            sessionStorage.setItem(key, html);
        } catch (e) {
            // 存储空间不足，忽略
        }
    }

    getCachedPage(url) {
        const key = `prefetch_${url}`;
        return sessionStorage.getItem(key);
    }

    clearCache() {
        // 清理所有预缓存
        Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith('prefetch_')) {
                sessionStorage.removeItem(key);
            }
        });
        this.prefetchCache.clear();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.prefetch = new PredictivePrefetch();
});
