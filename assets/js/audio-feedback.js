/**
 * 音频反馈系统
 * 悬停、点击时的科技感音效
 */

class AudioFeedback {
    constructor() {
        this.audioContext = null;
        this.enabled = false;
        this.volume = 0.3;
        this.init();
    }

    init() {
        // 检查用户是否偏好减少动画/声音
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        // 首次交互时初始化音频上下文（浏览器策略要求）
        document.addEventListener('click', () => this.enableAudio(), { once: true });
        document.addEventListener('touchstart', () => this.enableAudio(), { once: true });

        // 绑定事件
        this.bindEvents();
    }

    enableAudio() {
        if (this.enabled) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.enabled = true;
            console.log('[Audio] Enabled');
        } catch (e) {
            console.warn('[Audio] Not supported');
        }
    }

    bindEvents() {
        // 悬停音效
        document.addEventListener('mouseenter', (e) => {
            if (!this.enabled) return;
            
            const target = e.target;
            if (target.matches('a, button, .btn, .nav-links a, .about-card, .page-dot')) {
                this.playHoverSound();
            }
        }, true);

        // 点击音效
        document.addEventListener('click', (e) => {
            if (!this.enabled) return;
            
            const target = e.target;
            if (target.matches('a, button, .btn, .cta-btn-primary, .cta-btn-secondary')) {
                this.playClickSound();
            }
        });
    }

    playHoverSound() {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // 高频短音
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.05);

        gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.05);
    }

    playClickSound() {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // 中频确认音
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
    }

    disable() {
        this.enabled = false;
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.audioFeedback = new AudioFeedback();
});
