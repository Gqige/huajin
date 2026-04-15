/**
 * WebGL 流体背景效果
 * 参考 Stripe.com 渐变流体风格
 */

class FluidBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            console.warn('WebGL not supported, falling back to CSS gradient');
            this.fallback();
            return;
        }
        
        this.mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
        this.time = 0;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createShaders();
        this.createBuffers();
        this.addEventListeners();
        this.animate();
    }
    
    fallback() {
        this.canvas.style.background = `
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 60%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            linear-gradient(180deg, #030712 0%, #0a0f1a 100%)
        `;
    }
    
    createShaders() {
        const gl = this.gl;
        
        // 顶点着色器
        const vertexShaderSource = `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;
        
        // 片段着色器 - 流体效果
        const fragmentShaderSource = `
            precision mediump float;
            
            uniform float time;
            uniform vec2 resolution;
            uniform vec2 mouse;
            
            // 噪声函数
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            
            float snoise(vec3 v) {
                const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                
                vec3 i = floor(v + dot(v, C.yyy));
                vec3 x0 = v - i + dot(i, C.xxx);
                
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min(g.xyz, l.zxy);
                vec3 i2 = max(g.xyz, l.zxy);
                
                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy;
                vec3 x3 = x0 - D.yyy;
                
                i = mod289(i);
                vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                
                float n_ = 0.142857142857;
                vec3 ns = n_ * D.wyz - D.xzx;
                
                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_);
                
                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                
                vec4 b0 = vec4(x.xy, y.xy);
                vec4 b1 = vec4(x.zw, y.zw);
                
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
                
                vec3 p0 = vec3(a0.xy, h.x);
                vec3 p1 = vec3(a0.zw, h.y);
                vec3 p2 = vec3(a1.xy, h.z);
                vec3 p3 = vec3(a1.zw, h.w);
                
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;
                
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
            }
            
            void main() {
                vec2 uv = gl_FragCoord.xy / resolution.xy;
                vec2 p = uv * 2.0 - 1.0;
                p.x *= resolution.x / resolution.y;
                
                // 鼠标影响
                vec2 mousePos = mouse * 2.0 - 1.0;
                mousePos.x *= resolution.x / resolution.y;
                float mouseInfluence = smoothstep(0.5, 0.0, length(p - mousePos));
                
                // 多层噪声
                float t = time * 0.15;
                float n1 = snoise(vec3(p * 0.8, t)) * 0.5 + 0.5;
                float n2 = snoise(vec3(p * 1.5 + 100.0, t * 1.3)) * 0.5 + 0.5;
                float n3 = snoise(vec3(p * 2.5 + 200.0, t * 0.8)) * 0.5 + 0.5;
                
                // 混合噪声
                float noise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
                noise += mouseInfluence * 0.3;
                
                // 颜色映射 - 紫蓝渐变
                vec3 color1 = vec3(0.02, 0.03, 0.07); // 深蓝黑
                vec3 color2 = vec3(0.12, 0.08, 0.25); // 深紫
                vec3 color3 = vec3(0.08, 0.15, 0.35); // 深蓝
                vec3 color4 = vec3(0.23, 0.18, 0.55); // 亮紫
                
                vec3 color = mix(color1, color2, smoothstep(0.0, 0.4, noise));
                color = mix(color, color3, smoothstep(0.3, 0.6, noise));
                color = mix(color, color4, smoothstep(0.5, 0.8, noise) * 0.5);
                
                // 添加辉光
                float glow = smoothstep(0.6, 0.9, noise) * 0.3;
                color += vec3(0.2, 0.15, 0.4) * glow;
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;
        
        // 编译着色器
        this.program = gl.createProgram();
        
        const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
        
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error('Shader link failed:', gl.getProgramInfoLog(this.program));
        }
        
        // 获取 uniform 位置
        this.uniforms = {
            time: gl.getUniformLocation(this.program, 'time'),
            resolution: gl.getUniformLocation(this.program, 'resolution'),
            mouse: gl.getUniformLocation(this.program, 'mouse')
        };
    }
    
    compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile failed:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    createBuffers() {
        const gl = this.gl;
        
        // 全屏四边形
        const vertices = new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1
        ]);
        
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        
        const position = gl.getAttribLocation(this.program, 'position');
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    }
    
    addEventListeners() {
        // 鼠标跟踪
        document.addEventListener('mousemove', (e) => {
            this.mouse.targetX = e.clientX / window.innerWidth;
            this.mouse.targetY = 1.0 - e.clientY / window.innerHeight;
        }, { passive: true });
        
        // 触摸支持
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouse.targetX = e.touches[0].clientX / window.innerWidth;
                this.mouse.targetY = 1.0 - e.touches[0].clientY / window.innerHeight;
            }
        }, { passive: true });
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        const dpr = Math.min(window.devicePixelRatio, 2);
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        
        if (this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    animate() {
        const gl = this.gl;
        
        // 平滑鼠标跟随
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;
        
        this.time += 0.016;
        
        gl.useProgram(this.program);
        
        gl.uniform1f(this.uniforms.time, this.time);
        gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
        gl.uniform2f(this.uniforms.mouse, this.mouse.x, this.mouse.y);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.gl) {
            this.gl.deleteProgram(this.program);
            this.gl.deleteBuffer(this.buffer);
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fluid-canvas');
    if (canvas) {
        window.fluidBackground = new FluidBackground(canvas);
    }
});
