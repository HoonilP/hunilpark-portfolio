'use client';

import { useEffect, useRef } from 'react';

interface FluidCursorProps {
  className?: string;
}

export default function FluidCursor({ className = '' }: FluidCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const params = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };

    let gl = canvas.getContext('webgl2', params) as WebGL2RenderingContext | null;
    const isWebGL2 = !!gl;
    if (!gl) {
      gl = (canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params)) as WebGL2RenderingContext | null;
    }
    if (!gl) return;

    const config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1024,
      DENSITY_DISSIPATION: 3.5,
      VELOCITY_DISSIPATION: 2,
      PRESSURE: 0.1,
      PRESSURE_ITERATIONS: 20,
      CURL: 3,
      SPLAT_RADIUS: 0.2,
      SPLAT_FORCE: 6000,
      SHADING: true,
      COLOR_UPDATE_SPEED: 10,
    };

    // WebGL extensions
    let halfFloat: { HALF_FLOAT_OES: number } | null = null;
    let supportLinearFiltering: unknown;
    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
      supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
    } else {
      halfFloat = gl.getExtension('OES_texture_half_float') as { HALF_FLOAT_OES: number } | null;
      supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : (halfFloat?.HALF_FLOAT_OES ?? gl.HALF_FLOAT);

    function getSupportedFormat(glCtx: WebGL2RenderingContext, internalFormat: number, format: number, type: number): { internalFormat: number; format: number } | null {
      const texture = glCtx.createTexture();
      glCtx.bindTexture(glCtx.TEXTURE_2D, texture);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MIN_FILTER, glCtx.NEAREST);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MAG_FILTER, glCtx.NEAREST);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_S, glCtx.CLAMP_TO_EDGE);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_T, glCtx.CLAMP_TO_EDGE);
      glCtx.texImage2D(glCtx.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      const fbo = glCtx.createFramebuffer();
      glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, fbo);
      glCtx.framebufferTexture2D(glCtx.FRAMEBUFFER, glCtx.COLOR_ATTACHMENT0, glCtx.TEXTURE_2D, texture, 0);
      const status = glCtx.checkFramebufferStatus(glCtx.FRAMEBUFFER);
      if (status !== glCtx.FRAMEBUFFER_COMPLETE) {
        if (internalFormat === glCtx.R16F) return getSupportedFormat(glCtx, glCtx.RG16F, glCtx.RG, type);
        if (internalFormat === glCtx.RG16F) return getSupportedFormat(glCtx, glCtx.RGBA16F, glCtx.RGBA, type);
        return null;
      }
      return { internalFormat, format };
    }

    let formatRGBA: { internalFormat: number; format: number } | null;
    let formatRG: { internalFormat: number; format: number } | null;
    let formatR: { internalFormat: number; format: number } | null;

    if (isWebGL2) {
      formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
      formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
    } else {
      formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatRG = formatRGBA;
      formatR = formatRGBA;
    }

    if (!formatRGBA || !formatRG || !formatR) return;

    // Compile shader helper
    function compileShader(glCtx: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      return shader;
    }

    function createProgram(glCtx: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader) {
      const program = glCtx.createProgram()!;
      glCtx.attachShader(program, vs);
      glCtx.attachShader(program, fs);
      glCtx.linkProgram(program);
      return program;
    }

    function getUniforms(glCtx: WebGL2RenderingContext, program: WebGLProgram) {
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const count = glCtx.getProgramParameter(program, glCtx.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const name = glCtx.getActiveUniform(program, i)?.name;
        if (name) uniforms[name] = glCtx.getUniformLocation(program, name);
      }
      return uniforms;
    }

    const baseVS = compileShader(gl, gl.VERTEX_SHADER, `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform vec2 texelSize;
      void main() {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `)!;

    const makeFS = (src: string) => compileShader(gl!, gl!.FRAGMENT_SHADER, src)!;

    const clearFS = makeFS(`
      precision mediump float;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main() { gl_FragColor = value * texture2D(uTexture, vUv); }
    `);

    const splatFS = makeFS(`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main() {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `);

    const advectionFS = makeFS(`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity, uSource;
      uniform vec2 texelSize, dyeTexelSize;
      uniform float dt, dissipation;
      void main() {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }
    `);

    const divergenceFS = makeFS(`
      precision mediump float;
      varying highp vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uVelocity;
      void main() {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) L = -C.x;
        if (vR.x > 1.0) R = -C.x;
        if (vT.y > 1.0) T = -C.y;
        if (vB.y < 0.0) B = -C.y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `);

    const curlFS = makeFS(`
      precision mediump float;
      varying highp vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uVelocity;
      void main() {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `);

    const vorticityFS = makeFS(`
      precision highp float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uVelocity, uCurl;
      uniform float curl, dt;
      void main() {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity += force * dt;
        velocity = min(max(velocity, -1000.0), 1000.0);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `);

    const pressureFS = makeFS(`
      precision mediump float;
      varying highp vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uPressure, uDivergence;
      void main() {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `);

    const gradientFS = makeFS(`
      precision mediump float;
      varying highp vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uPressure, uVelocity;
      void main() {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `);

    const displayFS = makeFS(`
      precision highp float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      void main() {
        vec3 c = texture2D(uTexture, vUv).rgb;
        vec3 lc = texture2D(uTexture, vL).rgb;
        vec3 rc = texture2D(uTexture, vR).rgb;
        vec3 tc = texture2D(uTexture, vT).rgb;
        vec3 bc = texture2D(uTexture, vB).rgb;
        float dx = length(rc) - length(lc);
        float dy = length(tc) - length(bc);
        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
        vec3 l = vec3(0.0, 0.0, 1.0);
        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
        c *= diffuse;
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
      }
    `);

    // Create programs
    type Prog = { program: WebGLProgram; uniforms: Record<string, WebGLUniformLocation | null>; bind: () => void };
    function makeProg(vs: WebGLShader, fs: WebGLShader): Prog {
      const program = createProgram(gl!, vs, fs);
      const uniforms = getUniforms(gl!, program);
      return { program, uniforms, bind: () => gl!.useProgram(program) };
    }

    const clearProg = makeProg(baseVS, clearFS);
    const splatProg = makeProg(baseVS, splatFS);
    const advectionProg = makeProg(baseVS, advectionFS);
    const divergenceProg = makeProg(baseVS, divergenceFS);
    const curlProg = makeProg(baseVS, curlFS);
    const vorticityProg = makeProg(baseVS, vorticityFS);
    const pressureProg = makeProg(baseVS, pressureFS);
    const gradientProg = makeProg(baseVS, gradientFS);
    const displayProg = makeProg(baseVS, displayFS);

    // Blit setup
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    type FBO = { texture: WebGLTexture; fbo: WebGLFramebuffer; width: number; height: number; texelSizeX: number; texelSizeY: number; attach: (id: number) => number };
    type DoubleFBO = { width: number; height: number; texelSizeX: number; texelSizeY: number; read: FBO; write: FBO; swap: () => void };

    function blit(target: FBO | null) {
      if (!target) {
        gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight);
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      } else {
        gl!.viewport(0, 0, target.width, target.height);
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo);
      }
      gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0);
    }

    function createFBO(w: number, h: number, intFmt: number, fmt: number, type: number, param: number): FBO {
      gl!.activeTexture(gl!.TEXTURE0);
      const texture = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, param);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, param);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, intFmt, w, h, 0, fmt, type, null);
      const fbo = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0);
      gl!.viewport(0, 0, w, h);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      return {
        texture, fbo, width: w, height: h,
        texelSizeX: 1 / w, texelSizeY: 1 / h,
        attach(id: number) { gl!.activeTexture(gl!.TEXTURE0 + id); gl!.bindTexture(gl!.TEXTURE_2D, texture); return id; },
      };
    }

    function createDoubleFBO(w: number, h: number, intFmt: number, fmt: number, type: number, param: number): DoubleFBO {
      let fbo1 = createFBO(w, h, intFmt, fmt, type, param);
      let fbo2 = createFBO(w, h, intFmt, fmt, type, param);
      return {
        width: w, height: h, texelSizeX: fbo1.texelSizeX, texelSizeY: fbo1.texelSizeY,
        get read() { return fbo1; }, set read(v) { fbo1 = v; },
        get write() { return fbo2; }, set write(v) { fbo2 = v; },
        swap() { const t = fbo1; fbo1 = fbo2; fbo2 = t; },
      };
    }

    function getResolution(resolution: number) {
      let ar = gl!.drawingBufferWidth / gl!.drawingBufferHeight;
      if (ar < 1) ar = 1 / ar;
      const min = Math.round(resolution);
      const max = Math.round(resolution * ar);
      return gl!.drawingBufferWidth > gl!.drawingBufferHeight ? { width: max, height: min } : { width: min, height: max };
    }

    const filtering = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
    const simRes = getResolution(config.SIM_RESOLUTION);
    const dyeRes = getResolution(config.DYE_RESOLUTION);

    let dye = createDoubleFBO(dyeRes.width, dyeRes.height, formatRGBA!.internalFormat, formatRGBA!.format, halfFloatTexType, filtering);
    let velocity = createDoubleFBO(simRes.width, simRes.height, formatRG!.internalFormat, formatRG!.format, halfFloatTexType, filtering);
    let divergence = createFBO(simRes.width, simRes.height, formatR!.internalFormat, formatR!.format, halfFloatTexType, gl.NEAREST);
    let curlFBO = createFBO(simRes.width, simRes.height, formatR!.internalFormat, formatR!.format, halfFloatTexType, gl.NEAREST);
    let pressure = createDoubleFBO(simRes.width, simRes.height, formatR!.internalFormat, formatR!.format, halfFloatTexType, gl.NEAREST);

    // Pointer state
    const pointer = {
      texcoordX: 0, texcoordY: 0,
      prevTexcoordX: 0, prevTexcoordY: 0,
      deltaX: 0, deltaY: 0, moved: false,
      color: { r: 0, g: 0, b: 0 },
    };

    function generateColor() {
      // Blue hues (H: 0.55-0.68)
      const h = 0.55 + Math.random() * 0.13;
      const s = 0.7 + Math.random() * 0.3;
      const v = 1.0;
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
      let r = 0, g = 0, b = 0;
      switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
      }
      return { r: r * 0.15, g: g * 0.15, b: b * 0.15 };
    }

    pointer.color = generateColor();

    function splat(x: number, y: number, dx: number, dy: number, color: { r: number; g: number; b: number }) {
      splatProg.bind();
      gl!.uniform1i(splatProg.uniforms.uTarget, velocity.read.attach(0));
      gl!.uniform1f(splatProg.uniforms.aspectRatio, canvas!.width / canvas!.height);
      gl!.uniform2f(splatProg.uniforms.point, x, y);
      gl!.uniform3f(splatProg.uniforms.color, dx, dy, 0.0);
      const radius = config.SPLAT_RADIUS / 100;
      const ar = canvas!.width / canvas!.height;
      gl!.uniform1f(splatProg.uniforms.radius, ar > 1 ? radius * ar : radius);
      blit(velocity.write);
      velocity.swap();
      gl!.uniform1i(splatProg.uniforms.uTarget, dye.read.attach(0));
      gl!.uniform3f(splatProg.uniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    }

    function step(dt: number) {
      gl!.disable(gl!.BLEND);

      curlProg.bind();
      gl!.uniform2f(curlProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(curlProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(curlFBO);

      vorticityProg.bind();
      gl!.uniform2f(vorticityProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(vorticityProg.uniforms.uVelocity, velocity.read.attach(0));
      gl!.uniform1i(vorticityProg.uniforms.uCurl, curlFBO.attach(1));
      gl!.uniform1f(vorticityProg.uniforms.curl, config.CURL);
      gl!.uniform1f(vorticityProg.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divergenceProg.bind();
      gl!.uniform2f(divergenceProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(divergenceProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      clearProg.bind();
      gl!.uniform1i(clearProg.uniforms.uTexture, pressure.read.attach(0));
      gl!.uniform1f(clearProg.uniforms.value, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      pressureProg.bind();
      gl!.uniform2f(pressureProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(pressureProg.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl!.uniform1i(pressureProg.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gradientProg.bind();
      gl!.uniform2f(gradientProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(gradientProg.uniforms.uPressure, pressure.read.attach(0));
      gl!.uniform1i(gradientProg.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      advectionProg.bind();
      gl!.uniform2f(advectionProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform2f(advectionProg.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      const velId = velocity.read.attach(0);
      gl!.uniform1i(advectionProg.uniforms.uVelocity, velId);
      gl!.uniform1i(advectionProg.uniforms.uSource, velId);
      gl!.uniform1f(advectionProg.uniforms.dt, dt);
      gl!.uniform1f(advectionProg.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      gl!.uniform2f(advectionProg.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      gl!.uniform1i(advectionProg.uniforms.uVelocity, velocity.read.attach(0));
      gl!.uniform1i(advectionProg.uniforms.uSource, dye.read.attach(1));
      gl!.uniform1f(advectionProg.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    }

    function render() {
      gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
      gl!.enable(gl!.BLEND);
      displayProg.bind();
      gl!.uniform2f(displayProg.uniforms.texelSize, 1 / gl!.drawingBufferWidth, 1 / gl!.drawingBufferHeight);
      gl!.uniform1i(displayProg.uniforms.uTexture, dye.read.attach(0));
      blit(null);
    }

    // Resize
    function resizeCanvas() {
      const pr = window.devicePixelRatio || 1;
      const w = Math.floor(canvas!.clientWidth * pr);
      const h = Math.floor(canvas!.clientHeight * pr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        return true;
      }
      return false;
    }

    let lastTime = Date.now();
    let colorTimer = 0;
    let animId = 0;

    function update() {
      const now = Date.now();
      let dt = (now - lastTime) / 1000;
      dt = Math.min(dt, 0.016666);
      lastTime = now;

      if (resizeCanvas()) {
        const simR = getResolution(config.SIM_RESOLUTION);
        const dyeR = getResolution(config.DYE_RESOLUTION);
        dye = createDoubleFBO(dyeR.width, dyeR.height, formatRGBA!.internalFormat, formatRGBA!.format, halfFloatTexType, filtering);
        velocity = createDoubleFBO(simR.width, simR.height, formatRG!.internalFormat, formatRG!.format, halfFloatTexType, filtering);
        divergence = createFBO(simR.width, simR.height, formatR!.internalFormat, formatR!.format, halfFloatTexType, gl!.NEAREST);
        curlFBO = createFBO(simR.width, simR.height, formatR!.internalFormat, formatR!.format, halfFloatTexType, gl!.NEAREST);
        pressure = createDoubleFBO(simR.width, simR.height, formatR!.internalFormat, formatR!.format, halfFloatTexType, gl!.NEAREST);
      }

      colorTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorTimer >= 1) {
        colorTimer %= 1;
        pointer.color = generateColor();
      }

      if (pointer.moved) {
        pointer.moved = false;
        const dx = pointer.deltaX * config.SPLAT_FORCE;
        const dy = pointer.deltaY * config.SPLAT_FORCE;
        splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
      }

      step(dt);
      render();
      animId = requestAnimationFrame(update);
    }

    // Events
    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const pr = window.devicePixelRatio || 1;
      const posX = (e.clientX - rect.left) * pr;
      const posY = (e.clientY - rect.top) * pr;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas!.width;
      pointer.texcoordY = 1.0 - posY / canvas!.height;
      pointer.deltaX = pointer.texcoordX - pointer.prevTexcoordX;
      pointer.deltaY = pointer.texcoordY - pointer.prevTexcoordY;
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
    }

    function onTouchMove(e: TouchEvent) {
      const touch = e.targetTouches[0];
      if (!touch) return;
      const rect = canvas!.getBoundingClientRect();
      const pr = window.devicePixelRatio || 1;
      const posX = (touch.clientX - rect.left) * pr;
      const posY = (touch.clientY - rect.top) * pr;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas!.width;
      pointer.texcoordY = 1.0 - posY / canvas!.height;
      pointer.deltaX = pointer.texcoordX - pointer.prevTexcoordX;
      pointer.deltaY = pointer.texcoordY - pointer.prevTexcoordY;
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
    }

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });

    resizeCanvas();
    update();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
}
