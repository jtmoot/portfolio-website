import { useEffect, useLayoutEffect } from "react";

const sourceScripts = [
  {
    "src": "https://cdn.tailwindcss.com",
    "type": "",
    "id": "",
    "async": false,
    "defer": false,
    "content": ""
  },
  {
    "src": "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
    "type": "",
    "id": "",
    "async": false,
    "defer": false,
    "content": ""
  },
  {
    "src": "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
    "type": "",
    "id": "",
    "async": false,
    "defer": false,
    "content": ""
  },
  {
    "src": "https://unpkg.com/lucide@latest",
    "type": "",
    "id": "",
    "async": false,
    "defer": false,
    "content": ""
  },
  {
    "src": "",
    "type": "",
    "id": "",
    "async": false,
    "defer": false,
    "content": "\n      lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });\n      gsap.registerPlugin(ScrollTrigger);\n\n      /* ── Background parallax layers ── */\n      gsap.to(\"#bg-layer-1\", { yPercent: -18, ease: \"none\",\n        scrollTrigger: { trigger: document.body, start: \"top top\", end: \"bottom bottom\", scrub: 1.2 } });\n      gsap.to(\"#bg-layer-2\", { yPercent: -35, ease: \"none\",\n        scrollTrigger: { trigger: document.body, start: \"top top\", end: \"bottom bottom\", scrub: 0.8 } });\n\n      /* ── Hero intro: element-by-element blur + slide in ── */\n      gsap.fromTo(\".hero-el\",\n        { opacity: 0, y: 40, filter: \"blur(12px)\" },\n        { opacity: 1, y: 0, filter: \"blur(0px)\", duration: 1.2, stagger: 0.14, ease: \"power3.out\", delay: 0.25 });\n      gsap.fromTo(\"#nav\", { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: \"power3.out\" });\n\n      /* ── Hero torus scroll behaviour: scale, rotate, drift ── */\n      gsap.to(\"#torus\", { yPercent: 30, rotate: 25, scale: 0.85, ease: \"none\",\n        scrollTrigger: { trigger: \"#hero\", start: \"top top\", end: \"bottom top\", scrub: 1 } });\n      gsap.to(\"#hero\", { opacity: 0.15, ease: \"none\",\n        scrollTrigger: { trigger: \"#hero\", start: \"40% top\", end: \"bottom top\", scrub: true } });\n\n      /* ── Floating idle animation on torus ── */\n      gsap.to(\"#torus\", { y: \"-=14\", duration: 3.2, yoyo: true, repeat: -1, ease: \"sine.inOut\" });\n\n      /* ── Studio cards: staggered rise + blur reveal ── */\n      gsap.fromTo(\".studio-card\",\n        { opacity: 0, y: 70, filter: \"blur(10px)\", scale: 0.94 },\n        { opacity: 1, y: 0, filter: \"blur(0px)\", scale: 1, duration: 1, stagger: 0.12, ease: \"power3.out\",\n          scrollTrigger: { trigger: \"#cards\", start: \"top 78%\" } });\n\n      /* ── Sticky storytelling: pinned stage with progressive reveals ── */\n      const storyTl = gsap.timeline({\n        scrollTrigger: { trigger: \"#story-pin\", start: \"top top\", end: \"+=120%\", pin: true, scrub: 0.8 }\n      });\n      storyTl.fromTo(\"#stage\", { scale: 0.82, opacity: 0.3, filter: \"blur(8px)\" },\n        { scale: 1, opacity: 1, filter: \"blur(0px)\", ease: \"power2.out\", duration: 1 })\n        .fromTo(\".story-el:not(#stage)\", { opacity: 0, y: 50, filter: \"blur(6px)\" },\n        { opacity: 1, y: 0, filter: \"blur(0px)\", stagger: 0.15, ease: \"power2.out\", duration: 0.8 }, \"-=0.4\");\n\n      /* ── Odyssey: image parallax + word-by-word title ── */\n      gsap.fromTo(\"#odyssey-art\", { y: 90, opacity: 0, rotate: -3, filter: \"blur(10px)\" },\n        { y: 0, opacity: 1, rotate: 0, filter: \"blur(0px)\", duration: 1.4, ease: \"power3.out\",\n          scrollTrigger: { trigger: \"#odyssey\", start: \"top 70%\" } });\n      gsap.to(\"#odyssey-art\", { yPercent: -8, ease: \"none\",\n        scrollTrigger: { trigger: \"#odyssey\", start: \"top bottom\", end: \"bottom top\", scrub: 1 } });\n      gsap.fromTo(\".odyssey-el\", { opacity: 0, x: 60, filter: \"blur(8px)\" },\n        { opacity: 1, x: 0, filter: \"blur(0px)\", duration: 1, stagger: 0.12, ease: \"power3.out\",\n          scrollTrigger: { trigger: \"#odyssey\", start: \"top 65%\" } });\n\n      /* ── CTA reveal ── */\n      gsap.fromTo(\".cta-el\", { opacity: 0, y: 40, filter: \"blur(8px)\" },\n        { opacity: 1, y: 0, filter: \"blur(0px)\", duration: 1, stagger: 0.15, ease: \"power3.out\",\n          scrollTrigger: { trigger: \"#cta\", start: \"top 75%\" } });\n\n      /* ── Project cards: alternating slide + blur ── */\n      gsap.utils.toArray(\".proj-card\").forEach((card, i) => {\n        gsap.fromTo(card, { opacity: 0, y: 80, x: i % 2 ? 40 : -40, filter: \"blur(10px)\" },\n          { opacity: 1, y: 0, x: 0, filter: \"blur(0px)\", duration: 1.1, ease: \"power3.out\",\n            scrollTrigger: { trigger: card, start: \"top 85%\" } });\n      });\n\n      /* ── Footer ── */\n      gsap.fromTo(\".footer-el\", { opacity: 0, y: 30 },\n        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: \"power2.out\",\n          scrollTrigger: { trigger: \"#contacts\", start: \"top 90%\" } });\n\n      /* ── Magnetic button micro-interaction ── */\n      const mag = document.getElementById(\"magnetic-btn\");\n      mag.addEventListener(\"mousemove\", e => {\n        const r = mag.getBoundingClientRect();\n        gsap.to(mag, { x: (e.clientX - r.left - r.width/2) * 0.3, y: (e.clientY - r.top - r.height/2) * 0.4, duration: 0.4, ease: \"power2.out\" });\n      });\n      mag.addEventListener(\"mouseleave\", () => gsap.to(mag, { x: 0, y: 0, duration: 0.6, ease: \"elastic.out(1,0.4)\" }));\n\n      /* ── Nav underline micro-interaction ── */\n      document.querySelectorAll(\".nav-link\").forEach(l => {\n        const u = document.createElement(\"span\");\n        u.className = \"absolute -bottom-1 left-0 h-px w-full bg-orange-300 origin-left scale-x-0 transition-transform duration-300\";\n        l.appendChild(u);\n        l.addEventListener(\"mouseenter\", () => u.style.transform = \"scaleX(1)\");\n        l.addEventListener(\"mouseleave\", () => u.style.transform = \"scaleX(0)\");\n      });\n\n      /* ── Cursor-reactive torus tilt ── */\n      window.addEventListener(\"mousemove\", e => {\n        const px = (e.clientX / window.innerWidth - 0.5), py = (e.clientY / window.innerHeight - 0.5);\n        gsap.to(\"#torus\", { rotationY: px * 10, rotationX: -py * 10, x: px * 20, duration: 1, ease: \"power2.out\", overwrite: \"auto\" });\n      });\n    "
  },
  {
    "src": "",
    "type": "",
    "id": "",
    "async": false,
    "defer": false,
    "content": "\n      (function(){\n        var canvas=document.getElementById('hero-gl');\n        if(!canvas)return;\n        var gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false});\n        if(!gl)return;\n        function resize(){var d=Math.min(window.devicePixelRatio||1,2);canvas.width=canvas.clientWidth*d;canvas.height=canvas.clientHeight*d;gl.viewport(0,0,canvas.width,canvas.height);}\n        window.addEventListener('resize',resize);resize();\n        function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o;}\n        function prog(v,f){var p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,v));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,f));gl.linkProgram(p);return p;}\n        /* mesh gradient shader */\n        var gp=prog(\n          'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}',\n          'precision mediump float;uniform vec2 r;uniform float t;'+\n          'void main(){vec2 uv=gl_FragCoord.xy/r;'+\n          'vec2 c1=vec2(.28+.14*sin(t*.31),.62+.12*cos(t*.42));'+\n          'vec2 c2=vec2(.74+.12*cos(t*.24),.34+.14*sin(t*.37));'+\n          'vec2 c3=vec2(.5+.2*sin(t*.19+2.),.5+.18*sin(t*.28+1.));'+\n          'float d1=exp(-3.2*length(uv-c1));float d2=exp(-3.2*length(uv-c2));float d3=exp(-3.8*length(uv-c3));'+\n          'vec3 col=vec3(.13,.25,.78)*d1+vec3(.04,.5,.6)*d2+vec3(.98,.55,.25)*d3*.5;'+\n          'float a=clamp((d1+d2+d3)*.5,0.,.75);gl_FragColor=vec4(col,a);}');\n        /* particle shader */\n        var pp=prog(\n          'attribute vec2 a;attribute float s;varying float vs;void main(){vs=s;gl_Position=vec4(a,0.,1.);gl_PointSize=s;}',\n          'precision mediump float;varying float vs;'+\n          'void main(){vec2 d=gl_PointCoord-vec2(.5);float m=smoothstep(.5,.08,length(d));'+\n          'vec3 c=mix(vec3(.55,.7,1.),vec3(1.,.78,.45),step(3.2,vs));'+\n          'gl_FragColor=vec4(c*m,m*.9);}');\n        var qb=gl.createBuffer();\n        gl.bindBuffer(gl.ARRAY_BUFFER,qb);\n        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);\n        /* attractor follows the cursor (defaults to center) */\n        var mx=0,my=0;\n        window.addEventListener('mousemove',function(e){\n          var b=canvas.getBoundingClientRect();\n          mx=((e.clientX-b.left)/b.width)*2-1;\n          my=-(((e.clientY-b.top)/b.height)*2-1);\n        });\n        var N=1400,pos=new Float32Array(N*2),vel=new Float32Array(N*2),siz=new Float32Array(N);\n        /* spawn particles spread across the whole hero */\n        function spawn(i){\n          pos[2*i]=Math.random()*2-1;pos[2*i+1]=Math.random()*2-1;\n          vel[2*i]=0;vel[2*i+1]=0;siz[i]=1.5+Math.random()*3.5;}\n        for(var i=0;i<N;i++){spawn(i);}\n        var pb=gl.createBuffer(),sb=gl.createBuffer();\n        gl.bindBuffer(gl.ARRAY_BUFFER,sb);gl.bufferData(gl.ARRAY_BUFFER,siz,gl.STATIC_DRAW);\n        var t0=performance.now();\n        function frame(now){\n          var t=(now-t0)/1000,dt=.016;\n          gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);\n          gl.enable(gl.BLEND);\n          gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);\n          gl.useProgram(gp);\n          gl.bindBuffer(gl.ARRAY_BUFFER,qb);\n          var lp=gl.getAttribLocation(gp,'p');gl.enableVertexAttribArray(lp);gl.vertexAttribPointer(lp,2,gl.FLOAT,false,0,0);\n          gl.uniform2f(gl.getUniformLocation(gp,'r'),canvas.width,canvas.height);\n          gl.uniform1f(gl.getUniformLocation(gp,'t'),t);\n          gl.drawArrays(gl.TRIANGLE_STRIP,0,4);\n          for(var i=0;i<N;i++){\n            var dx=mx-pos[2*i],dy=my-pos[2*i+1],d=Math.sqrt(dx*dx+dy*dy)+1e-4;\n            var f=.6/(d+.08);\n            vel[2*i]+=(dx/d*f-dy/d*f*.35)*dt;\n            vel[2*i+1]+=(dy/d*f+dx/d*f*.35)*dt;\n            vel[2*i]*=.99;vel[2*i+1]*=.99;\n            pos[2*i]+=vel[2*i]*dt;pos[2*i+1]+=vel[2*i+1]*dt;\n            if(d<.06)spawn(i);\n          }\n          gl.blendFunc(gl.SRC_ALPHA,gl.ONE);\n          gl.useProgram(pp);\n          gl.bindBuffer(gl.ARRAY_BUFFER,pb);gl.bufferData(gl.ARRAY_BUFFER,pos,gl.DYNAMIC_DRAW);\n          var la=gl.getAttribLocation(pp,'a');gl.enableVertexAttribArray(la);gl.vertexAttribPointer(la,2,gl.FLOAT,false,0,0);\n          gl.bindBuffer(gl.ARRAY_BUFFER,sb);\n          var ls=gl.getAttribLocation(pp,'s');gl.enableVertexAttribArray(ls);gl.vertexAttribPointer(ls,1,gl.FLOAT,false,0,0);\n          gl.drawArrays(gl.POINTS,0,N);\n          requestAnimationFrame(frame);\n        }\n        requestAnimationFrame(frame);\n      })();\n    "
  },
  {
    "src": "",
    "type": "",
    "id": "",
    "async": false,
    "defer": false,
    "content": "\n      (function(){\n        /* ── Gradient border shell: cursor-angle conic flashlight on all cards ── */\n        var cards = document.querySelectorAll('.studio-card, .proj-card, #testimonials .grid > div, #pricing .grid > div, #torus');\n        cards.forEach(function(card){ card.classList.add('flash-card'); });\n        window.addEventListener('pointermove', function(e){\n          cards.forEach(function(card){\n            var r = card.getBoundingClientRect();\n            var dx = e.clientX - (r.left + r.width / 2);\n            var dy = e.clientY - (r.top + r.height / 2);\n            var angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;\n            var dist = Math.hypot(dx, dy);\n            var edge = Math.hypot(r.width / 2, r.height / 2);\n            var proximity = Math.max(0, 1 - Math.abs(dist - edge) / 220);\n            card.style.setProperty('--cursor-angle', angle + 'deg');\n            card.style.setProperty('--proximity', proximity.toFixed(3));\n          });\n        });\n\n        /* ── Torus: stronger mouse attraction + elastic bounce back when too far ── */\n        window.addEventListener('mousemove', function(e){\n          var px = e.clientX / window.innerWidth - 0.5;\n          var py = e.clientY / window.innerHeight - 0.5;\n          var dist = Math.hypot(px, py);\n          if (dist < 0.33) {\n            gsap.to('#torus', { rotationY: px * 16, rotationX: -py * 16, x: px * 280, y: py * 200, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });\n          } else {\n            gsap.to('#torus', { rotationY: px * 8, rotationX: -py * 8, x: 0, y: 0, duration: 1.4, ease: 'elastic.out(1, 0.35)', overwrite: 'auto' });\n          }\n        });\n      })();\n    "
  },
  {
    "src": "",
    "type": "",
    "id": "",
    "async": false,
    "defer": false,
    "content": "\n      (function(){\n        var shells = document.querySelectorAll('.shell-card');\n        window.addEventListener('pointermove', function(e){\n          shells.forEach(function(card){\n            var r = card.getBoundingClientRect();\n            var dx = e.clientX - (r.left + r.width / 2);\n            var dy = e.clientY - (r.top + r.height / 2);\n            var angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;\n            var dist = Math.hypot(dx, dy);\n            var edge = Math.hypot(r.width / 2, r.height / 2);\n            var proximity = Math.max(0, 1 - Math.abs(dist - edge) / 220);\n            card.style.setProperty('--cursor-angle', angle + 'deg');\n            card.style.setProperty('--glow-opacity', proximity.toFixed(3));\n          });\n        });\n      })();\n    "
  }
];
const sourceHtmlId = "";
const sourceHtmlClassName = "scroll-smooth";
const sourceHtmlStyle = "";
const sourceBodyId = "";
const sourceBodyClassName = "bg-[#050a1c] text-slate-200 antialiased overflow-x-hidden selection:bg-orange-400/30";
const sourceBodyStyle = "";
const inlineEventAttributeNames = [
  "click",
  "change",
  "input",
  "submit",
  "mouseover",
  "mouseout",
  "mouseenter",
  "mouseleave",
  "keydown",
  "keyup",
  "focus",
  "blur"
];

function applyElementAttributes(element, attributes) {
  const previousId = element.id;
  const previousClassName = element.className;
  const previousStyleAttribute = element.getAttribute("style");

  if (attributes.id) {
    element.id = attributes.id;
  }
  attributes.className
    .split(/\s+/)
    .filter(Boolean)
    .forEach((className) => element.classList.add(className));
  if (attributes.style) {
    element.style.cssText = [element.style.cssText, attributes.style]
      .filter(Boolean)
      .join("; ");
  }

  return () => {
    element.id = previousId;
    element.className = previousClassName;
    if (previousStyleAttribute === null) {
      element.removeAttribute("style");
    } else {
      element.setAttribute("style", previousStyleAttribute);
    }
  };
}

function applySourceRootAttributes() {
  const restoreHtml = applyElementAttributes(document.documentElement, {
    id: sourceHtmlId,
    className: sourceHtmlClassName,
    style: sourceHtmlStyle,
  });
  const restoreBody = applyElementAttributes(document.body, {
    id: sourceBodyId,
    className: sourceBodyClassName,
    style: sourceBodyStyle,
  });

  return () => {
    restoreBody();
    restoreHtml();
  };
}

function attachInlineEventHandlers(root) {
  const cleanups = [];

  inlineEventAttributeNames.forEach((eventName) => {
    root
      .querySelectorAll(`[data-aura-on${eventName}]`)
      .forEach((element) => {
        const handlerCode = element.getAttribute(`data-aura-on${eventName}`);
        if (!handlerCode) return;

        const listener = function (event) {
          const result = Function("event", handlerCode).call(element, event);
          if (result === false) {
            event.preventDefault();
            event.stopPropagation();
          }
        };
        element.addEventListener(eventName, listener);
        cleanups.push(() => element.removeEventListener(eventName, listener));
      });
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

function appendSourceScript(scriptInfo) {
  const script = document.createElement("script");
  if (scriptInfo.id) script.id = scriptInfo.id;
  if (scriptInfo.type) script.type = scriptInfo.type;
  if (scriptInfo.async) script.async = true;
  if (scriptInfo.defer) script.defer = true;
  if (scriptInfo.src) {
    script.src = scriptInfo.src;
  } else if (scriptInfo.content) {
    script.textContent = scriptInfo.content;
  }
  document.body.appendChild(script);
  return script;
}

export default function App() {
  useLayoutEffect(() => applySourceRootAttributes(), []);

  useEffect(() => {
    const detachInlineEventHandlers = attachInlineEventHandlers(document);
    const appendedScripts = sourceScripts
      .filter((scriptInfo) => scriptInfo.src || scriptInfo.content)
      .map(appendSourceScript);

    return () => {
      detachInlineEventHandlers();
      appendedScripts.forEach((script) => script.remove());
    };
  }, []);

  return (
    <div className="aura-source-body bg-[#050a1c] text-slate-200 antialiased overflow-x-hidden selection:bg-orange-400/30">
      <div className="fixed inset-0 pointer-events-none z-0">
            <div id="bg-layer-1" className="absolute -inset-40 opacity-60">
              <div className="absolute top-[5%] left-[10%] w-[40rem] h-[40rem] rounded-full bg-blue-700/20 blur-[120px]"></div>
              <div className="absolute top-[40%] right-[5%] w-[30rem] h-[30rem] rounded-full bg-indigo-600/15 blur-[100px]"></div>
              <div className="absolute bottom-[10%] left-[20%] w-[35rem] h-[35rem] rounded-full bg-cyan-600/10 blur-[120px]"></div>
            </div>
            <div id="bg-layer-2" className="absolute -inset-20">
              <div className="absolute top-[20%] right-[25%] w-1 h-1 rounded-full bg-white/60"></div>
              <div className="absolute top-[35%] left-[15%] w-1 h-1 rounded-full bg-white/40"></div>
              <div className="absolute top-[60%] right-[10%] w-1.5 h-1.5 rounded-full bg-orange-300/50"></div>
              <div className="absolute top-[75%] left-[30%] w-1 h-1 rounded-full bg-white/50"></div>
              <div className="absolute top-[15%] left-[45%] w-1 h-1 rounded-full bg-cyan-300/50"></div>
              <div className="absolute top-[85%] right-[40%] w-1 h-1 rounded-full bg-white/40"></div>
            </div>
            <div id="bg-layer-3" className="absolute inset-0 opacity-[0.04]" style={{"backgroundImage": "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", "backgroundSize": "48px 48px"}}></div>
          </div>


          <header id="nav" className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[#050a1c]/40 border-b border-white/5">
            <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="hidden md:flex items-center gap-10 text-xs tracking-[0.25em] font-medium text-slate-400">
                <a href="#" className="nav-link relative hover:text-white transition-colors duration-300">
                  ABOUT
                </a>
                <a href="#work" className="nav-link relative hover:text-white transition-colors duration-300">
                  WORK
                </a>
              </div>
              <a href="#" className="group flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-orange-400/60 transition-all duration-500 hover:rotate-[360deg]">
                <span className="serif text-lg font-semibold text-white">N</span>
              </a>
              <div className="hidden md:flex items-center gap-10 text-xs tracking-[0.25em] font-medium text-slate-400">
                <a href="#" className="nav-link relative hover:text-white transition-colors duration-300">
                  SHOP
                </a>
                <a href="#contacts" className="nav-link relative hover:text-white transition-colors duration-300">
                  CONTACTS
                </a>
              </div>
              <button id="menu-btn" className="md:hidden text-slate-300">
                <i data-lucide="menu" className="w-5 h-5"></i>
              </button>
            </nav>
          </header>

          <main className="relative z-10">

            <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden">
              <canvas id="hero-gl" className="absolute inset-0 w-full h-full pointer-events-none"></canvas>
              <div id="hero-laser" className="absolute inset-y-0 left-1/2 pointer-events-none" aria-hidden="true">
                <div className="relative w-px h-full -translate-x-1/2">
                  <div className="laser-pulse absolute inset-y-0 -left-8 w-16 bg-cyan-500/10 blur-2xl"></div>
                  <div className="laser-pulse absolute inset-y-0 -left-1.5 w-3 bg-blue-400/30 blur-md"></div>
                  <div className="laser-pulse absolute inset-y-0 -left-px w-0.5 bg-gradient-to-b from-transparent via-cyan-300 to-transparent"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-200 blur-[2px] laser-pulse"></div>
                </div>

              </div>
              <div className="absolute top-1/3 left-6 md:left-12 hero-el flex items-center gap-3 text-xs tracking-[0.3em] text-slate-500">
                <span>01</span>
                <span className="w-8 h-px bg-slate-600"></span>
              </div>
              <div className="absolute top-1/3 right-6 md:right-12 hero-el flex items-center gap-3 text-xs tracking-[0.3em] text-slate-500">
                <span className="w-8 h-px bg-slate-600"></span>
                <i data-lucide="sparkles" className="w-4 h-4 text-orange-300/70"></i>
              </div>


              <div id="torus" className="relative w-64 h-64 md:w-80 md:h-80 mb-10 hero-el rounded-full">
                <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/e8434c85-a821-467d-8899-e9f0d5e32184_800w.webp" alt="Abstract generative 3D artwork" className="absolute inset-0 w-full h-full object-cover rounded-full shadow-2xl shadow-blue-950/60" />
                <div className="absolute -inset-6 rounded-full border border-white/5 animate-[spin_30s_linear_infinite]"></div>
              </div>

              <p className="hero-el text-xs tracking-[0.6em] text-orange-300/80 font-medium mb-4">
                I L L U S T R A T I O N
              </p>
              <h1 className="hero-el serif text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-white text-center px-4">
                NOAH VANCE
              </h1>
              <p className="hero-el mt-5 text-xs tracking-[0.5em] text-slate-400">
                G E N E R A T I V E &nbsp; D E S I G N
              </p>

              <div className="hero-el absolute bottom-10 flex flex-col items-center gap-2 text-slate-500">
                <span className="text-xs tracking-[0.3em]">SCROLL</span>
                <i data-lucide="chevron-down" className="w-4 h-4 animate-bounce"></i>
              </div>
            </section>


            <section id="cards" className="relative py-24 px-6">
              <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-5">

                <a href="#" className="studio-card shell-card group relative p-[1px] rounded-3xl bg-gradient-to-b from-neutral-800 to-transparent hover:-translate-y-2 transition-all duration-500">
                  <div className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300" style={{"background": "conic-gradient(from var(--cursor-angle, 0deg), rgba(253,186,116,.9), transparent 50deg, transparent 310deg, rgba(253,186,116,.9))", "opacity": "var(--glow-opacity, 0)"}}></div>
                  <div className="absolute inset-[-12px] rounded-[inherit] blur-[12px] pointer-events-none transition-opacity duration-300" style={{"background": "conic-gradient(from var(--cursor-angle, 0deg), rgba(253,186,116,.55), transparent 50deg, transparent 310deg, rgba(253,186,116,.55))", "opacity": "calc(var(--glow-opacity, 0) * .6)"}}></div>
                  <div className="relative z-10 h-full bg-[#0a1128] rounded-[inherit] p-8 flex flex-col items-center gap-6 overflow-hidden">
                    <i data-lucide="layers" className="w-4 h-4 text-slate-500 self-start group-hover:text-orange-300 transition-colors duration-300"></i>
                    <i data-lucide="box" className="w-12 h-12 text-slate-300 group-hover:text-white group-hover:scale-110 transition-all duration-500"></i>
                    <div className="text-center">
                      <p className="text-xs tracking-[0.3em] text-slate-300 font-medium">
                        ATELIER 89
                      </p>
                      <p className="text-xs tracking-[0.3em] text-orange-300/70 mt-2">
                        01
                      </p>
                    </div>
                  </div>
                </a>

                <a href="#" className="studio-card shell-card group relative p-[1px] rounded-3xl bg-gradient-to-b from-neutral-800 to-transparent hover:-translate-y-2 transition-all duration-500">
                  <div className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300" style={{"background": "conic-gradient(from var(--cursor-angle, 0deg), rgba(253,186,116,.9), transparent 50deg, transparent 310deg, rgba(253,186,116,.9))", "opacity": "var(--glow-opacity, 0)"}}></div>
                  <div className="absolute inset-[-12px] rounded-[inherit] blur-[12px] pointer-events-none transition-opacity duration-300" style={{"background": "conic-gradient(from var(--cursor-angle, 0deg), rgba(253,186,116,.55), transparent 50deg, transparent 310deg, rgba(253,186,116,.55))", "opacity": "calc(var(--glow-opacity, 0) * .6)"}}></div>
                  <div className="relative z-10 h-full bg-[#0a1128] rounded-[inherit] p-8 flex flex-col items-center gap-6 overflow-hidden">
                    <i data-lucide="layers" className="w-4 h-4 text-slate-500 self-start group-hover:text-orange-300 transition-colors duration-300"></i>
                    <i data-lucide="circle-dot" className="w-12 h-12 text-slate-300 group-hover:text-white group-hover:scale-110 transition-all duration-500"></i>
                    <div className="text-center">
                      <p className="text-xs tracking-[0.3em] text-slate-300 font-medium">
                        HALCYON
                      </p>
                      <p className="text-xs tracking-[0.3em] text-orange-300/70 mt-2">
                        02
                      </p>
                    </div>
                  </div>
                </a>

                <a href="#" className="studio-card shell-card group relative p-[1px] rounded-3xl bg-gradient-to-b from-neutral-800 to-transparent hover:-translate-y-2 transition-all duration-500 min-h-[16rem]">
                  <div className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300" style={{"background": "conic-gradient(from var(--cursor-angle, 0deg), rgba(253,186,116,.9), transparent 50deg, transparent 310deg, rgba(253,186,116,.9))", "opacity": "var(--glow-opacity, 0)"}}></div>
                  <div className="absolute inset-[-12px] rounded-[inherit] blur-[12px] pointer-events-none transition-opacity duration-300" style={{"background": "conic-gradient(from var(--cursor-angle, 0deg), rgba(253,186,116,.55), transparent 50deg, transparent 310deg, rgba(253,186,116,.55))", "opacity": "calc(var(--glow-opacity, 0) * .6)"}}></div>
                  <div className="relative z-10 h-full min-h-[16rem] bg-[#0a1128] rounded-[inherit] overflow-hidden">
                    <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/d2d942bb-1e76-4954-a84d-126a46f9f8bc_3840w.png" alt="Aurelia Vol.2 artwork" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050a1c]/90 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 inset-x-0 p-6 text-center">
                      <p className="text-xs tracking-[0.3em] text-white font-medium">
                        AURELIA
                        <span className="text-orange-200/80">VOL.2</span>
                      </p>
                      <p className="text-xs tracking-[0.3em] text-orange-300 mt-2 underline underline-offset-4 decoration-orange-300/40">
                        03
                      </p>
                    </div>
                  </div>
                </a>

                <a href="#" className="studio-card shell-card group relative p-[1px] rounded-3xl bg-gradient-to-b from-neutral-800 to-transparent hover:-translate-y-2 transition-all duration-500">
                  <div className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300" style={{"background": "conic-gradient(from var(--cursor-angle, 0deg), rgba(253,186,116,.9), transparent 50deg, transparent 310deg, rgba(253,186,116,.9))", "opacity": "var(--glow-opacity, 0)"}}></div>
                  <div className="absolute inset-[-12px] rounded-[inherit] blur-[12px] pointer-events-none transition-opacity duration-300" style={{"background": "conic-gradient(from var(--cursor-angle, 0deg), rgba(253,186,116,.55), transparent 50deg, transparent 310deg, rgba(253,186,116,.55))", "opacity": "calc(var(--glow-opacity, 0) * .6)"}}></div>
                  <div className="relative z-10 h-full bg-[#0a1128] rounded-[inherit] p-8 flex flex-col items-center gap-6 overflow-hidden">
                    <i data-lucide="layers" className="w-4 h-4 text-slate-500 self-start group-hover:text-orange-300 transition-colors duration-300"></i>
                    <i data-lucide="gem" className="w-12 h-12 text-slate-300 group-hover:text-white group-hover:scale-110 transition-all duration-500"></i>
                    <div className="text-center">
                      <p className="text-xs tracking-[0.3em] text-slate-300 font-medium">
                        PRISM 3.0
                      </p>
                      <p className="text-xs tracking-[0.3em] text-orange-300/70 mt-2">
                        04
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </section>


            <section id="work" className="relative">
              <div id="story-pin" className="min-h-screen py-24 px-6 flex items-center">
                <div className="max-w-5xl mx-auto w-full">
                  <div className="story-el flex items-center gap-3 text-xs tracking-[0.4em] text-slate-400 mb-10">
                    <i data-lucide="play" className="w-3.5 h-3.5 text-orange-300"></i>
                    PORTFOLIO
                  </div>


                  <div id="stage" className="story-el relative rounded-2xl overflow-hidden border border-white/10 aspect-[16/9] shadow-2xl shadow-blue-950/60">
                    <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0445b53a-3a64-4b48-9ccc-f6ec4ba4c061_3840w.png" alt="Limitless Form 3D render" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050a1c]/60 via-transparent to-transparent"></div>
                  </div>

                  <div className="mt-12 max-w-2xl">
                    <p className="story-el text-xs tracking-[0.4em] text-orange-300 font-medium mb-4">
                      N O A H &nbsp; V A N C E
                    </p>
                    <h2 className="story-el serif text-3xl md:text-5xl tracking-tight text-white font-medium">
                      Limitless Form: 3D Frontier
                    </h2>
                    <p className="story-el mt-6 text-base text-slate-400 leading-relaxed">
                      Every render begins as a question about light and geometry.
                      Through procedural systems and hand-tuned shaders, static
                      objects become living sculptures — spaces where colour breathes
                      and structure dissolves into pure sensation.
                    </p>
                    <a href="#" className="story-el group inline-flex items-center gap-3 mt-8 px-7 py-3 rounded-md border border-orange-300/40 text-xs tracking-[0.3em] text-orange-200 font-medium hover:bg-orange-300/10 hover:border-orange-300 transition-all duration-300">
                      READ MORE
                      <i data-lucide="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"></i>
                    </a>
                  </div>
                </div>
              </div>
            </section>


            <section id="odyssey" className="relative py-28 px-6">
              <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div id="odyssey-art" className="relative rounded-xl overflow-hidden border border-white/10 aspect-[4/5] shadow-2xl shadow-teal-950/50 group">
                  <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/39c68c9c-e0f9-4b45-ab2b-fa35a10c6fb0_3840w.png" alt="Echoes Without Horizon artwork" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050a1c]/60 via-transparent to-transparent"></div>
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs tracking-[0.6em] text-white/70">
                    2 &nbsp; 0 &nbsp; 2 &nbsp; 5
                  </p>
                </div>
                <div className="text-center md:text-left flex flex-col items-center md:items-start">
                  <div className="odyssey-el w-14 h-14 rounded-full border border-teal-300/40 bg-teal-400/10 mb-10"></div>
                  <h2 className="serif text-4xl md:text-5xl tracking-tight font-medium leading-tight">
                    <span className="odyssey-el block text-white">ECHOES</span>
                    <span className="odyssey-el block text-white">WITHOUT</span>
                    <span className="odyssey-el block text-teal-300 italic">HORIZON</span>
                  </h2>
                  <div className="odyssey-el mt-8 text-orange-300/70">
                    <i data-lucide="plus" className="w-4 h-4"></i>
                  </div>
                  <p className="odyssey-el mt-6 text-xs tracking-[0.4em] text-orange-200/80 font-medium">
                    P E R S O N A L &nbsp; P R O J E C T
                  </p>
                </div>
              </div>
            </section>


            <section id="cta" className="relative py-28 px-6">
              <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
                <div className="cta-el flex items-center gap-3 text-xs tracking-[0.4em] text-slate-400 mb-8">
                  <i data-lucide="mic" className="w-3.5 h-3.5 text-orange-300"></i>
                  LIVE EVENTS
                </div>
                <h2 className="cta-el serif text-3xl md:text-5xl tracking-tight text-white font-medium">
                  Planning a keynote or festival?
                </h2>
                <a href="#" id="magnetic-btn" className="cta-el group relative inline-flex items-center gap-3 mt-10 px-8 py-4 rounded-md border border-orange-300/40 text-xs tracking-[0.3em] text-orange-200 font-medium overflow-hidden transition-colors duration-300 hover:text-[#050a1c]">
                  <span className="absolute inset-0 bg-orange-300 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>
                  <span className="relative">GET IN TOUCH</span>
                  <i data-lucide="arrow-right" className="relative w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"></i>
                </a>
              </div>
            </section>


            <section id="projects" className="relative py-20 px-6">
              <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
                <a href="#" className="proj-card group relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3] md:row-span-2 md:aspect-auto">
                  <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/ec2d68af-b559-4707-9536-77db623a2d41_1600w.png" alt="RYO project artwork" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050a1c]/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 inset-x-6">
                    <div className="flex items-center justify-between rounded-md bg-white text-[#050a1c] px-6 py-4 group-hover:bg-orange-200 transition-colors duration-300">
                      <span className="text-xs tracking-[0.3em] font-semibold">
                        RYO PROJECT
                      </span>
                      <i data-lucide="arrow-up-right" className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300"></i>
                    </div>
                  </div>
                </a>
                <a href="#" className="proj-card group relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3]">
                  <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/6ba18bed-615c-41ef-a531-9cc5b5ae6eaa_3840w.png" alt="Reverie artwork" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050a1c]/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-5 inset-x-6 flex items-center justify-between text-xs tracking-[0.3em] text-slate-200 font-medium">
                    <span>REVERIE</span>
                    <i data-lucide="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"></i>
                  </div>
                </a>
                <a href="#" className="proj-card group relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3]">
                  <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/6219bae5-4ae9-453c-bcc1-aadf2822d641_3840w.png" alt="Drift artwork" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050a1c]/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-5 inset-x-6 flex items-center justify-between text-xs tracking-[0.3em] text-slate-200 font-medium">
                    <span>DRIFT</span>
                    <i data-lucide="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"></i>
                  </div>
                </a>
                <a href="#" className="proj-card group relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3]">
                  <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/ac120bb1-abb8-49cc-9aba-f7c9f1851817_3840w.png" alt="Nocturne artwork" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050a1c]/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-5 inset-x-6 flex items-center justify-between text-xs tracking-[0.3em] text-slate-200 font-medium">
                    <span>NOCTURNE</span>
                    <i data-lucide="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"></i>
                  </div>
                </a>
                <a href="#" className="proj-card group relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3]">
                  <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/702314ac-9eab-48a0-974b-328f06e6d7a8_3840w.png" alt="Lumen artwork" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050a1c]/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-5 inset-x-6 flex items-center justify-between text-xs tracking-[0.3em] text-slate-200 font-medium">
                    <span>LUMEN</span>
                    <i data-lucide="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"></i>
                  </div>
                </a>
              </div>
            </section>
            <section id="testimonials" className="relative py-24 px-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 text-xs tracking-[0.4em] text-slate-400 mb-6">
                  <i data-lucide="quote" className="w-3.5 h-3.5 text-orange-300"></i>
                  TESTIMONIALS
                </div>
                <h2 className="serif text-3xl md:text-5xl tracking-tight text-white font-medium mb-14">
                  Kind words, real projects
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 flex flex-col gap-6 hover:border-orange-300/30 transition-colors duration-300">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      “Noah translated an impossible brief into a visual language our
                      whole team rallied behind. The renders stopped people
                      mid-scroll.”
                    </p>
                    <div className="mt-auto flex items-center gap-4">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&amp;w=200&amp;auto=format&amp;fit=crop" alt="Mara Ellison" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm text-white font-medium">Mara Ellison</p>
                        <p className="text-xs tracking-[0.2em] text-slate-500">
                          CD, STUDIO NORD
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 flex flex-col gap-6 hover:border-orange-300/30 transition-colors duration-300">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      “Rare mix of technical depth and taste. Every delivery arrived
                      early, and every frame felt considered down to the pixel.”
                    </p>
                    <div className="mt-auto flex items-center gap-4">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&amp;w=200&amp;auto=format&amp;fit=crop" alt="Devon Iyer" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm text-white font-medium">Devon Iyer</p>
                        <p className="text-xs tracking-[0.2em] text-slate-500">
                          FOUNDER, HALCYON
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 flex flex-col gap-6 hover:border-orange-300/30 transition-colors duration-300">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      “Our keynote visuals became the most shared moment of the
                      conference. Working with Noah felt effortless from day one.”
                    </p>
                    <div className="mt-auto flex items-center gap-4">
                      <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&amp;w=200&amp;auto=format&amp;fit=crop" alt="Lena Kovac" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm text-white font-medium">Lena Kovac</p>
                        <p className="text-xs tracking-[0.2em] text-slate-500">
                          EVENTS, PRISM CO
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section id="pricing" className="relative py-24 px-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 text-xs tracking-[0.4em] text-slate-400 mb-6">
                  <i data-lucide="tag" className="w-3.5 h-3.5 text-orange-300"></i>
                  PRICING
                </div>
                <h2 className="serif text-3xl md:text-5xl tracking-tight text-white font-medium mb-14">
                  Simple, transparent engagements
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 flex flex-col">
                    <p className="text-xs tracking-[0.3em] text-slate-400 font-medium">
                      SINGLE PIECE
                    </p>
                    <p className="serif text-4xl tracking-tight text-white font-medium mt-4">
                      $1,800
                    </p>
                    <p className="text-xs text-slate-500 mt-1">per artwork</p>
                    <ul className="mt-8 space-y-3 text-sm text-slate-300">
                      <li className="flex items-center gap-3">
                        <i data-lucide="check" className="w-4 h-4 text-orange-300"></i>
                        One hero render
                      </li>
                      <li className="flex items-center gap-3">
                        <i data-lucide="check" className="w-4 h-4 text-orange-300"></i>
                        Two revision rounds
                      </li>
                      <li className="flex items-center gap-3">
                        <i data-lucide="check" className="w-4 h-4 text-orange-300"></i>
                        4K delivery
                      </li>
                    </ul>
                    <a href="#contact" className="mt-10 inline-flex items-center justify-center px-6 py-3 rounded-md border border-white/15 text-xs tracking-[0.3em] text-slate-200 font-medium hover:border-orange-300/60 hover:text-orange-200 transition-all duration-300">
                      START
                    </a>
                  </div>
                  <div className="relative rounded-xl border border-orange-300/40 bg-white/[0.05] p-8 flex flex-col">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-orange-300 text-[#050a1c] text-[10px] tracking-[0.25em] font-semibold">
                      POPULAR
                    </span>
                    <p className="text-xs tracking-[0.3em] text-orange-200 font-medium">
                      SERIES
                    </p>
                    <p className="serif text-4xl tracking-tight text-white font-medium mt-4">
                      $4,500
                    </p>
                    <p className="text-xs text-slate-500 mt-1">per collection</p>
                    <ul className="mt-8 space-y-3 text-sm text-slate-300">
                      <li className="flex items-center gap-3">
                        <i data-lucide="check" className="w-4 h-4 text-orange-300"></i>
                        Five cohesive artworks
                      </li>
                      <li className="flex items-center gap-3">
                        <i data-lucide="check" className="w-4 h-4 text-orange-300"></i>
                        Art direction included
                      </li>
                      <li className="flex items-center gap-3">
                        <i data-lucide="check" className="w-4 h-4 text-orange-300"></i>
                        Motion loops
                      </li>
                      <li className="flex items-center gap-3">
                        <i data-lucide="check" className="w-4 h-4 text-orange-300"></i>
                        Unlimited revisions
                      </li>
                    </ul>
                    <a href="#contact" className="mt-10 inline-flex items-center justify-center px-6 py-3 rounded-md bg-orange-300 text-[#050a1c] text-xs tracking-[0.3em] font-semibold hover:bg-orange-200 transition-colors duration-300">
                      START
                    </a>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 flex flex-col">
                    <p className="text-xs tracking-[0.3em] text-slate-400 font-medium">
                      RETAINER
                    </p>
                    <p className="serif text-4xl tracking-tight text-white font-medium mt-4">
                      $8,000
                    </p>
                    <p className="text-xs text-slate-500 mt-1">per month</p>
                    <ul className="mt-8 space-y-3 text-sm text-slate-300">
                      <li className="flex items-center gap-3">
                        <i data-lucide="check" className="w-4 h-4 text-orange-300"></i>
                        Ongoing visual system
                      </li>
                      <li className="flex items-center gap-3">
                        <i data-lucide="check" className="w-4 h-4 text-orange-300"></i>
                        Weekly deliveries
                      </li>
                      <li className="flex items-center gap-3">
                        <i data-lucide="check" className="w-4 h-4 text-orange-300"></i>
                        Priority support
                      </li>
                    </ul>
                    <a href="#contact" className="mt-10 inline-flex items-center justify-center px-6 py-3 rounded-md border border-white/15 text-xs tracking-[0.3em] text-slate-200 font-medium hover:border-orange-300/60 hover:text-orange-200 transition-all duration-300">
                      START
                    </a>
                  </div>
                </div>
              </div>
            </section>
            <section id="contact" className="relative py-24 px-6">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-3 text-xs tracking-[0.4em] text-slate-400 mb-6">
                  <i data-lucide="mail" className="w-3.5 h-3.5 text-orange-300"></i>
                  CONTACT
                </div>
                <h2 className="serif text-3xl md:text-5xl tracking-tight text-white font-medium text-center mb-14">
                  Tell me about your project
                </h2>
                <form className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <input type="text" placeholder="Name" className="w-full rounded-md bg-white/[0.04] border border-white/10 px-5 py-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-300/50 transition-colors duration-300" />
                    <input type="email" placeholder="Email" className="w-full rounded-md bg-white/[0.04] border border-white/10 px-5 py-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-300/50 transition-colors duration-300" />
                  </div>
                  <textarea rows="5" placeholder="Project details" className="w-full rounded-md bg-white/[0.04] border border-white/10 px-5 py-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-300/50 transition-colors duration-300 resize-none"></textarea>
                  <div className="flex justify-center">
                    <button type="submit" className="group inline-flex items-center gap-3 px-8 py-4 rounded-md border border-orange-300/40 text-xs tracking-[0.3em] text-orange-200 font-medium hover:bg-orange-300/10 hover:border-orange-300 transition-all duration-300">
                      SEND MESSAGE
                      <i data-lucide="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"></i>
                    </button>
                  </div>
                </form>
              </div>
            </section>


            <footer id="contacts" className="relative border-t border-white/5 py-16 px-6 mt-12">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="footer-el flex items-center gap-4">
                  <a href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-orange-300/50 hover:-translate-y-1 transition-all duration-300">
                    <i data-lucide="dribbble" className="w-4 h-4"></i>
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-orange-300/50 hover:-translate-y-1 transition-all duration-300">
                    <i data-lucide="instagram" className="w-4 h-4"></i>
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-orange-300/50 hover:-translate-y-1 transition-all duration-300">
                    <i data-lucide="twitter" className="w-4 h-4"></i>
                  </a>
                </div>
                <div className="footer-el serif text-4xl font-semibold text-white tracking-tight">
                  N
                  <span className="text-orange-300">.</span>
                </div>
                <div className="footer-el flex flex-col items-center md:items-end gap-4">
                  <nav className="serif flex items-center gap-8 text-lg text-slate-200">
                    <a href="#" className="hover:text-orange-300 transition-colors duration-300">
                      About
                    </a>
                    <a href="#work" className="hover:text-orange-300 transition-colors duration-300">
                      Work
                    </a>
                    <a href="#" className="hover:text-orange-300 transition-colors duration-300">
                      Shop
                    </a>
                    <a href="#contacts" className="hover:text-orange-300 transition-colors duration-300">
                      Contacts
                    </a>
                  </nav>
                  <p className="text-xs tracking-[0.2em] text-slate-500">
                    © 2025 &nbsp;·&nbsp; NOAH VANCE &nbsp;·&nbsp; ALL RIGHTS RESERVED
                  </p>
                </div>
              </div>
            </footer>
          </main>
    </div>
  );
}
