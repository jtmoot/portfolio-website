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
    "src": "https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js",
    "type": "",
    "id": "",
    "async": false,
    "defer": false,
    "content": ""
  },
  {
    "src": "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",
    "type": "",
    "id": "",
    "async": false,
    "defer": false,
    "content": ""
  },
  {
    "src": "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js",
    "type": "",
    "id": "",
    "async": false,
    "defer": false,
    "content": ""
  },
  {
    "src": "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
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
    "content": "\n          (function() {\n              // Render Lucide Icons\n              if (typeof lucide !== 'undefined') {\n                  lucide.createIcons();\n              }\n\n              // WebGL Fabric Simulation Context\n              const initTextileEngineWebGL = () => {\n                  const container = document.getElementById('te-webgl-container');\n                  if (!container || typeof THREE === 'undefined') return;\n\n                  const scene = new THREE.Scene();\n                  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);\n                  camera.position.z = 5.5;\n                  camera.position.y = -0.5;\n\n                  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });\n                  renderer.setSize(container.clientWidth, container.clientHeight);\n                  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));\n                  container.appendChild(renderer.domElement);\n\n                  // Elegant Lighting Setup matching Nexus theme\n                  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);\n                  scene.add(ambientLight);\n\n                  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);\n                  dirLight.position.set(2, 4, 3);\n                  scene.add(dirLight);\n\n                  const backLight = new THREE.DirectionalLight(0x22d3ee, 2.0); // Cyan Accent Rim Light\n                  backLight.position.set(-3, 2, -2);\n                  scene.add(backLight);\n\n                  const fillLight = new THREE.DirectionalLight(0x3b82f6, 0.6); // Blue fill\n                  fillLight.position.set(0, -2, 2);\n                  scene.add(fillLight);\n\n                  // Parametric Fabric Geometry\n                  const geometry = new THREE.PlaneGeometry(7, 9, 64, 64);\n\n                  // Dark Material with Cyan/Blue Spectral Highlights\n                  const material = new THREE.MeshStandardMaterial({\n                      color: 0x0a0a0c,\n                      roughness: 0.3,\n                      metalness: 0.9,\n                      side: THREE.DoubleSide,\n                      wireframe: false\n                  });\n\n                  const plane = new THREE.Mesh(geometry, material);\n                  plane.rotation.x = -Math.PI / 10;\n                  scene.add(plane);\n\n                  const clock = new THREE.Clock();\n                  const positionAttribute = geometry.attributes.position;\n                  const vertex = new THREE.Vector3();\n\n                  // Fluid Simulation Animation Loop\n                  function animate() {\n                      requestAnimationFrame(animate);\n                      const time = clock.getElapsedTime();\n\n                      for (let i = 0; i < positionAttribute.count; i++) {\n                          vertex.fromBufferAttribute(positionAttribute, i);\n\n                          // Combined sine waves for organic cloth motion\n                          const wave1 = Math.sin(vertex.x * 1.5 + time * 0.4) * 0.25;\n                          const wave2 = Math.cos(vertex.y * 1.2 + time * 0.3) * 0.15;\n                          const wave3 = Math.sin((vertex.x + vertex.y) * 0.8 + time * 0.2) * 0.1;\n\n                          // Gravitational dampening (pinned top)\n                          const dampening = Math.max(0, (vertex.y + 4.5) / 9);\n\n                          vertex.z = (wave1 + wave2 + wave3) * dampening;\n                          positionAttribute.setZ(i, vertex.z);\n                      }\n\n                      geometry.computeVertexNormals();\n                      positionAttribute.needsUpdate = true;\n\n                      renderer.render(scene, camera);\n                  }\n\n                  animate();\n\n                  // Resize handler\n                  window.addEventListener('resize', () => {\n                      if (!container) return;\n                      camera.aspect = container.clientWidth / container.clientHeight;\n                      camera.updateProjectionMatrix();\n                      renderer.setSize(container.clientWidth, container.clientHeight);\n                  });\n              };\n\n              // Scroll-Triggered Sequence\n              const initTextileEngineAnimation = () => {\n                  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;\n\n                  const tl = gsap.timeline({\n                      scrollTrigger: {\n                          trigger: \"#textile-engine\",\n                          start: \"top 65%\",\n                      },\n                      defaults: { ease: \"power3.out\" }\n                  });\n\n                  // Header Reveal\n                  tl.fromTo(\".gs-te-header\",\n                      { opacity: 0, y: 30 },\n                      { opacity: 1, y: 0, duration: 1 }\n                  )\n                  // Device Scale Up\n                  .to(\"#te-device\",\n                      { opacity: 1, scale: 1, duration: 1.2, ease: \"expo.out\" },\n                      \"-=0.6\"\n                  )\n                  // Interface Corners\n                  .to(\".gs-te-corner\",\n                      { opacity: 1, duration: 0.2, stagger: 0.1 },\n                      \"-=0.4\"\n                  )\n                  // Sidebar Setup\n                  .fromTo(\".gs-te-sidebar-item\",\n                      { opacity: 0, x: -20 },\n                      { opacity: 1, x: 0, duration: 0.8, stagger: 0.1 },\n                      \"-=0.2\"\n                  )\n                  .fromTo(\".gs-te-list-item\",\n                      { opacity: 0, x: -15, scale: 0.95 },\n                      { opacity: 1, x: 0, scale: 1, duration: 0.5, stagger: 0.05 },\n                      \"-=0.4\"\n                  )\n                  // Toolbars & Dock\n                  .fromTo(\".gs-te-tool\",\n                      { opacity: 0, y: -10 },\n                      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },\n                      \"-=0.2\"\n                  )\n                  .fromTo(\".gs-te-bottom\",\n                      { opacity: 0, y: 30 },\n                      { opacity: 1, y: 0, duration: 0.8, ease: \"back.out(1.2)\" },\n                      \"-=0.4\"\n                  )\n                  // WebGL Fabric Fade In\n                  .to(\"#te-webgl-container\",\n                      { opacity: 1, duration: 2, ease: \"power2.inOut\" },\n                      \"-=0.5\"\n                  );\n\n                  // Continuous CTA Pulse - Updated to cyan\n                  gsap.fromTo(\".gs-te-cta\",\n                      { boxShadow: \"0 0 0px rgba(34,211,238,0)\" },\n                      { boxShadow: \"0 0 20px rgba(34,211,238,0.3)\", duration: 1.5, repeat: -1, yoyo: true, ease: \"sine.inOut\" }\n                  );\n              };\n\n              // Execute post-load\n              if (document.readyState === 'complete') {\n                  initTextileEngineWebGL();\n                  initTextileEngineAnimation();\n              } else {\n                  window.addEventListener('load', () => {\n                      initTextileEngineWebGL();\n                      initTextileEngineAnimation();\n                  });\n              }\n          })();\n        "
  },
  {
    "src": "",
    "type": "",
    "id": "",
    "async": false,
    "defer": false,
    "content": "\n    (function() {\n      const initScroll = () => {\n        const section = document.getElementById('hScrollSection-emq');\n        const track = document.getElementById('track-emq');\n        if (!section || !track) return;\n        \n        const updateScroll = () => {\n          const rect = section.getBoundingClientRect();\n          const sectionTop = rect.top;\n          const sectionHeight = rect.height;\n          const windowHeight = window.innerHeight;\n          \n          if (sectionTop <= 0 && sectionTop >= -(sectionHeight - windowHeight)) {\n            const scrollableDistance = sectionHeight - windowHeight;\n            let progress = -sectionTop / scrollableDistance;\n            progress = Math.max(0, Math.min(1, progress));\n            \n            const paddingRight = window.innerWidth > 768 ? 96 : 48;\n            const maxTranslate = track.scrollWidth - window.innerWidth + paddingRight;\n            \n            track.style.transform = `translate3d(-${progress * maxTranslate}px, 0, 0)`;\n          } else if (sectionTop > 0) {\n            track.style.transform = `translate3d(0px, 0, 0)`;\n          } else {\n            const paddingRight = window.innerWidth > 768 ? 96 : 48;\n            const maxTranslate = track.scrollWidth - window.innerWidth + paddingRight;\n            track.style.transform = `translate3d(-${maxTranslate}px, 0, 0)`;\n          }\n        };\n        \n        window.addEventListener('scroll', updateScroll, { passive: true });\n        window.addEventListener('resize', updateScroll, { passive: true });\n        updateScroll();\n      };\n      \n      if (document.readyState === 'complete' || document.readyState === 'interactive') {\n        initScroll();\n      } else {\n        window.addEventListener('DOMContentLoaded', initScroll);\n      }\n    })();\n  "
  },
  {
    "src": "",
    "type": "",
    "id": "",
    "async": false,
    "defer": false,
    "content": "\n          if (typeof lucide !== 'undefined') {\n            lucide.createIcons();\n          } else {\n            window.addEventListener('DOMContentLoaded', () => {\n              if (typeof lucide !== 'undefined') lucide.createIcons();\n            });\n          }\n        "
  },
  {
    "src": "",
    "type": "",
    "id": "",
    "async": false,
    "defer": false,
    "content": "\n        (function() {\n            // Initialize Three.js WebGL scene specific to this section\n            const initNodeWebGL = () => {\n                const container = document.getElementById('node-canvas-container');\n                if(!container || typeof THREE === 'undefined') return;\n\n                const scene = new THREE.Scene();\n                const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);\n                camera.position.z = 4.5;\n\n                const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });\n                renderer.setSize(container.clientWidth, container.clientHeight);\n                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));\n                container.appendChild(renderer.domElement);\n\n                const geometry = new THREE.IcosahedronGeometry(1.2, 1);\n\n                // Brutalist Dark PBR Material\n                const material = new THREE.MeshStandardMaterial({\n                    color: 0x111111,\n                    metalness: 0.9,\n                    roughness: 0.2,\n                    flatShading: true,\n                    emissive: 0x1a0500\n                });\n\n                const mesh = new THREE.Mesh(geometry, material);\n                scene.add(mesh);\n\n                // Lighting setup optimized for dark theme with orange accent\n                const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);\n                scene.add(ambientLight);\n\n                const dirLight1 = new THREE.DirectionalLight(0xff5a00, 2.5);\n                dirLight1.position.set(5, 5, 2);\n                scene.add(dirLight1);\n\n                const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.0);\n                dirLight2.position.set(-5, -5, 5);\n                scene.add(dirLight2);\n\n                const clock = new THREE.Clock();\n\n                const animateWebGL = () => {\n                    requestAnimationFrame(animateWebGL);\n                    const elapsedTime = clock.getElapsedTime();\n                    mesh.rotation.y = elapsedTime * 0.2;\n                    mesh.rotation.x = Math.sin(elapsedTime * 0.5) * 0.2;\n                    mesh.position.y = Math.sin(elapsedTime * 1.5) * 0.15;\n                    renderer.render(scene, camera);\n                };\n\n                animateWebGL();\n\n                // Hover interactions if GSAP is available\n                if(typeof gsap !== 'undefined') {\n                    container.addEventListener('mouseenter', () => {\n                        gsap.to(mesh.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.6, ease: \"back.out(1.5)\" });\n                        gsap.to(material.emissive, { r: 255/255*0.4, g: 90/255*0.4, b: 0, duration: 0.4 });\n                        gsap.to(dirLight1, { intensity: 4.0, duration: 0.4 });\n                    });\n\n                    container.addEventListener('mouseleave', () => {\n                        gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.6, ease: \"power2.out\" });\n                        gsap.to(material.emissive, { r: 26/255, g: 5/255, b: 0, duration: 0.4 });\n                        gsap.to(dirLight1, { intensity: 2.5, duration: 0.4 });\n                    });\n                }\n\n                window.addEventListener('resize', () => {\n                    if(!container) return;\n                    camera.aspect = container.clientWidth / container.clientHeight;\n                    camera.updateProjectionMatrix();\n                    renderer.setSize(container.clientWidth, container.clientHeight);\n                });\n            };\n\n            // Scroll animation for the WebGL container\n            const initNodeAnimation = () => {\n                if(typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;\n\n                gsap.to(\".node-webgl-container\", {\n                    scrollTrigger: {\n                        trigger: \"#node-protocol\",\n                        start: \"top 60%\"\n                    },\n                    opacity: 1,\n                    duration: 2,\n                    ease: \"power2.out\"\n                });\n            };\n\n            // Run setup\n            if (document.readyState === 'complete') {\n                initNodeWebGL();\n                initNodeAnimation();\n            } else {\n                window.addEventListener('load', () => {\n                    initNodeWebGL();\n                    initNodeAnimation();\n                });\n            }\n        })();\n      "
  },
  {
    "src": "",
    "type": "",
    "id": "",
    "async": false,
    "defer": false,
    "content": "\n      const initWebGL = () => {\n          const canvas = document.getElementById('webgl-canvas');\n          if(!canvas) return;\n\n          const scene = new THREE.Scene();\n          const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);\n          const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });\n\n          renderer.setSize(window.innerWidth, window.innerHeight);\n          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));\n\n          const geometry = new THREE.PlaneGeometry(2, 2);\n          const material = new THREE.ShaderMaterial({\n              uniforms: {\n                  uTime: { value: 0 },\n                  uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }\n              },\n              vertexShader: `\n                  varying vec2 vUv;\n                  void main() {\n                      vUv = uv;\n                      gl_Position = vec4(position, 1.0);\n                  }\n              `,\n              fragmentShader: `\n                  uniform float uTime;\n                  uniform vec2 uResolution;\n                  varying vec2 vUv;\n\n                  float random (in vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }\n\n                  float noise (in vec2 st) {\n                      vec2 i = floor(st); vec2 f = fract(st);\n                      float a = random(i); float b = random(i + vec2(1.0, 0.0));\n                      float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));\n                      vec2 u = f * f * (3.0 - 2.0 * f);\n                      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;\n                  }\n\n                  void main() {\n                      vec2 st = gl_FragCoord.xy / uResolution.xy;\n                      st.x *= uResolution.x / uResolution.y;\n\n                      float n = noise(st * 3.0 + uTime * 0.05);\n                      n += noise(st * 6.0 - uTime * 0.08) * 0.5;\n\n                      vec3 colorBase = vec3(0.94, 0.93, 0.91);\n                      vec3 colorDark = vec3(0.90, 0.88, 0.85);\n                      vec3 colorAccent = vec3(1.0, 0.4, 0.0);\n\n                      vec3 finalColor = mix(colorBase, colorDark, n);\n                      finalColor = mix(finalColor, colorAccent, smoothstep(0.8, 1.0, n) * 0.03);\n\n                      float grain = random(st * uTime) * 0.03;\n\n                      gl_FragColor = vec4(finalColor - grain, 1.0);\n                  }\n              `,\n              transparent: true\n          });\n\n          const mesh = new THREE.Mesh(geometry, material);\n          scene.add(mesh);\n\n          let time = 0;\n          const animate = () => {\n              requestAnimationFrame(animate);\n              time += 0.01;\n              material.uniforms.uTime.value = time;\n              renderer.render(scene, camera);\n          };\n\n          animate();\n\n          window.addEventListener('resize', () => {\n              renderer.setSize(window.innerWidth, window.innerHeight);\n              material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);\n          });\n      };\n\n      const initAnimation = () => {\n          gsap.registerPlugin(ScrollTrigger);\n\n          const masterTl = gsap.timeline({ defaults: { ease: \"power3.out\" } });\n\n          masterTl.to('#webgl-canvas', { opacity: 1, duration: 2 }, 0);\n\n          masterTl.fromTo('.nav-elem',\n              { y: -20, opacity: 0 },\n              { y: 0, opacity: 1, stagger: 0.1, duration: 1 },\n              0.2\n          );\n\n          masterTl.fromTo('.hero-image-container',\n              { scale: 0.9, opacity: 0, filter: 'blur(10px)' },\n              { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.8, ease: \"expo.out\" },\n              0.5\n          );\n\n          masterTl.to('.hero-text-line',\n              { y: \"0%\", duration: 1.2, stagger: 0.15, ease: \"power4.out\" },\n              0.8\n          );\n\n          masterTl.to('.hero-dash',\n              { scaleX: 1, duration: 1.2, stagger: 0.2, ease: \"expo.out\" },\n              1.0\n          );\n\n          masterTl.to('.hero-fade-up',\n              { y: \"0%\", duration: 1, stagger: 0.1, ease: \"power2.out\" },\n              1.3\n          );\n\n          masterTl.fromTo('.hero-accent',\n              { scale: 0, rotation: -45 },\n              { scale: 1, rotation: 0, duration: 1, stagger: 0.2, ease: \"back.out(2)\" },\n              1.5\n          );\n\n          masterTl.fromTo('.hero-stats',\n              { y: 30, opacity: 0 },\n              { y: 0, opacity: 1, duration: 1 },\n              1.8\n          );\n\n          gsap.utils.toArray('.gs-reveal').forEach(elem => {\n              gsap.fromTo(elem,\n                  { y: 40, opacity: 0 },\n                  {\n                      scrollTrigger: { trigger: elem, start: \"top 85%\" },\n                      y: 0, opacity: 1, duration: 1, ease: \"power3.out\"\n                  }\n              );\n          });\n\n          gsap.utils.toArray('.gs-img-scale').forEach(elem => {\n              const img = elem.querySelector('img');\n              gsap.fromTo(elem,\n                  { y: 50, opacity: 0 },\n                  {\n                      scrollTrigger: { trigger: elem, start: \"top 80%\" },\n                      y: 0, opacity: 1, duration: 1.2, ease: \"power2.out\"\n                  }\n              );\n              gsap.fromTo(img,\n                  { scale: 1.1 },\n                  {\n                      scrollTrigger: { trigger: elem, start: \"top 80%\", scrub: 1 },\n                      scale: 1, ease: \"none\"\n                  }\n              );\n          });\n\n          gsap.fromTo('.gs-list-item',\n              { x: 50, opacity: 0 },\n              {\n                  scrollTrigger: { trigger: '.gs-list-item', start: \"top 80%\" },\n                  x: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: \"power3.out\"\n              }\n          );\n      };\n\n      window.addEventListener('DOMContentLoaded', () => {\n          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;\n\n          try {\n              if (!prefersReducedMotion) {\n                  initWebGL();\n                  initAnimation();\n              } else {\n                  gsap.set('.hero-image-container, .hero-stats, #webgl-canvas', { opacity: 1, scale: 1, filter: 'blur(0)' });\n                  gsap.set('.hero-text-line, .hero-fade-up', { y: \"0%\" });\n                  gsap.set('.hero-dash', { scaleX: 1 });\n                  gsap.set('.hero-accent', { scale: 1 });\n              }\n          } catch(e) {\n              console.error(\"Animation Init Failed:\", e);\n              document.querySelectorAll('.opacity-0').forEach(el => el.classList.remove('opacity-0'));\n          }\n      });\n    "
  },
  {
    "src": "",
    "type": "",
    "id": "",
    "async": false,
    "defer": false,
    "content": "\n      document.addEventListener(\"DOMContentLoaded\", () => {\n          if (typeof gsap === \"undefined\" || typeof ScrollTrigger === \"undefined\") return;\n\n          const stickyContainer = document.getElementById('sticky-scene-container');\n          if (stickyContainer) {\n              const tl = gsap.timeline({\n                  scrollTrigger: {\n                      trigger: stickyContainer,\n                      start: \"top top\",\n                      end: \"bottom bottom\",\n                      scrub: 1.2\n                  }\n              });\n\n              // Immersive cinematic transitions & progressive reveals\n              tl.to('#curtainL', { xPercent: -100, ease: 'power2.inOut' }, 0)\n                .to('#curtainR', { xPercent: 100, ease: 'power2.inOut' }, 0)\n                .to('#hero', { opacity: 0, scale: 0.95, ease: 'power2.inOut' }, 0)\n                .to('#portal', { scale: 5, opacity: 0, ease: 'power3.in' }, 0.1)\n\n                // Parallax background\n                .fromTo('#world',\n                    { scale: 1.25, yPercent: 5 },\n                    { scale: 1, yPercent: -5, ease: 'none' },\n                    0\n                )\n\n                // UI scroll-synced hiding\n                .to('#nav', { opacity: 0, y: -20, ease: 'power1.inOut' }, 0);\n\n              // Sticky product storytelling (CTA Node Reveal)\n              gsap.set('#cta', { opacity: 0, y: 50, pointerEvents: 'none' });\n              tl.to('#cta', { opacity: 1, y: 0, pointerEvents: 'auto', ease: 'power3.out' }, 0.4)\n                .to('#cta', { opacity: 0, y: -50, pointerEvents: 'none', ease: 'power3.in' }, 0.8);\n          }\n      });\n    "
  },
  {
    "src": "",
    "type": "",
    "id": "",
    "async": false,
    "defer": false,
    "content": "\n(function () {\n  function playVideo(video) {\n    var promise = video.play();\n    if (promise && typeof promise.catch === \"function\") {\n      promise.catch(function () {});\n    }\n  }\n\n  function setupVideo(video) {\n    if (video.__auraVideoReady === true) return;\n    video.__auraVideoReady = true;\n    video.removeAttribute(\"data-aura-video-ready\");\n    video.removeAttribute(\"data-aura-video-played\");\n    video.muted = true;\n    video.playsInline = true;\n\n    var preset = video.dataset.auraVideoPreset || \"loop-in-view\";\n    if (preset === \"hover\") {\n      video.addEventListener(\"mouseenter\", function () {\n        playVideo(video);\n      });\n      video.addEventListener(\"mouseleave\", function () {\n        video.pause();\n        video.currentTime = 0;\n      });\n      return;\n    }\n\n    if (!(\"IntersectionObserver\" in window)) {\n      playVideo(video);\n      return;\n    }\n\n    var observer = new IntersectionObserver(function (entries) {\n      entries.forEach(function (entry) {\n        if (entry.isIntersecting) {\n          if (preset === \"play-once\" && video.__auraVideoPlayed === true) {\n            return;\n          }\n          playVideo(video);\n        } else {\n          video.pause();\n        }\n      });\n    }, { threshold: 0.35 });\n\n    if (preset === \"play-once\") {\n      video.addEventListener(\"ended\", function () {\n        video.__auraVideoPlayed = true;\n      }, { once: true });\n    }\n\n    observer.observe(video);\n  }\n\n  function setupVideos() {\n    document\n      .querySelectorAll(\"video[data-aura-video-preset]\")\n      .forEach(setupVideo);\n  }\n\n  if (document.readyState === \"loading\") {\n    document.addEventListener(\"DOMContentLoaded\", setupVideos);\n  } else {\n    setupVideos();\n  }\n})();"
  }
];
const sourceHtmlId = "";
const sourceHtmlClassName = "scroll-smooth";
const sourceHtmlStyle = "";
const sourceBodyId = "";
const sourceBodyClassName = "antialiased selection:bg-[#ff5a00] selection:text-white bg-[#f0eee9] text-[#111] overflow-x-hidden font-sans";
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
    <div className="aura-source-body antialiased selection:bg-[#ff5a00] selection:text-white bg-[#f0eee9] text-[#111] overflow-x-hidden font-sans">
      <canvas id="webgl-canvas" className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-0" width="3136" height="2042" style={{"width": "1568px", "height": "1021px"}}></canvas>

          <nav className="fixed top-0 left-0 w-full flex justify-between items-center p-6 md:p-8 z-50 mix-blend-difference text-white transition-opacity duration-500">
            <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors nav-elem">
              <iconify-icon icon="solar:hamburger-menu-linear" width="24" className=""></iconify-icon>
            </button>
            <div className="text-xl md:text-2xl tracking-tighter uppercase nav-elem font-dm-serif-display font-normal">
              AURA
            </div>
            <div className="flex gap-4 md:gap-6 nav-elem">
              <button className="hover:opacity-60 transition-opacity">
                <iconify-icon icon="solar:magnifer-linear" width="24" className=""></iconify-icon>
              </button>
              <button className="hover:opacity-60 transition-opacity">
                <iconify-icon icon="solar:bag-2-linear" width="24" className=""></iconify-icon>
              </button>
              <button className="hover:opacity-60 transition-opacity hidden md:block">
                <iconify-icon icon="solar:user-linear" width="24"></iconify-icon>
              </button>
            </div>
          </nav>

          <main className="relative z-10 w-full max-w-[1920px] mx-auto">
            <div style={{"height": "480vh"}} className="" id="sticky-scene-container">

              <div className="sticky top-0 h-screen w-full overflow-hidden">

                <div className="sticky h-dvh overflow-hidden flex flex-col md:px-12 hero-sticky-content w-full pt-32 pr-6 pb-24 pl-6 top-0 left-0 justify-center">
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="parallax-bg absolute inset-[-10%] w-[120%] h-[120%] bg-[url('https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/07ac518c-fcb9-4ae1-bda4-60e637756b84_3840w.webp')] bg-cover bg-center" style={{"position": "relative", "overflow": "hidden", "isolation": "isolate", "filter": "blur(0.7508px)"}}>
          <video src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/generated-videos/2e815afb-cac1-4c01-90e1-cf3810246e35/1780784779900-a666c03e-afbd-428c-bd3a-327e0fd182dd.mp4" poster="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/07ac518c-fcb9-4ae1-bda4-60e637756b84_3840w.webp" data-aura-generated-video="true" data-aura-video-preset="loop-in-view" muted="" playsInline="" preload="metadata" loop="" data-aura-generated-video-bg="true" style={{"position": "absolute", "inset": "0", "width": "100%", "height": "100%", "objectFit": "cover", "pointerEvents": "none", "zIndex": "0"}}></video>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f0eee9]/40 z-10"></div>
      </div>

                  <div className="flex z-30 pointer-events-none w-full h-full absolute top-0 right-0 bottom-0 left-0 items-end justify-center">
        <div className="relative z-10 w-[85vw] md:w-[45vw] h-[65vh] md:h-[85vh] mt-12 hero-image-container opacity-0 origin-bottom" style={{"filter": "blur(10px)"}}>
          <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/23fcef47-21c4-4c35-b8af-100d72047bde_1600w.png" className="w-full h-full object-cover object-top" alt="Editorial Model" />
        </div>

        <div className="z-20 landscape-fg origin-bottom opacity-0 w-full absolute right-0 left-0 gap-x-6 gap-y-6" style={{"filter": "blur(15px)"}}>
          <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/6d26ed1b-9f82-4f70-9b44-8015fb0e58f0_3840w.png" className="md:h-[55vh] object-top w-full h-full object-cover absolute bottom-0" alt="Surreal Mountain Landscape with Monolith Windows" />
          <div className="bg-gradient-to-t from-[#f0eee9] to-transparent w-full h-60 absolute right-0 bottom-0 left-0 gap-x-6 gap-y-6">
          </div>
        </div>
      </div>

                  <div className="z-20 grid grid-cols-12 gap-6 md:gap-12 flex-grow hero-content-wrapper w-full h-full relative">
        <div className="col-span-12 md:col-span-5 flex flex-col justify-between pt-12">
          <div className="hero-text-group">
            <h1 className="tracking-tight text-7xl font-normal uppercase leading-[0.86] text-white sm:text-8xl md:text-[8rem] lg:text-[11rem] xl:text-[13rem]" style={{"fontFamily": "Didot, 'Bodoni 72', 'Bodoni MT', 'Playfair Display', serif"}}>
              Virtual
              <br />
                      Worlds
            </h1>

          </div>

          <div className="mt-24 md:mt-auto pb-12 hero-desc-group">
            <div className="text-xs font-thin tracking-widest uppercase text-gray-500 mb-8 overflow-hidden">
              <span className="block translate-y-[100%] hero-fade-up">
                          // IMMERSIVE VR
                        </span>
            </div>
            <p className="max-w-xs text-sm text-gray-600 font-thin leading-relaxed overflow-hidden">
              <span className="block translate-y-[100%] hero-fade-up">
                          Explore immersive environments, interactive mechanics and
                          next-gen gaming thoughtfully constructed in one virtual
                          destination.
                        </span>
            </p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-7 flex flex-col justify-between items-end text-right">
          <div className="w-full flex justify-end mb-12 md:mb-0 hero-desc-group">
            <div className="text-xs font-thin tracking-widest uppercase text-gray-500 overflow-hidden">
              <span className="block translate-y-[100%] hero-fade-up">
                          // BUILT FOR
                          <br />
                          IMMERSION.
                        </span>
            </div>
          </div>

          <div className="w-full flex flex-col items-end justify-end mt-auto hero-text-group">
            <h1 className="tracking-tight text-5xl font-medium uppercase leading-[0.86] text-white sm:text-7xl md:text-8xl lg:text-9xl" style={{"fontFamily": "Didot, 'Bodoni 72', 'Bodoni MT', 'Playfair Display', serif"}}>
              Game
              <br />
                      Play
            </h1>


            <div className="mt-16 md:mt-24 flex items-center gap-6 overflow-hidden bg-white/40 backdrop-blur-md p-4 rounded-full hero-stats opacity-0 border border-white/30 shadow-2xl" style={{"clipPath": "polygon(0px 0px, 100% 0px, 100% 80%, 80% 100%, 0px 100%)"}}>
              <div className="flex -space-x-4">
                <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4f5668c5-fc4a-44e0-bc5e-a664189d3c31_1600w.jpg" className="w-12 h-12 rounded-full border-2 border-[#f0eee9] object-cover" alt="Avatar" />
                <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/eca707cc-a5b7-439a-b4fd-247f6106c2e1_1600w.jpg" className="w-12 h-12 rounded-full border-2 border-[#f0eee9] object-cover" alt="Avatar" />
                <div className="w-12 h-12 rounded-full border-2 border-[#f0eee9] bg-[#ff5a00] text-white flex items-center justify-center shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-lucide="plus" aria-hidden="true" className="lucide lucide-plus w-5 h-5"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                </div>
              </div>
              <div className="pr-4 text-left">
                <div className="text-2xl tracking-tight font-thin" style={{"fontFamily": "'DM Serif Display', serif"}}>
                  1.2M
                </div>
                <div className="text-xs font-thin uppercase tracking-widest text-gray-700">
                  Players Online
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-[35%] left-[45%] scale-0 hero-accent hidden md:block w-4 h-4 before:absolute before:content-[''] before:w-full before:h-[0.0625rem] before:bg-[#111]/40 before:top-1/2 before:left-0 after:absolute after:content-[''] after:w-[0.0625rem] after:h-full after:bg-[#111]/40 after:left-1/2 after:top-0" style={{"bottom": "40px"}}></div>
        <div className="absolute bottom-[20%] right-[40%] scale-0 hero-accent w-4 h-4 before:absolute before:content-[''] before:w-full before:h-[0.0625rem] before:bg-[#111]/40 before:top-1/2 before:left-0 after:absolute after:content-[''] after:w-[0.0625rem] after:h-full after:bg-[#111]/40 after:left-1/2 after:top-0" style={{"bottom": "36px"}}></div>
      </div>
                </div>


                <div className="absolute will-change-transform" style={{"inset": "-10%", "zIndex": "10", "transformOrigin": "50% 45%"}} id="portal">
                  <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/662883ed-49fa-4bd5-91bf-cb471bf4d8fe_3840w.png" alt="" className="w-full h-full object-cover" draggable="false" />
                </div>


                <div className="absolute top-0 left-0 h-full will-change-transform" style={{"width": "94%", "zIndex": "20", "transition": "none", "filter": "blur(10px)"}} id="curtainL">
        <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/e50de7d6-9edb-44b7-97b8-c16b51eac922_3840w.png" alt="" className="w-full h-full object-cover object-right" draggable="false" />
      </div>


                <div className="absolute top-0 right-0 h-full will-change-transform" style={{"width": "94%", "zIndex": "20", "transition": "none", "filter": "blur(10px)"}} id="curtainR">
        <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/b39f632f-53b4-4507-8dee-c411a6d98d4f_3840w.png" alt="" className="w-full h-full object-cover object-left" draggable="false" />
      </div>





                <div className="flex absolute top-0 right-0 bottom-0 left-0 items-end justify-center" style={{"zIndex": "46", "pointerEvents": "none"}} id="cta">
        <div className="text-center px-6">
          <h2 className="text-9xl font-normal text-[#000000] tracking-tight font-dm-serif-display" style={{"fontFamily": "'Viaoda Libre', serif", "fontSize": "clamp(2.375rem, 7vw, 4.875rem)", "letterSpacing": "0.03em", "lineHeight": "1.05", "textShadow": "0 2px 20px rgba(0,0,0,0.4)"}}>
            Pixels &amp;
            <br />
                      Presence
          </h2>
          <p className="max-w-xs text-sm text-gray-600 font-thin leading-relaxed overflow-hidden">
            Master spatial computing and immersive environments in our
            next-gen VR titles.
          </p>
        </div>
      </div>



              </div>
            </div>

            <div className="w-full bg-[#111] text-white py-5 overflow-hidden flex whitespace-nowrap border-y border-[#333]">
              <div className="animate-marquee flex items-center gap-16 text-sm font-normal tracking-widest uppercase">
                <span className="flex items-center gap-3 font-dm-sans">
                  <iconify-icon icon="solar:gamepad-linear" width="20"></iconify-icon>
                  Immersion
                </span>
                <span className="flex items-center gap-3 font-dm-sans">
                  <iconify-icon icon="solar:headphones-linear" width="20"></iconify-icon>
                  Spatial Audio
                </span>
                <span className="flex items-center gap-3 font-dm-sans">
                  <iconify-icon icon="solar:hand-heart-linear" width="20"></iconify-icon>
                  Haptics
                </span>
                <span className="flex items-center gap-3 font-dm-sans">
                  <iconify-icon icon="solar:planet-linear" width="20"></iconify-icon>
                  Presence
                </span>
                <span className="flex items-center gap-3 font-dm-sans">
                  <iconify-icon icon="solar:gamepad-linear" width="20"></iconify-icon>
                  Immersion
                </span>
                <span className="flex items-center gap-3 font-dm-sans">
                  <iconify-icon icon="solar:headphones-linear" width="20"></iconify-icon>
                  Spatial Audio
                </span>
                <span className="flex items-center gap-3 font-dm-sans">
                  <iconify-icon icon="solar:hand-heart-linear" width="20"></iconify-icon>
                  Haptics
                </span>
                <span className="flex items-center gap-3 font-dm-sans">
                  <iconify-icon icon="solar:planet-linear" width="20"></iconify-icon>
                  Presence
                </span>
              </div>
            </div>


            <section className="py-24 md:py-32 w-full relative bg-[#0a0a0c] text-[#a3a3a3] overflow-hidden z-20 font-sans" id="textile-engine">

              <div className="absolute inset-0" style={{"pointerEvents": "none", "backgroundImage": "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.015) 10px, rgba(255,255,255,0.015) 11px)", "zIndex": "0"}}></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.03)_0%,transparent_70%)] pointer-events-none"></div>


              <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 mb-16 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 gs-te-header">
                <div className="">
                  <div className="text-xs font-normal text-white/50 tracking-tight mb-4 flex items-center gap-2 font-dm-sans">
                    <i data-lucide="headset" className="w-4 h-4 text-cyan-400"></i>
                    Aura VR Protocol
                  </div>
                  <h2 className="text-5xl md:text-7xl text-white tracking-tight leading-[0.9] font-dm-serif-display font-normal">
                    Simulate
                    <br />
                    <span className="text-white/40 font-dm-serif-display font-normal">
                      The Future
                    </span>
                  </h2>
                </div>
                <div className="text-xs font-normal text-white/50 tracking-tight text-right hidden md:block font-dm-sans">
                  VR Render Node
                  <br />
                  <span className="text-white font-dm-sans">Active</span>
                </div>
              </div>


              <div className="w-full px-6 md:px-12 flex justify-center relative z-10">

                <div id="te-device" className="relative w-full max-w-[1300px] h-[750px] md:h-[800px] bg-[#0f0f11] rounded border border-white/10 opacity-0 scale-95 overflow-hidden flex flex-col md:flex-row shadow-2xl">

                  <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-white/30 gs-te-corner opacity-0 z-30 pointer-events-none"></div>
                  <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-white/30 gs-te-corner opacity-0 z-30 pointer-events-none"></div>
                  <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-white/30 gs-te-corner opacity-0 z-30 pointer-events-none"></div>
                  <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-white/30 gs-te-corner opacity-0 z-30 pointer-events-none"></div>


                  <div className="w-full md:w-[300px] h-[300px] md:h-full border-b md:border-b-0 md:border-r border-white/10 flex flex-col z-20 relative shrink-0 bg-[#0f0f11]">

                    <div className="gs-te-sidebar-item flex flex-col gap-3 p-5 border-b border-white/10">
                      <div className="text-xs font-normal text-white/70 flex justify-between items-center font-dm-sans">
                        Input Source
                      </div>
                      <div className="w-full aspect-[4/3] border border-dashed border-white/20 rounded flex flex-col items-center justify-center bg-[#161618] hover:bg-[#1a1a1c] relative group cursor-pointer hover:border-cyan-400/50 transition-colors">
                        <i data-lucide="image-plus" className="text-white/20 w-8 h-8 mb-3 group-hover:text-cyan-400/40 transition-colors"></i>
                        <span className="text-xs font-normal text-white/50 text-center px-4 font-dm-sans">
                          Update Asset
                        </span>
                      </div>
                    </div>


                    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6" style={{"scrollbarWidth": "thin", "scrollbarColor": "rgba(255,255,255,0.05) transparent"}}>
                      <h2 className="text-xs font-normal text-white/50 gs-te-sidebar-item tracking-tight font-dm-sans">
                        Asset Library
                      </h2>

                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between text-xs font-normal text-white gs-te-sidebar-item cursor-pointer">
                          <span className="font-dm-sans">Environments</span>
                          <i data-lucide="chevron-up" className="w-4 h-4 text-white/50"></i>
                        </div>


                        <div className="flex flex-col gap-2">
                          <div className="gs-te-list-item p-2 rounded bg-[#161618] border border-white/5 hover:border-white/20 cursor-pointer flex items-center gap-3 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                            <span className="text-xs font-normal text-white/70 font-dm-sans">
                              Sci-Fi Corridors
                            </span>
                          </div>
                          <div className="gs-te-list-item p-2 rounded bg-[#161618] border border-white/5 hover:border-white/20 cursor-pointer flex items-center gap-3 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                            <span className="text-xs font-normal text-white/70 font-dm-sans">
                              Fantasy Forests
                            </span>
                          </div>

                          <div className="gs-te-list-item p-2 rounded bg-cyan-400/5 border border-cyan-400/30 cursor-pointer flex items-center gap-3 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
                            <span className="text-xs font-normal text-cyan-400 font-dm-sans">
                              Cyberpunk Cities
                            </span>
                          </div>
                        </div>


                        <div className="flex items-center justify-between text-xs font-normal text-white/40 hover:text-white/80 cursor-pointer transition-colors mt-2 gs-te-sidebar-item">
                          <span className="font-dm-sans">Props &amp; Items</span>
                          <i data-lucide="chevron-down" className="w-4 h-4"></i>
                        </div>
                        <div className="flex items-center justify-between text-xs font-normal text-white/40 hover:text-white/80 cursor-pointer transition-colors gs-te-sidebar-item">
                          <span className="font-dm-sans">Characters &amp; NPCs</span>
                          <i data-lucide="chevron-down" className="w-4 h-4"></i>
                        </div>
                      </div>
                    </div>


                    <div className="p-5 border-t border-white/10 bg-[#0f0f11]">
                      <div className="flex justify-between items-center text-xs font-normal text-white/40 mb-4 px-1">
                        <span className="font-dm-sans">Est. 45s</span>
                        <span className="flex items-center gap-1.5 text-white font-dm-sans">
                          <i data-lucide="coins" className="w-3 h-3 text-cyan-400"></i>
                          15
                        </span>
                      </div>
                      <button className="w-full relative group rounded p-[1px] block overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] gs-te-cta" style={{"boxShadow": "rgba(34, 211, 238, 0.184) 0px 0px 12.3853px"}}>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative w-full py-3 bg-[#0a0a0c] text-white font-normal text-xs flex items-center justify-center gap-2 rounded-[3px] group-hover:bg-transparent group-hover:text-black transition-colors tracking-tight font-dm-sans">
                          <i data-lucide="wand-2" className="w-4 h-4"></i>
                          Initialize Environment
                        </div>
                      </button>
                    </div>
                  </div>


                  <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0c] bg-cover bg-center z-0 relative items-center justify-center bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/2e9d6abf-fda2-4818-b6ad-3d55896004f6_3840w.png)]" style={{"position": "relative", "overflow": "hidden", "isolation": "isolate"}}><video src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/generated-videos/2e815afb-cac1-4c01-90e1-cf3810246e35/1781947152338-fc31a6ab-23b1-4817-a166-332c89b30f46.mp4" poster="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/2e9d6abf-fda2-4818-b6ad-3d55896004f6_3840w.png" data-aura-generated-video="true" data-aura-video-preset="play-once" muted="" playsInline="" preload="metadata" data-aura-generated-video-bg="true" style={{"position": "absolute", "inset": "0", "width": "100%", "height": "100%", "objectFit": "cover", "pointerEvents": "none", "zIndex": "0"}}></video>

                    <div id="te-webgl-container" className="absolute inset-0 z-0 opacity-0 mix-blend-screen pointer-events-none"></div>


                    <div className="absolute top-8 left-8 z-10 flex flex-col gap-4 gs-te-tool hidden md:flex">
                      <div className="bg-[#161618]/80 backdrop-blur rounded p-3 text-xs font-normal text-white/60 grid grid-cols-2 gap-x-8 gap-y-2 border border-white/10 w-max">
                        <span className="font-dm-sans">Topology</span>
                        <span className="text-right text-white font-dm-sans">Quads</span>
                        <span className="font-dm-sans">Polygons</span>
                        <span className="text-right text-white font-dm-sans">
                          128,400
                        </span>
                        <span className="font-dm-sans">Vertices</span>
                        <span className="text-right text-white font-dm-sans">64,200</span>
                      </div>
                    </div>


                    <div className="absolute top-8 right-8 z-10 flex items-center gap-2 px-3 py-1.5 rounded bg-[#161618]/80 backdrop-blur border border-white/10 gs-te-tool">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
                      <span className="text-xs font-normal text-white tracking-tight font-dm-sans">
                        Neo-Tokyo
                      </span>
                    </div>


                    <div className="absolute bottom-8 z-10 flex items-center bg-[#161618]/90 backdrop-blur p-2 rounded border border-white/10 shadow-xl gs-te-bottom">
                      <button className="flex items-center gap-2 px-4 py-2 rounded bg-[#1a1a1c] border border-white/5 text-white text-xs font-normal mr-2 hover:bg-[#222] hover:border-white/20 transition-colors font-dm-sans">
                        <i data-lucide="maximize" className="w-3 h-3"></i>
                        Pan Canvas
                      </button>
                      <div className="flex items-center gap-1 px-2 border-l border-white/10">
                        <button className="w-8 h-8 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-[#1a1a1c] transition-all" title="Pigment">
                          <i data-lucide="droplet" className="w-4 h-4"></i>
                        </button>
                        <button className="w-8 h-8 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-[#1a1a1c] transition-all" title="Sculpt">
                          <i data-lucide="pen-tool" className="w-4 h-4"></i>
                        </button>
                        <button className="w-8 h-8 rounded flex items-center justify-center text-cyan-400 bg-cyan-400/10 transition-all" title="Texture">
                          <i data-lucide="layers" className="w-4 h-4"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>




            </section><section className="py-24 md:py-32 px-6 md:px-12 w-full relative">
              <div className="grid grid-cols-12 gap-6 md:gap-12 relative z-10">
                <div className="col-span-12 md:col-span-6 z-20">
                  <h2 className="text-large text-[#111] mb-12 gs-reveal tracking-tight font-dm-serif-display font-normal">
                    Immersive - realities
                    <br />
                    ©26
                  </h2>

                  <div className="flex items-center gap-4 gs-reveal">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#ff5a00]"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    </div>
                    <button className="text-xs font-normal tracking-widest uppercase border border-[#111]/20 rounded-full px-6 py-3 flex items-center gap-2 hover:bg-[#111] hover:text-white hover:border-[#111] transition-all duration-300 font-dm-sans">
                      Explore Worlds
                      <iconify-icon icon="solar:arrow-right-linear"></iconify-icon>
                    </button>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-6 flex flex-col md:flex-row justify-end items-start gap-8 mt-12 md:mt-0 gs-reveal" style={{"filter": "blur(0px)"}}>
                  <div className="text-xs text-gray-500 font-normal tracking-wide leading-relaxed max-w-[150px] font-dm-sans">
                    Where Virtual Meets Reality Next-Gen Gaming Accessible
                  </div>
                  <div className="flex gap-4 items-start">
                    <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0e7ae8d5-8637-4c9f-8181-766ac72f2bc7_320w.webp" className="w-16 h-24 object-cover clip-poly-1" />
                    <span className="text-2xl tracking-tight font-dm-serif-display font-normal">
                      ($450)
                    </span>
                  </div>
                </div>

                <div className="col-span-12 mt-24 relative min-h-[60vh]">
                  <div className="absolute top-0 left-[10%] md:left-[25%] w-[70vw] md:w-[35vw] h-[50vh] md:h-[70vh] z-10 gs-img-scale">
        <video src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/generated-videos/2e815afb-cac1-4c01-90e1-cf3810246e35/1781947249710-b13b2ca9-7b55-489a-b07d-f4fbee212fb8.mp4" poster="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/1108eb45-423e-4519-bb5d-1888a479f2a5_1600w.png" data-aura-generated-video="true" data-aura-video-preset="hover" muted="" playsInline="" preload="metadata" className="w-full h-full object-cover clip-poly-2 shadow-2xl shadow-black/5"></video>
      </div>

                  <div className="absolute top-[20%] right-[5%] md:right-[15%] w-[50vw] md:w-[25vw] h-[30vh] md:h-[40vh] z-20 gs-img-scale delay-100">
                    <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0daea904-baf4-4a31-9bb0-4145336112e7_1600w.png" className="w-full h-full object-cover clip-poly-1" />
                    <div className="mt-4 text-xs font-normal tracking-widest text-gray-500 flex justify-between">
                      <span className="font-dm-sans">©Engine - unreal 5</span>
                      <span className="font-dm-sans">(60%)</span>
                    </div>
                  </div>

                  <div className="absolute top-[50%] left-0 w-[20%] thin-line-dashed z-0 hidden md:block"></div>
                  <div className="absolute top-[48%] left-[5%] max-w-[200px] text-xs text-gray-600 font-light leading-relaxed bg-[#f0eee9] p-2 z-30 gs-reveal hidden md:block font-dm-sans">
                    Every virtual environment carries rhythm beyond pixels—it's
                    presence and meaning where raw interaction meets design.
                  </div>
                </div>

                <div className="col-span-12 flex justify-end mt-24 md:mt-32 relative z-30">
                  <div className="w-full md:w-1/2 flex flex-col gap-2">
                    <div className="flex justify-between items-end pb-4 thin-line gs-list-item">
                      <div className="text-xs text-gray-400 mb-2 font-normal font-dm-sans">
                        [CATEGORIES]
                      </div>
                      <div className="flex-grow mx-4 thin-line-dashed mb-2 opacity-50"></div>
                    </div>

                    <div className="flex items-baseline justify-end gap-6 text-4xl md:text-6xl font-normal tracking-tight gs-list-item hover:text-[#ff5a00] transition-colors cursor-pointer group">
                      <span className="text-sm font-light text-gray-400 mb-auto transition-colors group-hover:text-[#ff5a00] font-dm-sans">
                        [01]
                      </span>
                      <span className="font-dm-serif-display font-normal">
                        Action VR (174)
                      </span>
                    </div>
                    <div className="flex items-baseline justify-end gap-6 text-4xl md:text-6xl font-normal tracking-tight text-gray-400 gs-list-item hover:text-[#111] transition-colors cursor-pointer group">
                      <span className="text-sm font-light text-gray-300 mb-auto transition-colors group-hover:text-[#111] font-dm-sans">
                        [02]
                      </span>
                      <span className="font-dm-serif-display font-normal">
                        Puzzle VR (361)
                      </span>
                    </div>
                    <div className="flex items-baseline justify-end gap-6 text-4xl md:text-6xl font-normal tracking-tight text-gray-400 gs-list-item hover:text-[#111] transition-colors cursor-pointer group">
                      <span className="text-sm font-light text-gray-300 mb-auto transition-colors group-hover:text-[#111] font-dm-sans">
                        [03]
                      </span>
                      <span className="font-dm-serif-display font-normal">
                        Simulation (368)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full thin-line mt-32 pt-6 flex justify-between text-xs font-normal uppercase tracking-widest text-gray-500 overflow-hidden">
                <span className="font-dm-sans">Spatial Tracking</span>
                <span className="font-dm-sans">+</span>
                <span className="font-dm-sans">Haptic Feedback</span>
                <span className="font-dm-sans">+</span>
                <span className="font-dm-sans">Seamless Immersion</span>
                <span className="font-dm-sans">+</span>
                <span className="font-dm-sans">High Framerates</span>
                <span className="font-dm-sans">+</span>
                <span className="font-dm-sans">Unreal Engine</span>
              </div>
            </section><section className="py-24 md:py-32 px-6 md:px-12 w-full bg-[#050505] text-white relative">

        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{"backgroundImage": "url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noiseFilter\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.85\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noiseFilter)\\'/%3E%3C/svg%3E')"}}></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(255,90,0,0.05)_0%,transparent_60%)] pointer-events-none z-0"></div>

        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative z-10">

          <div className="col-span-1 lg:col-span-4 relative z-20">
            <div className="lg:sticky lg:top-32 flex flex-col gap-6 max-w-sm gs-reveal">
              <div className="w-8 h-8 rounded-none border border-white/10 flex items-center justify-center mb-2 bg-[#0e0e0e]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#ff5a00]"><path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"></path><path d="M21 16v2a4 4 0 0 1-4 4h-5"></path></svg>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight font-light leading-[1.1] text-gray-100 font-dm-serif-display uppercase">
                <span className="block">
                  Next-Gen
                  <span className="text-[#ff5a00] capitalize">
                    VR Games
                  </span>
                </span>
                <span className="block">
                  Powered By
                </span>
                <span className="block text-white">
                  Spatial AI.
                </span>
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed mt-2 font-dm-sans font-light">
                Discover how our agency blends artificial intelligence with spatial computing to craft breathtaking VR games and 3D experiences at unprecedented speeds.
              </p>
            </div>
          </div>


          <div className="col-span-1 lg:col-span-8 flex flex-col lg:items-end gap-12 lg:gap-16 lg:pt-0 w-full pt-12 items-center text-gray-400 bg-transparent">


            <article className="w-full max-w-[800px] rounded-none border border-white/5 p-2 bg-gradient-to-b from-white/[0.05] to-transparent gs-reveal relative group">
              <div className="flex flex-col lg:flex-row h-full rounded-none border border-white/5 bg-[#0e0e0e] overflow-hidden">
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center gap-6 z-10">
                  <span className="text-[10px] tracking-[0.2em] font-light text-gray-400 border border-white/10 rounded-none px-3 py-1 w-fit uppercase bg-white/[0.02] font-dm-sans">
                    Generation
                  </span>
                  <h3 className="text-2xl md:text-3xl tracking-tight text-white uppercase font-dm-serif-display font-light">
                    AI Asset &amp; World Creation
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-dm-sans font-light">
                    Instantly generate highly detailed 3D models, intricate environments, and immersive worlds from simple prompts. Rapidly populate your VR space.
                  </p>
                </div>
                <div className="flex-1 bg-[#050505] p-6 md:p-10 flex flex-col items-center justify-center relative border-t lg:border-t-0 lg:border-l border-white/5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff5a00]/5 to-transparent opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
                  <div className="w-full max-w-[300px] bg-[#0a0a0a] rounded-none border border-white/10 p-5 flex flex-col gap-4 shadow-2xl relative z-10 transform transition-transform duration-500 group-hover:-translate-y-1">
                    <p className="text-sm text-gray-200 font-dm-sans font-light">
                      &gt; Prompt: Cyberpunk alleyway, neon signs
                    </p>
                    <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1.5 bg-[#1a1a1a] border border-white/10 rounded-none px-2 py-1 text-xs text-gray-400 font-dm-sans font-light">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-gray-500"><path d="M12 20v2"></path><path d="M12 2v2"></path><path d="M17 20v2"></path><path d="M17 2v2"></path><path d="M2 12h2"></path><path d="M2 17h2"></path><path d="M2 7h2"></path><path d="M20 12h2"></path><path d="M20 17h2"></path><path d="M20 7h2"></path><path d="M7 20v2"></path><path d="M7 2v2"></path><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="8" y="8" width="8" height="8" rx="1"></rect></svg>
                        WorldGen v2.1
                      </div>
                      <div className="flex-1"></div>
                      <span className="text-[10px] text-gray-500 font-dm-sans font-light">
                        Polycount
                      </span>
                      <span className="bg-[#1a1a1a] border border-white/10 rounded-none text-[10px] px-2 py-0.5 text-gray-300 font-dm-sans font-light">
                        Optimized
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>


            <article className="w-full max-w-[800px] rounded-none border border-white/5 p-2 bg-gradient-to-b from-white/[0.05] to-transparent gs-reveal relative group">
              <div className="flex flex-col lg:flex-row h-full rounded-none border border-white/5 bg-[#0e0e0e] overflow-hidden">
                <div className="flex-1 bg-[#050505] p-6 md:p-10 flex flex-col items-center justify-center relative border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden order-2 lg:order-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff5a00]/5 to-transparent opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
                  <div className="w-full max-w-[300px] bg-[#0a0a0a] rounded-none border border-white/10 p-5 flex flex-col gap-4 shadow-2xl relative z-10 transform transition-transform duration-500 group-hover:-translate-y-1">
                    <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff5a00]/50 animate-pulse"></div>
                      <span className="text-[10px] text-gray-400 font-dm-sans font-light tracking-widest uppercase">Motion Sync Override</span>
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs text-gray-500 font-dm-sans font-light">&gt; Analyzing skeletal mesh...</p>
                      <p className="text-xs text-[#ff5a00]/70 font-dm-sans font-light">&gt; Applying procedural IK...</p>
                      <p className="text-sm text-gray-200 font-dm-sans font-light pt-2 border-t border-white/5">&gt; Animation sequence baked.</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center gap-6 z-10 order-1 lg:order-2">
                  <span className="text-[10px] tracking-[0.2em] font-light text-gray-400 border border-white/10 rounded-none px-3 py-1 w-fit uppercase bg-white/[0.02] font-dm-sans">
                    Animation
                  </span>
                  <h3 className="text-2xl md:text-3xl tracking-tight text-white uppercase font-dm-serif-display font-light">
                    Character Design &amp; Motion
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-dm-sans font-light">
                    Bring digital humans to life with AI-assisted rigging, fluid animations, and procedural motion capture that adapts dynamically to player interactions.
                  </p>
                </div>
              </div>
            </article>


            <article className="w-full max-w-[800px] rounded-none border border-white/5 p-2 bg-gradient-to-b from-white/[0.05] to-transparent gs-reveal relative group">
              <div className="flex flex-col lg:flex-row h-full rounded-none border border-white/5 bg-[#0e0e0e] overflow-hidden">
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center gap-6 z-10">
                  <span className="text-[10px] tracking-[0.2em] font-light text-gray-400 border border-white/10 rounded-none px-3 py-1 w-fit uppercase bg-white/[0.02] font-dm-sans">
                    Acceleration
                  </span>
                  <h3 className="text-2xl md:text-3xl tracking-tight text-white uppercase font-dm-serif-display font-light">
                    Rapid VR Prototyping
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-dm-sans font-light">
                    Move from concept to playable prototype in days, not months. We build optimized real-time rendering workflows using Unreal Engine and AI integration.
                  </p>
                </div>
                <div className="flex-1 bg-[#050505] p-6 md:p-10 flex flex-col items-center justify-center relative border-t lg:border-t-0 lg:border-l border-white/5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff5a00]/5 to-transparent opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
                  <div className="w-full max-w-[300px] bg-[#0a0a0a] rounded-none border border-white/10 p-5 flex flex-col gap-4 shadow-2xl relative z-10 transform transition-transform duration-500 group-hover:-translate-y-1">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border border-white/5 bg-white/[0.02] p-3">
                        <span className="text-xs text-gray-400 font-dm-sans font-light">Concept &amp; Greybox</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#ff5a00]/70"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <div className="flex items-center justify-between border border-white/5 bg-white/[0.02] p-3">
                        <span className="text-xs text-gray-400 font-dm-sans font-light">Asset Generation</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#ff5a00]/70"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <div className="flex items-center justify-between border border-white/5 bg-white/[0.02] p-3">
                        <span className="text-xs text-gray-400 font-dm-sans font-light">Engine Integration</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-600"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>


            <article className="w-full max-w-[800px] rounded-none border border-white/5 p-2 bg-gradient-to-b from-white/[0.05] to-transparent gs-reveal relative group">
              <div className="flex flex-col lg:flex-row h-full rounded-none border border-white/5 bg-[#0e0e0e] overflow-hidden">
                <div className="flex-1 bg-[#050505] p-6 md:p-10 flex flex-col items-center justify-center relative border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden order-2 lg:order-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff5a00]/5 to-transparent opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
                  <div className="w-[160px] h-[160px] rounded-full border border-white/10 flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-700">
                    <div className="absolute inset-2 rounded-full border border-white/5 border-t-[#ff5a00]/30 animate-[spin_3s_linear_infinite]"></div>
                    <div className="absolute inset-6 rounded-full border border-white/5 border-l-[#ff5a00]/20 animate-[spin_4s_linear_infinite_reverse]"></div>
                    <div className="flex flex-col items-center justify-center bg-[#0a0a0a] w-[80px] h-[80px] rounded-full border border-white/10 shadow-2xl">
                        <span className="text-white text-3xl font-light tracking-tighter font-dm-serif-display">16<span className="text-xs">K</span></span>
                        <span className="text-[8px] text-gray-500 tracking-widest mt-0.5 font-dm-sans uppercase">Resolution</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center gap-6 z-10 order-1 lg:order-2">
                  <span className="text-[10px] tracking-[0.2em] font-light text-gray-400 border border-white/10 rounded-none px-3 py-1 w-fit uppercase bg-white/[0.02] font-dm-sans">
                    Fidelity
                  </span>
                  <h3 className="text-2xl md:text-3xl tracking-tight text-white uppercase font-dm-serif-display font-light">
                    AI-Assisted Texturing
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-dm-sans font-light">
                    Automate the creation of PBR materials. AI upscales textures and generates infinite variations to achieve hyper-realistic surface details for VR headsets.
                  </p>
                </div>
              </div>
            </article>


            <article className="w-full max-w-[800px] rounded-none border border-white/5 p-2 bg-gradient-to-b from-white/[0.05] to-transparent gs-reveal relative group">
              <div className="flex flex-col lg:flex-row h-full rounded-none border border-white/5 bg-[#0e0e0e] overflow-hidden">
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center gap-6 z-10">
                  <span className="text-[10px] tracking-[0.2em] font-light text-gray-400 border border-white/10 rounded-none px-3 py-1 w-fit uppercase bg-white/[0.02] font-dm-sans">
                    Synergy
                  </span>
                  <h3 className="text-2xl md:text-3xl tracking-tight text-white uppercase font-dm-serif-display font-light">
                    Artist &amp; AI Collaboration
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-dm-sans font-light">
                    We don't replace artists; we supercharge them. Our workflows establish a seamless bridge between human creativity and machine generation for uncompromised vision.
                  </p>
                </div>
                <div className="flex-1 bg-[#050505] p-6 md:p-10 flex flex-col items-center justify-center relative border-t lg:border-t-0 lg:border-l border-white/5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff5a00]/5 to-transparent opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
                  <div className="w-full max-w-[300px] bg-[#0a0a0a] rounded-none border border-white/10 p-5 flex flex-col gap-4 shadow-2xl relative z-10 transform transition-transform duration-500 group-hover:-translate-y-1">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <span className="text-xs text-gray-400 font-dm-sans font-light uppercase tracking-widest">Pipeline Sync</span>
                      <div className="flex items-center gap-1.5 bg-[#ff5a00]/10 border border-[#ff5a00]/20 rounded-none px-2 py-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff5a00] animate-pulse"></div>
                        <span className="text-[9px] text-[#ff5a00] font-dm-sans font-light uppercase tracking-wider">Active</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="border border-white/5 p-3 flex flex-col gap-1 bg-white/[0.02]">
                        <span className="text-[10px] text-gray-500 font-dm-sans uppercase">Render Time</span>
                        <span className="text-sm text-gray-200 font-dm-sans font-light">2.4ms</span>
                      </div>
                      <div className="border border-white/5 p-3 flex flex-col gap-1 bg-white/[0.02]">
                        <span className="text-[10px] text-gray-500 font-dm-sans uppercase">Iteration</span>
                        <span className="text-sm text-gray-200 font-dm-sans font-light">10x Faster</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>

          </div>
        </div>
      </section><section className="py-24 md:py-32 px-6 md:px-12 w-full relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 relative z-10">


          <div className="col-span-1 md:col-span-12 mb-8 md:mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ff5a00]"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              </div>
              <span className="text-xs uppercase tracking-widest text-gray-500 font-dm-sans font-light">Who We Are</span>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl tracking-tight font-dm-serif-display font-normal text-[#111] leading-[0.9]">
              Engineering <br className="hidden md:block" />
              <span className="text-gray-400">new dimensions.</span>
            </h2>
          </div>


          <div className="col-span-1 md:col-span-5 flex flex-col gap-10">
            <div className="w-full aspect-[4/5] relative overflow-hidden clip-poly-1 shadow-2xl shadow-black/5">
              <video src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/generated-videos/2e815afb-cac1-4c01-90e1-cf3810246e35/1781947377692-189164fd-37eb-456a-85f1-c34a19ab7597.mp4" poster="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/913fa853-7d2f-4a27-a0b6-e3df37ae2dc1_1600w.png" data-aura-generated-video="true" data-aura-video-preset="hover" muted="" playsInline="" preload="metadata" aria-label="Company workspace abstract" className="w-full h-full object-cover"></video>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-[#111]/10 pt-8">
              <div className="flex flex-col gap-2">
                <div className="text-4xl md:text-5xl font-dm-serif-display font-normal tracking-tight text-[#111]">10+</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-dm-sans font-light">Years Active</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-4xl md:text-5xl font-dm-serif-display font-normal tracking-tight text-[#111]">150</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-dm-sans font-light">Virtual Worlds</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-4xl md:text-5xl font-dm-serif-display font-normal tracking-tight text-[#111]">42</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-dm-sans font-light">Global Awards</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-4xl md:text-5xl font-dm-serif-display font-normal tracking-tight text-[#111]">99%</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-dm-sans font-light">Immersion Rate</div>
              </div>
            </div>
          </div>


          <div className="col-span-1 md:col-span-7 flex flex-col pt-4 md:pt-0">
            <div className="max-w-2xl mb-16">
              <p className="text-xl md:text-2xl text-gray-800 font-light leading-relaxed mb-8 font-dm-sans tracking-tight">
                We are a collective of spatial computing pioneers, creative technologists, and narrative designers. Our
                mission is to bridge the gap between imagination and tangible digital reality, crafting experiences that
                resonate beyond the screen.
              </p>
              <p className="text-sm text-gray-500 leading-loose font-dm-sans font-light">
                Founded in 2016, we recognized early that the future of human-computer interaction wouldn't be confined to
                flat rectangles. By leveraging next-generation engines and relentless innovation in haptics and spatial
                tracking, we build environments that feel as real as the physical world. Every project is an opportunity to
                push the boundaries of what's technically possible and emotionally impactful.
              </p>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between items-end pb-4 border-b border-[#111]/10">
                <div className="text-xs text-gray-400 font-light font-dm-sans uppercase tracking-widest">
                  [ Core Principles ]
                </div>
              </div>

              <div className="flex flex-col group mt-2">
                <div className="flex justify-between items-center py-8 border-b border-[#111]/5 hover:border-[#ff5a00] transition-all cursor-pointer group/item">
                  <div className="flex items-center gap-6 md:gap-12">
                    <span className="text-sm font-light text-gray-400 group-hover/item:text-[#ff5a00] transition-colors font-dm-sans">01</span>
                    <span className="text-3xl md:text-5xl tracking-tight font-dm-serif-display font-normal text-gray-400 group-hover/item:text-[#111] transition-colors">Radical Presence</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right w-8 h-8 text-[#ff5a00] opacity-0 group-hover/item:opacity-100 transition-all transform -translate-x-4 translate-y-4 group-hover/item:translate-x-0 group-hover/item:translate-y-0 duration-300">
                    <path d="M7 7h10v10"></path>
                    <path d="M7 17 17 7"></path>
                  </svg>
                </div>

                <div className="flex justify-between items-center py-8 border-b border-[#111]/5 hover:border-[#ff5a00] transition-all cursor-pointer group/item">
                  <div className="flex items-center gap-6 md:gap-12">
                    <span className="text-sm font-light text-gray-400 group-hover/item:text-[#ff5a00] transition-colors font-dm-sans">02</span>
                    <span className="text-3xl md:text-5xl tracking-tight font-dm-serif-display font-normal text-gray-400 group-hover/item:text-[#111] transition-colors">Invisible Tech</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right w-8 h-8 text-[#ff5a00] opacity-0 group-hover/item:opacity-100 transition-all transform -translate-x-4 translate-y-4 group-hover/item:translate-x-0 group-hover/item:translate-y-0 duration-300">
                    <path d="M7 7h10v10"></path>
                    <path d="M7 17 17 7"></path>
                  </svg>
                </div>

                <div className="flex justify-between items-center py-8 border-b border-[#111]/5 hover:border-[#ff5a00] transition-all cursor-pointer group/item">
                  <div className="flex items-center gap-6 md:gap-12">
                    <span className="text-sm font-light text-gray-400 group-hover/item:text-[#ff5a00] transition-colors font-dm-sans">03</span>
                    <span className="text-3xl md:text-5xl tracking-tight font-dm-serif-display font-normal text-gray-400 group-hover/item:text-[#111] transition-colors">Narrative Flow</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right w-8 h-8 text-[#ff5a00] opacity-0 group-hover/item:opacity-100 transition-all transform -translate-x-4 translate-y-4 group-hover/item:translate-x-0 group-hover/item:translate-y-0 duration-300">
                    <path d="M7 7h10v10"></path>
                    <path d="M7 17 17 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-[#111]/10 mt-24 md:mt-32 pt-6 flex flex-wrap md:flex-nowrap justify-between gap-4 text-xs font-light uppercase tracking-widest text-gray-500 overflow-hidden">
          <span className="font-dm-sans whitespace-nowrap">Spatial Tracking</span>
          <span className="font-dm-sans hidden md:block">+</span>
          <span className="font-dm-sans whitespace-nowrap">Haptic Feedback</span>
          <span className="font-dm-sans hidden md:block">+</span>
          <span className="font-dm-sans whitespace-nowrap">Seamless Immersion</span>
          <span className="font-dm-sans hidden md:block">+</span>
          <span className="font-dm-sans whitespace-nowrap">High Framerates</span>
          <span className="font-dm-sans hidden md:block">+</span>
          <span className="font-dm-sans whitespace-nowrap">Unreal Engine</span>
        </div>
      </section><section className="text-white bg-[#050505] w-full h-[400vh] pt-32 pb-32 relative" id="hScrollSection-emq">
        <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-center py-12 md:py-20">

          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{"backgroundImage": "url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noiseFilter\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.85\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noiseFilter)\\'/%3E%3C/svg%3E')", "zIndex": "1"}}>
          </div>

          <div className="md:px-12 md:mb-16 flex flex-col md:flex-row md:items-end gap-6 z-10 shrink-0 w-full mb-8 pr-6 pl-6 relative gap-x-6 gap-y-6 items-start justify-between">
            <div className="flex flex-col gap-4">
              <div className="text-xs font-thin tracking-widest uppercase text-white/50 flex items-center gap-3 font-dm-sans">
                <span className="w-2 h-2 rounded-full bg-[#ff5a00]"></span>
                [ Experiential Gallery ]
              </div>
              <h2 className="text-5xl md:text-7xl lg:text-8xl tracking-tight font-dm-serif-display font-light text-white max-w-4xl leading-[0.9]">
                In game, <br />
                <span className="text-white/40">not in theory.</span>
              </h2>
            </div>
            <div className="flex items-center gap-6 text-xs font-dm-sans font-thin uppercase tracking-widest text-white/40 bg-white/[0.03] border border-white/10 rounded-full px-6 py-3 backdrop-blur-sm">
              <div className="flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mouse w-4 h-4">
                  <rect x="5" y="2" width="14" height="20" rx="7"></rect>
                  <path d="M12 6v4"></path>
                </svg>
                <span className="mono">Scroll down</span>
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <span className="mono">6 Releases</span>
            </div>
          </div>

          <div className="w-full relative z-10 flex-1 flex items-center">
            <div className="w-full h-full flex items-center">
              <div className="track flex gap-6 md:gap-12 md:px-12 transition-transform duration-100 ease-out will-change-transform w-max pr-6 pl-6 gap-x-6 gap-y-6" id="track-emq">


                <figure className="frame w-[85vw] md:w-[60vw] lg:w-[45vw] h-[45vh] md:h-[65vh] relative group overflow-hidden rounded-none bg-[#0a0a0a] shrink-0 border border-white/10 clip-poly-1 cursor-pointer">
        <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/209e95ca-3a3d-472d-aba2-2a118159d77a_1600w.png" alt="Wood letterpress type sorted in a case" loading="eager" className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700">
        </div>

        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between pointer-events-none">
          <div className="flex justify-between items-start w-full transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out delay-100">
            <span className="text-[10px] tracking-[0.2em] font-extralight text-[#ff5a00] border border-[#ff5a00]/30 rounded-full px-4 py-2 uppercase bg-[#ff5a00]/10 backdrop-blur-md font-dm-sans">
                        Release
                      </span>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right w-4 h-4 text-white">
                <path d="M7 7h10v10"></path>
                <path d="M7 17 17 7"></path>
              </svg>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
            <div className="flex flex-col gap-3">
              <span className="num text-5xl md:text-7xl tracking-tight font-dm-serif-display font-extralight text-transparent group-hover:text-white transition-colors duration-700 leading-none" style={{"WebkitTextStroke": "1px rgba(255,255,255,0.2)"}}>01</span>
              <figcaption className="cap text-2xl md:text-4xl tracking-tight font-dm-serif-display font-extralight text-white max-w-sm leading-[1.1]">
                Nexus Studio, motion capture room
              </figcaption>
            </div>
          </div>
        </div>
      </figure>


                <figure className="frame w-[85vw] md:w-[50vw] lg:w-[35vw] h-[45vh] md:h-[65vh] relative group overflow-hidden rounded-none bg-[#0a0a0a] shrink-0 border border-white/10 md:mt-24 clip-poly-1 cursor-pointer">
                  <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/73a2b092-3a30-457c-b3fe-b170bf276c61_1600w.png" alt="Poster wall" loading="lazy" className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700">
                  </div>

                  <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between pointer-events-none">
                    <div className="flex justify-between items-start w-full transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out delay-100">
                      <span className="text-[10px] tracking-[0.2em] font-extralight text-[#ff5a00] border border-[#ff5a00]/30 rounded-full px-4 py-2 uppercase bg-[#ff5a00]/10 backdrop-blur-md font-dm-sans">
                        Release
                      </span>
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right w-4 h-4 text-white">
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                      <div className="flex flex-col gap-3">
                        <span className="num text-5xl md:text-7xl tracking-tight font-dm-serif-display font-extralight text-transparent group-hover:text-white transition-colors duration-700 leading-none" style={{"WebkitTextStroke": "1px rgba(255,255,255,0.2)"}}>02</span>
                        <figcaption className="cap text-2xl md:text-4xl tracking-tight font-dm-serif-display font-extralight text-white max-w-sm leading-[1.1]">
                          Neon Cyberpunk, level design
                        </figcaption>
                      </div>
                    </div>
                  </div>
                </figure>


                <figure className="frame w-[85vw] md:w-[45vw] lg:w-[30vw] h-[45vh] md:h-[65vh] relative group overflow-hidden rounded-none bg-[#0a0a0a] shrink-0 border border-white/10 clip-poly-1 cursor-pointer">
                  <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/9d785976-3ca2-4921-b23d-c610cc232c55_1600w.png" alt="Stack of printed magazines" loading="lazy" className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700">
                  </div>

                  <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between pointer-events-none">
                    <div className="flex justify-between items-start w-full transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out delay-100">
                      <span className="text-[10px] tracking-[0.2em] font-extralight text-[#ff5a00] border border-[#ff5a00]/30 rounded-full px-4 py-2 uppercase bg-[#ff5a00]/10 backdrop-blur-md font-dm-sans">
                        Release
                      </span>
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right w-4 h-4 text-white">
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                      <div className="flex flex-col gap-3">
                        <span className="num text-5xl md:text-7xl tracking-tight font-dm-serif-display font-extralight text-transparent group-hover:text-white transition-colors duration-700 leading-none" style={{"WebkitTextStroke": "1px rgba(255,255,255,0.2)"}}>03</span>
                        <figcaption className="cap text-2xl md:text-4xl tracking-tight font-dm-serif-display font-extralight text-white max-w-sm leading-[1.1]">
                          Tactical Assault, alpha build
                        </figcaption>
                      </div>
                    </div>
                  </div>
                </figure>


                <figure className="frame w-[85vw] md:w-[60vw] lg:w-[45vw] h-[45vh] md:h-[65vh] relative group overflow-hidden rounded-none bg-[#0a0a0a] shrink-0 border border-white/10 md:mt-16 clip-poly-1 cursor-pointer">
                  <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c5ad6aa3-deb8-4c1b-8615-6f87bd23dc01_1600w.png" alt="Neon sign typography" loading="lazy" className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700">
                  </div>

                  <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between pointer-events-none">
                    <div className="flex justify-between items-start w-full transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out delay-100">
                      <span className="text-[10px] tracking-[0.2em] font-extralight text-[#ff5a00] border border-[#ff5a00]/30 rounded-full px-4 py-2 uppercase bg-[#ff5a00]/10 backdrop-blur-md font-dm-sans">
                        Release
                      </span>
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right w-4 h-4 text-white">
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                      <div className="flex flex-col gap-3">
                        <span className="num text-5xl md:text-7xl tracking-tight font-dm-serif-display font-extralight text-transparent group-hover:text-white transition-colors duration-700 leading-none" style={{"WebkitTextStroke": "1px rgba(255,255,255,0.2)"}}>04</span>
                        <figcaption className="cap text-2xl md:text-4xl tracking-tight font-dm-serif-display font-extralight text-white max-w-sm leading-[1.1]">
                          Sci-Fi HUD, prototype
                        </figcaption>
                      </div>
                    </div>
                  </div>
                </figure>


                <figure className="frame w-[85vw] md:w-[50vw] lg:w-[40vw] h-[45vh] md:h-[65vh] relative group overflow-hidden rounded-none bg-[#0a0a0a] clip-poly-1 shrink-0 border border-white/10 cursor-pointer">
                  <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/59a5f97c-0c0e-449f-bd9f-a0ee96e5c61b_1600w.png" alt="Open magazine editorial spread" loading="lazy" className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700">
                  </div>

                  <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between pointer-events-none">
                    <div className="flex justify-between items-start w-full transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out delay-100">
                      <span className="text-[10px] tracking-[0.2em] font-extralight text-[#ff5a00] border border-[#ff5a00]/30 rounded-full px-4 py-2 uppercase bg-[#ff5a00]/10 backdrop-blur-md font-dm-sans">
                        Release
                      </span>
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right w-4 h-4 text-white">
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                      <div className="flex flex-col gap-3">
                        <span className="num text-5xl md:text-7xl tracking-tight font-dm-serif-display font-extralight text-transparent group-hover:text-white transition-colors duration-700 leading-none" style={{"WebkitTextStroke": "1px rgba(255,255,255,0.2)"}}>05</span>
                        <figcaption className="cap text-2xl md:text-4xl tracking-tight font-dm-serif-display font-extralight text-white max-w-sm leading-[1.1]">
                          Fantasy RPG, environment art
                        </figcaption>
                      </div>
                    </div>
                  </div>
                </figure>


                <figure className="frame w-[85vw] md:w-[60vw] lg:w-[45vw] h-[45vh] md:h-[65vh] relative group overflow-hidden rounded-none bg-[#0a0a0a] shrink-0 border border-white/10 md:mt-24 clip-poly-1 cursor-pointer">
        <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/d7626a20-b23f-42d3-8906-80514ee004da_1600w.png" alt="Letterpress print detail" loading="lazy" className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700">
        </div>

        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between pointer-events-none">
          <div className="flex justify-between items-start w-full transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out delay-100">
            <span className="text-[10px] tracking-[0.2em] font-extralight text-[#ff5a00] border border-[#ff5a00]/30 rounded-full px-4 py-2 uppercase bg-[#ff5a00]/10 backdrop-blur-md font-dm-sans">
                        Release
                      </span>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right w-4 h-4 text-white">
                <path d="M7 7h10v10"></path>
                <path d="M7 17 17 7"></path>
              </svg>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
            <div className="flex flex-col gap-3">
              <span className="num text-5xl md:text-7xl tracking-tight font-dm-serif-display font-extralight text-transparent group-hover:text-white transition-colors duration-700 leading-none" style={{"WebkitTextStroke": "1px rgba(255,255,255,0.2)"}}>06</span>
              <figcaption className="cap text-2xl md:text-4xl tracking-tight font-dm-serif-display font-extralight text-white max-w-sm leading-[1.1]">
                VR Arcade, multiplayer setup
              </figcaption>
            </div>
          </div>
        </div>
      </figure>

              </div>
            </div>
          </div>
        </div>


      </section>


            <section className="py-24 px-6 md:px-12 w-full bg-[#e8e6e1]">
              <div className="grid grid-cols-12 gap-6 items-center">
                <div className="col-span-12 md:col-span-4 flex flex-col gap-12 gs-reveal">
                  <div className="flex items-baseline gap-2 text-5xl tracking-tight font-dm-serif-display font-normal">
                    01
                    <span className="text-xl text-gray-400 font-dm-serif-display font-normal">
                      /8
                    </span>
                  </div>

                  <div className="">
                    <div className="text-sm font-normal tracking-tight font-dm-sans">
                      [Sarah Jenkins]
                    </div>
                    <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-dm-sans">
                      VR Gaming Monthly
                    </div>
                  </div>

                  <div className="w-3/4 aspect-square clip-poly-3 overflow-hidden">
                    <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/6dc9c198-a556-4dd3-b5b7-0e7e0d1828f4_3840w.png" className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80" />
                  </div>
                </div>

                <div className="col-span-12 md:col-span-8 flex flex-col justify-center gs-reveal">
                  <div className="text-xs text-gray-400 uppercase tracking-widest mb-12 font-dm-sans">
                    [Testimonial]
                  </div>

                  <div className="relative">
                    <div className="absolute -top-8 -left-8 text-6xl text-[#ff5a00] font-dm-serif-display font-normal">
                      "
                    </div>
                    <h3 className="text-3xl md:text-5xl tracking-tight leading-tight text-[#111] font-dm-serif-display font-normal">
                      The attention to spatial presence is absolutely perfect! From
                      the haptic feedback to the flawless geometry every interaction
                      feels premium. This agency has completely transformed my
                      approach to VR design.
                    </h3>
                  </div>

                  <div className="mt-16 flex items-center gap-4">
                    <div className="flex text-[#ff5a00] gap-1">
                      <iconify-icon icon="solar:star-bold"></iconify-icon>
                      <iconify-icon icon="solar:star-bold"></iconify-icon>
                      <iconify-icon icon="solar:star-bold"></iconify-icon>
                      <iconify-icon icon="solar:star-bold"></iconify-icon>
                      <iconify-icon icon="solar:star-bold"></iconify-icon>
                    </div>
                    <div className="text-xs font-normal font-dm-sans">
                      5.0 (49 Reviews)
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="py-24 md:py-32 px-6 md:px-12 w-full bg-[#111] text-white relative z-20 overflow-hidden">
              <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#ff5a00]/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

              <div className="grid grid-cols-12 gap-6 md:gap-12 relative z-10 max-w-[120rem] mx-auto">
                <div className="col-span-12 md:col-span-5 flex flex-col justify-between">
                  <div className="">
                    <div className="text-xs font-light tracking-widest uppercase text-white/50 mb-12 flex items-center gap-3 font-dm-sans">
                      <span className="w-2 h-2 rounded-full bg-[#ff5a00]"></span>
                      [ System Architecture ]
                    </div>
                    <h2 className="text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] font-dm-serif-display font-normal" style={{"fontFamily": "'DM Serif Display', serif"}}>
                      Engineered for
                      <br />
                      absolute immersion.
                    </h2>
                    <p className="mt-8 text-sm md:text-base text-white/60 font-light leading-relaxed max-w-md font-dm-sans">
                      Our proprietary engine leverages hardware acceleration and
                      neural predictive rendering to achieve zero-latency sensory
                      feedback across all interconnected domains.
                    </p>
                  </div>

                  <div className="hidden md:flex flex-col mt-24 gap-6">
                    <div className="w-full h-px bg-white/10 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-[1px] bg-[#ff5a00]"></div>
                    </div>
                    <div className="flex justify-between items-center text-xs font-light tracking-widest text-white/40 uppercase">
                      <span className="font-dm-sans">Core Bandwidth</span>
                      <span className="text-white font-dm-sans">1.2 TB/s</span>
                    </div>

                    <div className="w-full h-px bg-white/10 relative mt-4">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[85%] h-[1px] bg-white"></div>
                    </div>
                    <div className="flex justify-between items-center text-xs font-light tracking-widest text-white/40 uppercase">
                      <span className="font-dm-sans">Server Uptime</span>
                      <span className="text-white font-dm-sans">99.99%</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-7 mt-16 md:mt-0 flex flex-col">
                  <div className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden group rounded-sm bg-[#1a1a1a]">
                    <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/48bee0b9-ab9b-4a3c-83d9-f274e4e88063_3840w.png?w=800&amp;q=80" alt="Hardware integration" className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000 ease-in-out" />
                    <div className="absolute inset-0 border border-white/10 pointer-events-none mix-blend-overlay"></div>

                    <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 bg-black/80 backdrop-blur-xl border border-white/10 p-6 flex flex-col gap-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                      <div className="flex justify-between items-center pb-4 border-b border-white/10">
                        <span className="text-xs font-light uppercase tracking-widest text-white/50 flex items-center gap-2 font-dm-sans">
                          <i data-lucide="zap" className="w-6 h-6 text-cyan-400"></i>
                          System Link
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" checked="" />
                          <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff5a00]"></div>
                        </label>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-light tracking-wide text-white/70 font-dm-sans">
                            Overdrive Allocation
                          </span>
                          <span className="text-lg tracking-tighter font-light font-dm-sans" style={{"fontFamily": "'DM Serif Display', serif"}}>
                            84%
                          </span>
                        </div>
                        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden flex relative">
                          <div className="h-full bg-[#ff5a00] w-[84%] relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 flex flex-col w-full border-t border-white/10">
                    <div className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-white/10 cursor-pointer hover:bg-white/[0.02] transition-colors px-4 -mx-4 md:px-6 md:-mx-6">
                      <div className="flex items-center gap-8">
                        <span className="text-xs font-thin text-white/30 group-hover:text-[#ff5a00] transition-colors w-6 font-dm-sans">
                          01
                        </span>
                        <h3 className="text-2xl md:text-4xl tracking-tighter text-white/80 group-hover:text-white transition-colors flex items-center gap-4 font-dm-serif-display font-normal" style={{"fontFamily": "'DM Serif Display', serif"}}>
                          Neural Rendering
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-lucide="arrow-up-right" aria-hidden="true" className="lucide lucide-arrow-up-right w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#ff5a00]"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
                        </h3>
                      </div>
                      <div className="mt-4 md:mt-0 ml-14 md:ml-0 text-sm text-white/40 font-light max-w-[16rem] transition-colors group-hover:text-white/70 font-dm-sans">
                        AI-driven pixel prediction ensuring flawless 120FPS native
                        output.
                      </div>
                    </div>

                    <div className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-white/10 cursor-pointer hover:bg-white/[0.02] transition-colors px-4 -mx-4 md:px-6 md:-mx-6">
                      <div className="flex items-center gap-8">
                        <span className="text-xs font-thin text-white/30 group-hover:text-[#ff5a00] transition-colors w-6 font-dm-sans">
                          02
                        </span>
                        <h3 className="text-2xl md:text-4xl tracking-tighter text-white/80 group-hover:text-white transition-colors flex items-center gap-4 font-dm-serif-display font-normal" style={{"fontFamily": "'DM Serif Display', serif"}}>
                          Haptic Sub-systems
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-lucide="arrow-up-right" aria-hidden="true" className="lucide lucide-arrow-up-right w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#ff5a00]"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
                        </h3>
                      </div>
                      <div className="mt-4 md:mt-0 ml-14 md:ml-0 text-sm text-white/40 font-light max-w-[16rem] transition-colors group-hover:text-white/70 font-dm-sans">
                        Micro-vibration mapping synchronized across 400+ sensory
                        points.
                      </div>
                    </div>

                    <div className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-white/10 cursor-pointer hover:bg-white/[0.02] transition-colors px-4 -mx-4 md:px-6 md:-mx-6">
                      <div className="flex items-center gap-8">
                        <span className="text-xs font-thin text-white/30 group-hover:text-[#ff5a00] transition-colors w-6 font-dm-sans">
                          03
                        </span>
                        <h3 className="text-2xl md:text-4xl tracking-tighter text-white/80 group-hover:text-white transition-colors flex items-center gap-4 font-dm-serif-display font-normal" style={{"fontFamily": "'DM Serif Display', serif"}}>
                          Spatial Acoustics
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-lucide="arrow-up-right" aria-hidden="true" className="lucide lucide-arrow-up-right w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#ff5a00]"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
                        </h3>
                      </div>
                      <div className="mt-4 md:mt-0 ml-14 md:ml-0 text-sm text-white/40 font-light max-w-[16rem] transition-colors group-hover:text-white/70 font-dm-sans">
                        Ray-traced audio dynamically rebounding off virtual geometry.
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </section>

          </main>
          <footer className="w-full bg-[#050505] text-white pt-24 pb-12 px-6 md:px-12 border-t border-white/5 relative z-20 overflow-hidden">
            <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-6 mb-24 relative z-10">
              <div className="col-span-1 md:col-span-6 flex flex-col">
                <div className="text-4xl tracking-tighter uppercase font-dm-serif-display font-normal mb-6">
                  AURA
                </div>
                <p className="text-white/50 text-sm max-w-sm font-dm-sans leading-relaxed">
                  Crafting next-generation virtual reality experiences. We build
                  immersive worlds where imagination meets cutting-edge technology.
                </p>
              </div>
              <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
                <h4 className="text-xs font-normal uppercase tracking-widest text-white/30 mb-2 font-dm-sans">
                  Navigation
                </h4>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors font-dm-sans">
                  Games
                </a>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors font-dm-sans">
                  Studios
                </a>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors font-dm-sans">
                  Tech
                </a>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors font-dm-sans">
                  Case Studies
                </a>
              </div>
              <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
                <h4 className="text-xs font-normal uppercase tracking-widest text-white/30 mb-2 font-dm-sans">
                  Connect
                </h4>
                <a href="#" className="text-sm text-white/60 hover:text-cyan-400 transition-colors font-dm-sans">
                  Twitter / X
                </a>
                <a href="#" className="text-sm text-white/60 hover:text-cyan-400 transition-colors font-dm-sans">
                  Discord
                </a>
                <a href="#" className="text-sm text-white/60 hover:text-cyan-400 transition-colors font-dm-sans">
                  Instagram
                </a>
                <a href="#" className="text-sm text-white/60 hover:text-cyan-400 transition-colors font-dm-sans">
                  Contact
                </a>
              </div>
            </div>

            <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 relative z-10">
              <p className="text-xs text-white/40 font-dm-sans">
                © 2024 Aura VR. All rights reserved.
              </p>
              <div className="flex items-center gap-6 mt-4 md:mt-0">
                <a href="#" className="text-xs text-white/40 hover:text-white transition-colors font-dm-sans">
                  Privacy Policy
                </a>
                <a href="#" className="text-xs text-white/40 hover:text-white transition-colors font-dm-sans">
                  Terms of Service
                </a>
              </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] bg-cyan-400/5 rounded-full blur-[120px] pointer-events-none translate-y-1/2 z-0"></div>
          </footer>
    </div>
  );
}
