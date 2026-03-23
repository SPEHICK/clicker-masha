// Упрощенная WebGL жидкость в стиле liquidGL
class FluidSimulation {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            console.warn('WebGL не поддерживается');
            return;
        }
        
        this.pointers = [];
        this.splatStack = [];
        this.config = {
            simResolution: 128,
            dyeResolution: 512,
            densityDissipation: 0.97,
            velocityDissipation: 0.98,
            pressure: 0.8,
            curl: 30,
            splatRadius: 0.005,
            colorful: true
        };
        
        this.init();
        this.setupEventListeners();
        this.render();
    }
    
    init() {
        this.resize();
        this.initPrograms();
        this.initFramebuffers();
    }
    
    resize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        
        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
    }
    
    initPrograms() {
        const gl = this.gl;
        
        // Базовый вершинный шейдер
        const vertexShader = this.compileShader(gl.VERTEX_SHADER, `
            precision highp float;
            attribute vec2 aPosition;
            varying vec2 vUv;
            void main() {
                vUv = aPosition * 0.5 + 0.5;
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        `);
        
        // Шейдер для отображения
        const displayShader = this.compileShader(gl.FRAGMENT_SHADER, `
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uTexture;
            uniform float uTime;
            
            void main() {
                vec3 color = texture2D(uTexture, vUv).rgb;
                
                // Добавляем свечение
                float glow = length(color) * 0.5;
                color += vec3(glow * 0.3, glow * 0.1, glow * 0.2);
                
                // Легкая пульсация
                color *= 1.0 + sin(uTime * 2.0) * 0.05;
                
                gl_FragColor = vec4(color, 1.0);
            }
        `);
        
        this.displayProgram = this.createProgram(vertexShader, displayShader);
        
        // Создаем буфер для полноэкранного квада
        const vertices = new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]);
        this.quadBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }
    
    compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Ошибка компиляции шейдера:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    createProgram(vertexShader, fragmentShader) {
        const gl = this.gl;
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Ошибка линковки программы:', gl.getProgramInfoLog(program));
            return null;
        }
        
        return program;
    }
    
    initFramebuffers() {
        const gl = this.gl;
        
        // Создаем текстуру для жидкости
        this.fluidTexture = this.createTexture(this.config.dyeResolution, this.config.dyeResolution);
        this.fluidFramebuffer = this.createFramebuffer(this.fluidTexture);
        
        // Инициализируем с градиентом
        const pixels = new Uint8Array(this.config.dyeResolution * this.config.dyeResolution * 4);
        for (let i = 0; i < pixels.length; i += 4) {
            const idx = i / 4;
            const x = (idx % this.config.dyeResolution) / this.config.dyeResolution;
            const y = Math.floor(idx / this.config.dyeResolution) / this.config.dyeResolution;
            
            pixels[i] = Math.floor(233 * (1 - y) * 0.3); // R
            pixels[i + 1] = Math.floor(69 * (1 - y) * 0.3); // G
            pixels[i + 2] = Math.floor(96 * (1 - y) * 0.3); // B
            pixels[i + 3] = 255; // A
        }
        
        gl.bindTexture(gl.TEXTURE_2D, this.fluidTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.config.dyeResolution, this.config.dyeResolution, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    }
    
    createTexture(width, height) {
        const gl = this.gl;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        return texture;
    }
    
    createFramebuffer(texture) {
        const gl = this.gl;
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return fbo;
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => this.onPointerMove(e));
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.onPointerMove(touch);
        }, { passive: false });
        
        this.canvas.addEventListener('click', (e) => this.onPointerClick(e));
        this.canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.onPointerClick(touch);
        });
        
        window.addEventListener('resize', () => this.resize());
    }
    
    onPointerMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1.0 - (e.clientY - rect.top) / rect.height;
        
        this.addSplat(x, y, Math.random() * 2 - 1, Math.random() * 2 - 1);
    }
    
    onPointerClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1.0 - (e.clientY - rect.top) / rect.height;
        
        // Более сильный всплеск при клике
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5;
            const dx = Math.cos(angle) * 3;
            const dy = Math.sin(angle) * 3;
            this.addSplat(x, y, dx, dy);
        }
    }
    
    addSplat(x, y, dx, dy) {
        this.splatStack.push({
            x, y, dx, dy,
            color: {
                r: 233 / 255,
                g: 69 / 255,
                b: 96 / 255
            }
        });
    }
    
    render(time = 0) {
        const gl = this.gl;
        
        // Обработка всплесков
        this.splatStack.forEach(splat => {
            this.renderSplat(splat);
        });
        this.splatStack = [];
        
        // Отрисовка на экран
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.useProgram(this.displayProgram);
        
        const positionLocation = gl.getAttribLocation(this.displayProgram, 'aPosition');
        const textureLocation = gl.getUniformLocation(this.displayProgram, 'uTexture');
        const timeLocation = gl.getUniformLocation(this.displayProgram, 'uTime');
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.fluidTexture);
        gl.uniform1i(textureLocation, 0);
        gl.uniform1f(timeLocation, time * 0.001);
        
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        
        requestAnimationFrame((t) => this.render(t));
    }
    
    renderSplat(splat) {
        // Упрощенная версия - просто обновляем текстуру
        // В полной версии здесь была бы симуляция жидкости
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fluidCanvas');
    if (canvas) {
        new FluidSimulation(canvas);
    }
});
