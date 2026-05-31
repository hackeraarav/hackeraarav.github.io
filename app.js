/**
 * SPIDER-VERSE MULTIVERSE PORTFOLIO ENGINE
 * Author: Aarav Tatiya
 */

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================================================
    // 1. STATE & GLOBAL CONFIG
    // ==========================================================================
    const state = {
        currentDimension: 'prime', // prime, 1610, 65, 928, 42
        loaderActive: true,
        focusedFragment: null,
        fusedSkills: new Set()
    };

    // Dimension specific properties
    const dimensionInfo = {
        prime: { suffix: "PRIME", fileCode: "FILE: EARTH-PRIME // SUBJECT: AARAV_TATIYA", title: "AARAV TATIYA", tagline: "AI & ML Student | Building Projects in Gen AI Tool / Front-End Development" },
        1610: { suffix: "EARTH-1610", fileCode: "FILE: EARTH-1610 // SUBJECT: SPIDER_ML", title: "AARAV TATIYA", tagline: "AI ENGINEER // Training neural networks that see patterns across dimensions." },
        65: { suffix: "EARTH-65", fileCode: "FILE: EARTH-065 // SUBJECT: SPIDER_GENAI", title: "AARAV.TATIYA", tagline: "GENAI DEV // Scanlines, CRT flicker, terminal prompt interfaces." },
        928: { suffix: "EARTH-928", fileCode: "FILE: EARTH-928 // SUBJECT: SPIDER_CODER", title: "AARAV-TATIYA", tagline: "DATA STRATEGIST // Holographic wireframes, data streams, analytics HUDs." },
        42: { suffix: "EARTH-42", fileCode: "FILE: EARTH-042 // SUBJECT: CREATIVE_CODE", title: "aarav_tatiya", tagline: "CREATIVE CODER // Watercolor washes, pencil sketches, AI art as canvas ink." }
    };


    // ==========================================================================
    // 1.5 BACKGROUND MUSIC SYSTEM (Page-wise tracks)
    // ==========================================================================
    const bgAudio = new Audio();
    bgAudio.loop = true;
    bgAudio.volume = 0; // Start at 0 for fade in
    
    let isMusicMuted = localStorage.getItem("bg-music-muted") === "false" ? false : true;
    let fadeInterval = null;

    function fadeAudio(audio, targetVolume, duration, callback) {
        if (fadeInterval) clearInterval(fadeInterval);
        const startVolume = audio.volume;
        const steps = 15;
        const stepTime = duration / steps;
        const volumeDelta = (targetVolume - startVolume) / steps;
        let currentStep = 0;

        fadeInterval = setInterval(() => {
            audio.volume = Math.max(0, Math.min(0.4, audio.volume + volumeDelta));
            currentStep++;
            if (currentStep >= steps) {
                audio.volume = targetVolume;
                clearInterval(fadeInterval);
                fadeInterval = null;
                if (callback) callback();
            }
        }, stepTime);
    }

    function getTrackSrc(dimId) {
        const ext = dimId === '1610' ? 'wav' : 'mp3';
        return `assets/bg_${dimId}.${ext}`;
    }

    function playDimensionTrack(dimId) {
        const src = getTrackSrc(dimId);
        
        // Prevent reloading if already loaded/loading
        if (bgAudio.src && bgAudio.src.indexOf(src) !== -1) return;

        if (isMusicMuted) {
            bgAudio.src = src;
            bgAudio.load();
            return;
        }

        // Fade out active track
        fadeAudio(bgAudio, 0, 400, () => {
            bgAudio.src = src;
            bgAudio.load();
            bgAudio.play().then(() => {
                fadeAudio(bgAudio, 0.4, 600);
            }).catch(err => {
                console.warn("Background music play failed:", err);
            });
        });
    }

    // Configure music toggle button
    const musicBtn = document.getElementById("music-toggle-btn");
    if (musicBtn) {
        if (isMusicMuted) {
            musicBtn.classList.add("muted");
        } else {
            musicBtn.classList.remove("muted");
        }

        musicBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            isMusicMuted = !isMusicMuted;
            localStorage.setItem("bg-music-muted", isMusicMuted);
            playSound('thwip');

            if (isMusicMuted) {
                musicBtn.classList.add("muted");
                fadeAudio(bgAudio, 0, 300, () => {
                    bgAudio.pause();
                });
            } else {
                musicBtn.classList.remove("muted");
                const src = getTrackSrc(state.currentDimension);
                if (!bgAudio.src || bgAudio.src.indexOf(src) === -1) {
                    bgAudio.src = src;
                    bgAudio.load();
                }
                bgAudio.play().then(() => {
                    fadeAudio(bgAudio, 0.4, 500);
                }).catch(err => {
                    console.warn("Play failed on user toggle:", err);
                });
            }
        });
    }

    // Autoplay trigger on user interaction
    function firstUserInteraction() {
        document.removeEventListener("click", firstUserInteraction);
        document.removeEventListener("keydown", firstUserInteraction);
        
        if (!isMusicMuted && bgAudio.paused) {
            const src = getTrackSrc(state.currentDimension);
            bgAudio.src = src;
            bgAudio.load();
            bgAudio.play().then(() => {
                bgAudio.volume = 0;
                fadeAudio(bgAudio, 0.4, 1000);
            }).catch(err => {
                console.warn("Autoplay block after interaction:", err);
            });
        }
    }
    document.addEventListener("click", firstUserInteraction);
    document.addEventListener("keydown", firstUserInteraction);

    // ==========================================================================
    // 2. WEB AUDIO API SYNTHESIZER (No external files!)
    // ==========================================================================
    let audioCtx = null;
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playSound(type) {
        try {
            initAudio();
            const now = audioCtx.currentTime;
            
            switch (type) {
                case 'thwip': {
                    // Quick high-tech web shoot sound
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(120, now);
                    osc.frequency.exponentialRampToValueAtTime(3200, now + 0.12);
                    
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
                    
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now);
                    osc.stop(now + 0.12);
                    break;
                }
                case 'swoosh': {
                    // Analog comic whoosh
                    const bufferSize = audioCtx.sampleRate * 0.2;
                    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < bufferSize; i++) {
                        data[i] = Math.random() * 2 - 1;
                    }
                    const noise = audioCtx.createBufferSource();
                    noise.buffer = buffer;

                    const filter = audioCtx.createBiquadFilter();
                    filter.type = 'bandpass';
                    filter.frequency.setValueAtTime(400, now);
                    filter.frequency.exponentialRampToValueAtTime(1800, now + 0.2);

                    const gain = audioCtx.createGain();
                    gain.gain.setValueAtTime(0.25, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

                    noise.connect(filter);
                    filter.connect(gain);
                    gain.connect(audioCtx.destination);
                    noise.start(now);
                    noise.stop(now + 0.2);
                    break;
                }
                case 'beep': {
                    // Digital retro terminal beep
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(950, now);
                    
                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                    
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now);
                    osc.stop(now + 0.08);
                    break;
                }
                case 'access': {
                    // Cyber HUD validation chord
                    const osc1 = audioCtx.createOscillator();
                    const osc2 = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    
                    osc1.type = 'sine';
                    osc1.frequency.setValueAtTime(523.25, now); // C5
                    osc2.type = 'sine';
                    osc2.frequency.setValueAtTime(659.25, now); // E5
                    
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
                    
                    osc1.connect(gain);
                    osc2.connect(gain);
                    gain.connect(audioCtx.destination);
                    
                    osc1.start(now);
                    osc2.start(now);
                    osc1.stop(now + 0.25);
                    osc2.stop(now + 0.25);
                    break;
                }
                case 'swish': {
                    // Fluid watercolor brush swipe sound
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(800, now);
                    osc.frequency.linearRampToValueAtTime(150, now + 0.35);
                    
                    gain.gain.setValueAtTime(0.18, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
                    
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now);
                    osc.stop(now + 0.35);
                    break;
                }
                case 'glitch': {
                    // Crashing dimensional glitch static
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(60, now);
                    osc.frequency.setValueAtTime(Math.random() * 1200 + 100, now + 0.04);
                    osc.frequency.setValueAtTime(200, now + 0.08);
                    
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.setValueAtTime(0.05, now + 0.04);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                    
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now);
                    osc.stop(now + 0.15);
                    break;
                }
                case 'portal': {
                    // Deep drone explosion for portal tearing
                    const osc = audioCtx.createOscillator();
                    const oscGlitch = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(50, now);
                    osc.frequency.linearRampToValueAtTime(120, now + 0.5);
                    
                    oscGlitch.type = 'triangle';
                    oscGlitch.frequency.setValueAtTime(280, now);
                    oscGlitch.frequency.setValueAtTime(900, now + 0.1);
                    oscGlitch.frequency.setValueAtTime(110, now + 0.25);
                    
                    gain.gain.setValueAtTime(0.4, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
                    
                    osc.connect(gain);
                    oscGlitch.connect(gain);
                    gain.connect(audioCtx.destination);
                    
                    osc.start(now);
                    oscGlitch.start(now);
                    osc.stop(now + 0.5);
                    oscGlitch.stop(now + 0.5);
                    break;
                }
            }
        } catch (e) {
            console.log("Audio synthesis blocked or unsupported: ", e);
        }
    }

    // Attach sound effects to standard controls
    const triggerAudioButtons = document.querySelectorAll(".skip-loader-btn, .theme-toggle-btn, .hire-me-btn");
    triggerAudioButtons.forEach(btn => {
        btn.addEventListener("click", () => playSound('thwip'));
    });

    // ==========================================================================
    // 3. MULTIVERSE STATE MANAGER & SCREEN TEAR
    // ==========================================================================
    const tearOverlay = document.getElementById("dimensional-tear-overlay");
    const dropdownBtn = document.getElementById("variant-selector-btn");
    const dropdownList = document.getElementById("variant-dropdown");
    const navSuffix = document.getElementById("nav-brand-suffix");
    const brandTitle = document.getElementById("nav-brand-title");

    function setDimension(dimId) {
        if (state.currentDimension === dimId) return;
        
        playSound('portal');
        
        const video = document.getElementById("portal-transition-video");
        
        function applyDimensionSwap(targetDim) {
            // Apply body classes
            document.body.className = document.body.className.replace(/\bdim-\S+/g, '');
            document.body.classList.add(`dim-${targetDim}`);
            state.currentDimension = targetDim;
            
            // Swap background music track
            playDimensionTrack(targetDim);
            
            // Update dropdown values
            const selectedInfo = dimensionInfo[targetDim];
            if (navSuffix) navSuffix.textContent = selectedInfo.suffix;
            const idSpan = dropdownBtn.querySelector(".selector-id");
            if (idSpan) idSpan.textContent = `EARTH-${targetDim.toUpperCase()}`;
            
            // Glitch text items in Hero
            const fileCodeEl = document.getElementById("hero-file-code");
            const mainTitleEl = document.getElementById("hero-main-title");
            const taglineEl = document.getElementById("hero-tagline-text");
            const roleEl = document.getElementById("role-text");
            
            if (fileCodeEl) fileCodeEl.textContent = selectedInfo.fileCode;
            if (mainTitleEl) {
                mainTitleEl.textContent = selectedInfo.title;
                mainTitleEl.setAttribute("data-text", selectedInfo.title);
            }
            if (taglineEl) taglineEl.textContent = selectedInfo.tagline;
            
            // Set dynamic role suffix
            if (roleEl) {
                const suffixes = { prime: "SPIDER-ML", 1610: "SPIDER-ENGINEER", 65: "SPIDER-GENAI", 928: "SPIDER-CODER", 42: "SPIDER-CREATIVE" };
                roleEl.textContent = suffixes[targetDim];
            }

            // Sync about origin buttons
            const activeOriginBtn = document.querySelector(`.origin-btn[data-origin="${targetDim}"]`);
            if (activeOriginBtn) {
                document.querySelectorAll(".origin-btn").forEach(b => b.classList.remove("active"));
                activeOriginBtn.classList.add("active");
                renderOriginStory(targetDim);
            }
            
            // Sync dropdown links active states
            document.querySelectorAll(".dropdown-item").forEach(item => {
                if (item.getAttribute("data-dimension") === targetDim) {
                    item.classList.add("active");
                } else {
                    item.classList.remove("active");
                }
            });

            // If in skills section, trigger skills canvas reset to match active dimension
            initGooberPhysics();

            // Set dynamic background portal preview subject
            const previewSubj = document.getElementById("preview-val-subject");
            if (previewSubj) {
                previewSubj.textContent = `Earth-${targetDim.toUpperCase()}`;
            }

            // Custom cursor styling transition
            const pointer = document.getElementById("web-pointer");
            if (pointer) {
                if (targetDim !== 'prime') {
                    pointer.classList.add("portal-cursor");
                } else {
                    pointer.classList.remove("portal-cursor");
                }
            }
        }

        if (video) {
            video.style.display = "block";
            video.currentTime = 0;
            
            tearOverlay.classList.add("ripping");
            
            video.play().then(() => {
                const duration = video.duration || 1.5;
                const swapDelay = Math.min((duration * 0.45) * 1000, 700);
                
                setTimeout(() => {
                    applyDimensionSwap(dimId);
                }, swapDelay);

                video.onended = () => {
                    video.style.display = "none";
                    tearOverlay.classList.remove("ripping");
                };
            }).catch(err => {
                console.warn("Video play failed, falling back to CSS tear transition:", err);
                video.style.display = "none";
                runCSSTearFallback();
            });
        } else {
            runCSSTearFallback();
        }

        function runCSSTearFallback() {
            tearOverlay.classList.add("ripping");
            setTimeout(() => {
                applyDimensionSwap(dimId);
            }, 250);
            setTimeout(() => {
                tearOverlay.classList.remove("ripping");
            }, 750);
        }
    }

    // Dropdown interaction
    if (dropdownBtn) {
        dropdownBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownList.classList.toggle("active");
            dropdownBtn.setAttribute("aria-expanded", dropdownList.classList.contains("active"));
            playSound('thwip');
        });
    }

    document.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", () => {
            const targetDim = item.getAttribute("data-dimension");
            setDimension(targetDim);
            dropdownList.classList.remove("active");
            dropdownBtn.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("click", () => {
        if (dropdownList) dropdownList.classList.remove("active");
        if (dropdownBtn) dropdownBtn.setAttribute("aria-expanded", "false");
    });

    // ==========================================================================
    // 4. ANIMATED CANVAS REALITIES WEB BACKGROUND
    // ==========================================================================
    const canvas = document.getElementById("web-canvas");
    const ctx = canvas.getContext("2d");
    
    let points = [];
    const maxPoints = 65;
    const connectionRadius = 110;
    let pointerPos = { x: null, y: null };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mouseleave", () => {
        pointerPos.x = null;
        pointerPos.y = null;
    });
    resizeCanvas();

    // Initialize background coordinates
    for (let i = 0; i < maxPoints; i++) {
        points.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.9,
            vy: (Math.random() - 0.5) * 0.9,
            baseRadius: Math.random() * 2 + 1,
            char: String.fromCharCode(Math.random() > 0.5 ? 48 + Math.floor(Math.random()*10) : 65 + Math.floor(Math.random()*26))
        });
    }

    // Canvas Background drawing loop
    function drawRealitiesBackground() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const activeDim = state.currentDimension;

        if (activeDim === 'prime') {
            // Prime style: silver net with subtle red connections on hover
            points.forEach((pt, idx) => {
                pt.x += pt.vx; pt.y += pt.vy;
                if (pt.x < 0 || pt.x > canvas.width) pt.vx *= -1;
                if (pt.y < 0 || pt.y > canvas.height) pt.vy *= -1;

                ctx.beginPath();
                ctx.arc(pt.x, pt.y, pt.baseRadius, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(192, 192, 192, 0.4)";
                ctx.fill();

                // Links
                for (let j = idx + 1; j < points.length; j++) {
                    const opt = points[j];
                    const dist = Math.hypot(pt.x - opt.x, pt.y - opt.y);
                    if (dist < connectionRadius) {
                        ctx.beginPath();
                        ctx.moveTo(pt.x, pt.y);
                        ctx.lineTo(opt.x, opt.y);
                        ctx.strokeStyle = "rgba(192, 192, 192, 0.08)";
                        ctx.lineWidth = 0.55;
                        ctx.stroke();
                    }
                }
                
                // Mouse pull Web
                if (pointerPos.x !== null && pointerPos.y !== null) {
                    const mDist = Math.hypot(pt.x - pointerPos.x, pt.y - pointerPos.y);
                    if (mDist < connectionRadius + 40) {
                        ctx.beginPath();
                        ctx.moveTo(pt.x, pt.y);
                        ctx.lineTo(pointerPos.x, pointerPos.y);
                        ctx.strokeStyle = "rgba(255, 0, 64, 0.2)";
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            });
        } 
        else if (activeDim === '1610') {
            // Earth-1610: Comic book style network, Ben-day coordinates
            ctx.fillStyle = "rgba(255, 230, 0, 0.02)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            points.forEach((pt, idx) => {
                pt.x += pt.vx * 0.7; pt.y += pt.vy * 0.7; // slower stuttery movement
                if (pt.x < 0 || pt.x > canvas.width) pt.vx *= -1;
                if (pt.y < 0 || pt.y > canvas.height) pt.vy *= -1;

                // draw neural nodes as comic circles
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, pt.baseRadius * 2, 0, Math.PI*2);
                ctx.fillStyle = "#FF0040";
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 1.5;
                ctx.fill();
                ctx.stroke();

                for (let j = idx + 1; j < points.length; j++) {
                    const opt = points[j];
                    const dist = Math.hypot(pt.x - opt.x, pt.y - opt.y);
                    if (dist < connectionRadius) {
                        ctx.beginPath();
                        ctx.moveTo(pt.x, pt.y);
                        ctx.lineTo(opt.x, opt.y);
                        ctx.strokeStyle = "#000000";
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                    }
                }
            });
        }
        else if (activeDim === '65') {
            // Earth-65: Neon matrix rain overlay on web nodes
            points.forEach((pt, idx) => {
                pt.y += pt.baseRadius * 1.5; // Rain fall
                if (pt.y > canvas.height) {
                    pt.y = 0;
                    pt.x = Math.random() * canvas.width;
                }

                ctx.font = `${Math.floor(pt.baseRadius * 4 + 8)}px monospace`;
                ctx.fillStyle = "rgba(0, 255, 65, 0.35)";
                ctx.fillText(pt.char, pt.x, pt.y);

                if (Math.random() > 0.985) {
                    pt.char = String.fromCharCode(Math.random() > 0.5 ? 48 + Math.floor(Math.random()*10) : 65 + Math.floor(Math.random()*26));
                }
            });
        }
        else if (activeDim === '928') {
            // Earth-928: futuristic chrome data streams
            ctx.strokeStyle = "rgba(0, 240, 255, 0.05)";
            ctx.lineWidth = 1;
            // Draw schematic HUD lines
            for (let w = 50; w < canvas.width; w += 150) {
                ctx.beginPath();
                ctx.moveTo(w, 0);
                ctx.lineTo(w, canvas.height);
                ctx.stroke();
            }
            
            points.forEach((pt, idx) => {
                pt.x += pt.vx * 1.8; pt.y += pt.vy * 1.8; // Very high speed
                if (pt.x < 0 || pt.x > canvas.width) pt.vx *= -1;
                if (pt.y < 0 || pt.y > canvas.height) pt.vy *= -1;

                ctx.beginPath();
                ctx.arc(pt.x, pt.y, pt.baseRadius, 0, Math.PI*2);
                ctx.fillStyle = "#00F0FF";
                ctx.fill();

                for (let j = idx + 1; j < points.length; j++) {
                    const opt = points[j];
                    const dist = Math.hypot(pt.x - opt.x, pt.y - opt.y);
                    if (dist < connectionRadius - 15) {
                        ctx.beginPath();
                        ctx.moveTo(pt.x, pt.y);
                        ctx.lineTo(opt.x, opt.y);
                        ctx.strokeStyle = "rgba(0, 240, 255, 0.15)";
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });
        }
        else if (activeDim === '42') {
            // Earth-42: Watercolor pencil strokes
            ctx.strokeStyle = "rgba(74, 59, 50, 0.03)";
            ctx.lineWidth = 1.5;
            points.forEach((pt, idx) => {
                pt.x += pt.vx * 0.2; pt.y += pt.vy * 0.2; // Slow sketch drift
                if (pt.x < 0 || pt.x > canvas.width) pt.vx *= -1;
                if (pt.y < 0 || pt.y > canvas.height) pt.vy *= -1;

                // Draw scribbles/pencil paths
                ctx.beginPath();
                ctx.moveTo(pt.x, pt.y);
                ctx.lineTo(pt.x + pt.vx * 30, pt.y + pt.vy * 30);
                ctx.stroke();
            });
        }

        requestAnimationFrame(drawRealitiesBackground);
    }
    drawRealitiesBackground();

    // Track mouse coordinates globally
    window.addEventListener("mousemove", (e) => {
        const x = e.clientX;
        const y = e.clientY;
        pointerPos.x = x;
        pointerPos.y = y;

        // Custom Cursor movement
        const pointer = document.getElementById("web-pointer");
        if (pointer) {
            pointer.style.left = `${x}px`;
            pointer.style.top = `${y}px`;
        }

        // Chromatic split offset in Hero portrait on cursor move
        const portraitFrame = document.getElementById("portrait-frame");
        if (portraitFrame) {
            const rect = portraitFrame.getBoundingClientRect();
            const frameCenterX = rect.left + rect.width / 2;
            const frameCenterY = rect.top + rect.height / 2;
            
            const deltaX = (x - frameCenterX) / 20;
            const deltaY = (y - frameCenterY) / 20;

            const cyanLayer = document.getElementById("glitch-layer-cyan");
            const magLayer = document.getElementById("glitch-layer-magenta");
            const yelLayer = document.getElementById("glitch-layer-yellow");

            if (cyanLayer && magLayer && yelLayer && state.currentDimension !== 'prime') {
                cyanLayer.style.opacity = "0.75";
                magLayer.style.opacity = "0.75";
                yelLayer.style.opacity = "0.75";
                
                cyanLayer.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                magLayer.style.transform = `translate(${-deltaX * 0.8}px, ${-deltaY * 0.8}px)`;
                yelLayer.style.transform = `translate(${deltaX * 0.5}px, ${-deltaY * 0.5}px)`;
            } else {
                // Clear offset if prime/default
                if (cyanLayer) cyanLayer.style.opacity = "0";
                if (magLayer) magLayer.style.opacity = "0";
                if (yelLayer) yelLayer.style.opacity = "0";
            }

            // Radial Mask tracking for Spider-Man suit reveal
            const isHovering = (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
            const portraitHero = document.getElementById("portrait-hero");
            if (portraitHero) {
                if (isHovering) {
                    const localX = x - rect.left;
                    const localY = y - rect.top;
                    portraitHero.style.setProperty("--mask-x", `${localX}px`);
                    portraitHero.style.setProperty("--mask-y", `${localY}px`);
                    portraitHero.style.setProperty("--mask-radius", `130px`);
                } else {
                    portraitHero.style.setProperty("--mask-radius", `0px`);
                }
            }
        }
    });

    // Touch support for Spider-Man suit reveal on mobile
    window.addEventListener("touchmove", (e) => {
        if (e.touches && e.touches.length > 0) {
            const touch = e.touches[0];
            const x = touch.clientX;
            const y = touch.clientY;
            
            const portraitFrame = document.getElementById("portrait-frame");
            if (portraitFrame) {
                const rect = portraitFrame.getBoundingClientRect();
                const isHovering = (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
                const portraitHero = document.getElementById("portrait-hero");
                if (portraitHero && isHovering) {
                    const localX = x - rect.left;
                    const localY = y - rect.top;
                    portraitHero.style.setProperty("--mask-x", `${localX}px`);
                    portraitHero.style.setProperty("--mask-y", `${localY}px`);
                    portraitHero.style.setProperty("--mask-radius", `130px`);
                } else if (portraitHero) {
                    portraitHero.style.setProperty("--mask-radius", `0px`);
                }
            }
        }
    }, { passive: true });

    window.addEventListener("touchend", () => {
        const portraitHero = document.getElementById("portrait-hero");
        if (portraitHero) {
            portraitHero.style.setProperty("--mask-radius", `0px`);
        }
    });

    // ==========================================================================
    // 5. HERO SECTION: PORTRAIT CLICK AND CARD SELECTORS
    // ==========================================================================
    const heroPortrait = document.getElementById("portrait-frame");
    const orbitCards = document.querySelectorAll(".variant-orbit-card");
    const portalCta = document.getElementById("portal-cta-btn");

    if (heroPortrait) {
        heroPortrait.addEventListener("click", () => {
            playSound('glitch');
            // Cycle between dimensions
            const dims = ['prime', '1610', '65', '928', '42'];
            const nextIdx = (dims.indexOf(state.currentDimension) + 1) % dims.length;
            setDimension(dims[nextIdx]);
        });
    }

    orbitCards.forEach(card => {
        card.addEventListener("click", () => {
            const chosenDim = card.getAttribute("data-dimension");
            setDimension(chosenDim);
        });
        card.addEventListener("mouseenter", () => {
            playSound('swoosh');
        });
    });

    if (portalCta) {
        portalCta.addEventListener("click", () => {
            playSound('portal');
            // Scale and blur effect before smooth scroll
            document.body.style.filter = "blur(15px) scale(1.1)";
            document.body.style.transition = "filter 0.4s, transform 0.4s";
            
            setTimeout(() => {
                document.body.style.filter = "none";
                document.body.style.transform = "none";
                document.getElementById("work-section").scrollIntoView({ behavior: 'smooth' });
            }, 500);
        });
    }

    // ==========================================================================
    // 6. WORK SECTION: MULTIVERSE ARCHIVE AND TABS
    // ==========================================================================
    const folderTabs = document.querySelectorAll(".folder-tab");
    const projectCards = document.querySelectorAll(".comic-panel-card");

    folderTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            playSound('thwip');
            
            folderTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const filterVal = tab.getAttribute("data-filter");

            projectCards.forEach(card => {
                const cardCat = card.getAttribute("data-category");
                
                if (filterVal === "all" || cardCat === filterVal) {
                    card.style.display = "flex";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.85)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 300);
                }
            });
        });
    });

    // CRT matrix rain animation variables for Project 2
    let matrixInterval = null;
    function runCRTMatrixRain() {
        const matrixCanvas = document.querySelector(".matrix-rain-canvas");
        if (!matrixCanvas) return;
        const mCtx = matrixCanvas.getContext("2d");
        
        matrixCanvas.width = matrixCanvas.parentElement.offsetWidth;
        matrixCanvas.height = matrixCanvas.parentElement.offsetHeight;
        
        const charsArr = "01011001010111000101101".split("");
        const fontSize = 11;
        const columns = matrixCanvas.width / fontSize;
        const drops = [];
        for (let x = 0; x < columns; x++) drops[x] = 1;

        if (matrixInterval) clearInterval(matrixInterval);
        
        matrixInterval = setInterval(() => {
            mCtx.fillStyle = "rgba(11, 0, 26, 0.05)";
            mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            
            mCtx.fillStyle = "#00FF41";
            mCtx.font = fontSize + "px monospace";
            
            for (let i = 0; i < drops.length; i++) {
                const text = charsArr[Math.floor(Math.random() * charsArr.length)];
                mCtx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }, 35);
    }
    
    // Trigger CRT matrix once work section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCRTMatrixRain();
            } else {
                if (matrixInterval) clearInterval(matrixInterval);
            }
        });
    }, { threshold: 0.1 });
    
    const workSection = document.getElementById("work-section");
    if (workSection) observer.observe(workSection);

    // Dynamic sounds on project hover
    const projectSounds = { 1: 'swoosh', 2: 'beep', 3: 'access', 4: 'swish' };
    projectCards.forEach(card => {
        const btn = card.querySelector(".view-project-btn");
        if (btn) {
            const projId = btn.getAttribute("data-project-id");
            card.addEventListener("mouseenter", () => {
                playSound(projectSounds[projId]);
            });
        }
    });

    // Project data details models for Modals
    const projectsData = {
        1: {
            title: "Neural Net Prediction Suite",
            category: "PREDICTIVE AI / MACHINE LEARNING (E-1610)",
            desc: "A custom machine learning suite constructed during my AIML Engineering Diploma. The application enables users to upload datasets, configure multi-layered perceptron structures, and visualize boundary decisions in real-time. Built specifically to demonstrate precision classification methods and minimize computation latency.",
            tech: ["Python", "TensorFlow", "Scikit-Learn", "HTML5", "CSS3", "Vanilla JS"],
            stats: { "Model Accuracy": "94%", "Decision Rendering": "60fps", "Dataset Parsing Limit": "100MB" }
        },
        2: {
            title: "Prompt Optimization Engine",
            category: "GENERATIVE AI UTILITY (E-65)",
            desc: "Designed using the PTCF (Profile, Task, Context, Format) framework. This application automates structured prompt creation for engineering tasks. It utilizes LLM pipelines to rewrite loosely structures inputs into highly contextualized prompts, reducing iteration counts for developers.",
            tech: ["Generative AI APIs", "JavaScript", "CSS variables", "Local Storage", "Markdown"],
            stats: { "Response Precision": "40%", "Task Automation Ratio": "85%", "Prompt Library Size": "50+ Templates" }
        },
        3: {
            title: "Stitch Uniform Inventory Manager",
            category: "DATA STRATEGY / FRONT-END BUILD (E-928)",
            desc: "A premium administration dashboard designed for uniform production pipelines. Includes real-time tracking of apparel count, queue status, stitching details, and employee logging. Designed with a custom aesthetic featuring rapid search filters, CSS flex layout grids, and lightweight animations.",
            tech: ["React.js", "Tailwind CSS", "HTML5", "CSS Grid", "Chart.js", "Vite"],
            stats: { "Load Time Speed": "0.4s", "UI Responsiveness": "100%", "Sync Latency": "Instant" }
        },
        4: {
            title: "Interactive Web Sandbox",
            category: "CREATIVE CODING PORTAL (E-42)",
            desc: "A testing ground for custom CSS 3D perspectives, Web Audio nodes, and graphic rendering. It houses mini-applications, interactive custom canvases, and audio synthesis keyboards. Created to refine front-end development capabilities and experiment with micro-animations.",
            tech: ["JavaScript ES6", "Web Audio API", "HTML5 Canvas", "CSS 3D Transforms"],
            stats: { "Audio Nodes Processed": "32 concurrent", "Frame Render Rate": "60fps", "Interactive Blocks": "12 Items" }
        }
    };

    // Modal controls
    const projectModal = document.getElementById("project-modal");
    const closeModalBtn = document.getElementById("modal-close-btn");
    const modalCategory = document.getElementById("modal-project-category");
    const modalTitle = document.getElementById("modal-project-title");
    const modalDesc = document.getElementById("modal-project-desc");
    const modalTech = document.getElementById("modal-project-tech");
    const modalStats = document.getElementById("modal-project-stats");
    const modalGraphic = document.getElementById("modal-project-graphic");

    document.querySelectorAll(".view-project-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const projId = btn.getAttribute("data-project-id");
            const data = projectsData[projId];

            if (data) {
                playSound('access');
                modalCategory.textContent = data.category;
                modalTitle.textContent = data.title;
                modalDesc.textContent = data.desc;

                // Load SVG graphic dynamically matching card
                const card = document.getElementById(`project-card-${projId}`);
                if (card) {
                    const svgArt = card.querySelector(".panel-image-placeholder").innerHTML;
                    modalGraphic.innerHTML = svgArt;
                }

                // Load tech tags
                modalTech.innerHTML = "";
                data.tech.forEach(t => {
                    const tag = document.createElement("span");
                    tag.className = "tech-tag font-bebas";
                    tag.textContent = t;
                    modalTech.appendChild(tag);
                });

                // Load stats
                modalStats.innerHTML = "";
                Object.entries(data.stats).forEach(([label, value]) => {
                    const pctVal = parseInt(value) || 85;
                    const row = document.createElement("div");
                    row.className = "modal-stat-row";
                    row.innerHTML = `
                        <span class="modal-stat-label font-bangers">${label} — ${value}</span>
                        <div class="modal-stat-bar">
                            <div class="modal-stat-fill" style="width: ${pctVal}%"></div>
                        </div>
                    `;
                    modalStats.appendChild(row);
                });

                projectModal.classList.add("active");
                document.body.style.overflow = "hidden";
            }
        });
    });

    function closeModal() {
        projectModal.classList.remove("active");
        document.body.style.overflow = "auto";
        playSound('thwip');
    }
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if (projectModal) {
        projectModal.addEventListener("click", (e) => {
            if (e.target === projectModal) closeModal();
        });
    }

    // ==========================================================================
    // 7. SKILLS SECTION: GOOBER PHYSICS HUD SIMULATION
    // ==========================================================================
    const skillsCanvas = document.getElementById("goober-physics-canvas");
    let skillsCtx = null;
    let skillNodes = [];
    let springWebs = [];
    let isDraggingNode = null;

    const skillCatalog = [
        { id: "neural-net", name: "NEURAL-NET", type: "AI/ML ARSENAL", value: 85, tech: "Python • TensorFlow • Scikit-Learn • Pandas", quote: "Training models that see patterns across dimensions.", label: "🧠" },
        { id: "prompt-engine", name: "PROMPT-ENGINE", type: "GENAI BLUEPRINTS", value: 90, tech: "Prompt Engineering • GPT APIs • LLM Fine-tuning", quote: "Whispering structure into the minds of artificial intellects.", label: "💬" },
        { id: "web-shooter", name: "WEB-SHOOTER", type: "FRONT-ENDblueprints", value: 92, tech: "HTML5 • CSS3 • JavaScript • React Basics", quote: "Weaving highly responsive webs of interactable pixels.", label: "🕸️" },
        { id: "code-web", name: "CODE-WEB", type: "CORE PROGRAMMING", value: 80, tech: "C Programming • Data Structures • Algorithm Design", quote: "Structuring the core web strands with maximum speed.", label: "⚙️" },
        { id: "data-stream", name: "DATA-STREAM", type: "DATA SCIENCE", value: 85, tech: "Data Analysis • Data Visualization • Statistics", quote: "Siphoning multi-dimensional streams into structured pipelines.", label: "📊" },
        { id: "gen-brush", name: "GEN-BRUSH", type: "CREATIVE AI", value: 90, tech: "AI Art Generation • Stable Diffusion • Midjourney", quote: "Brushing code with the colors of machine imagination.", label: "🎨" }
    ];

    function initGooberPhysics() {
        if (!skillsCanvas) return;
        skillsCtx = skillsCanvas.getContext("2d");
        
        // Scale canvas to match layout
        skillsCanvas.width = skillsCanvas.parentElement.offsetWidth;
        skillsCanvas.height = skillsCanvas.parentElement.offsetHeight;

        const centerX = skillsCanvas.width / 2;
        const centerY = skillsCanvas.height / 2;
        
        skillNodes = [];
        springWebs = [];
        
        // Center node representing Goober core spider logo
        const coreNode = {
            id: "core",
            name: "GOOBER",
            x: centerX,
            y: centerY,
            vx: 0, vy: 0,
            radius: 35,
            isStatic: true,
            label: "🕷️"
        };
        skillNodes.push(coreNode);

        // Position nodes in an orbital layout around core
        skillCatalog.forEach((skill, index) => {
            const angle = (index * Math.PI * 2) / skillCatalog.length;
            const distance = 120 + Math.random() * 20;
            skillNodes.push({
                ...skill,
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                vx: 0, vy: 0,
                radius: 28,
                isStatic: false,
                targetIndex: index
            });

            // Make spring web links back to core
            springWebs.push({
                nodeA: coreNode,
                nodeB: skillNodes[skillNodes.length - 1],
                restLength: 120,
                k: 0.08 // spring stiffness
            });
        });

        // Setup mouse drag event handlers on canvas
        skillsCanvas.removeEventListener("mousedown", onMouseDownSkills);
        skillsCanvas.removeEventListener("mousemove", onMouseMoveSkills);
        window.removeEventListener("mouseup", onMouseUpSkills);

        skillsCanvas.addEventListener("mousedown", onMouseDownSkills);
        skillsCanvas.addEventListener("mousemove", onMouseMoveSkills);
        window.addEventListener("mouseup", onMouseUpSkills);
    }

    // Physics events
    function onMouseDownSkills(e) {
        const rect = skillsCanvas.getBoundingClientRect();
        const mX = e.clientX - rect.left;
        const mY = e.clientY - rect.top;

        // Check if cursor clicked on any node
        for (let i = 1; i < skillNodes.length; i++) { // Skip core static node
            const node = skillNodes[i];
            const dist = Math.hypot(node.x - mX, node.y - mY);
            if (dist < node.radius) {
                isDraggingNode = node;
                playSound('thwip');
                showSkillDetails(node);
                break;
            }
        }
    }

    function onMouseMoveSkills(e) {
        if (!isDraggingNode) return;
        const rect = skillsCanvas.getBoundingClientRect();
        isDraggingNode.x = e.clientX - rect.left;
        isDraggingNode.y = e.clientY - rect.top;
        
        // Keep inside canvas bounds
        isDraggingNode.x = Math.max(isDraggingNode.radius, Math.min(skillsCanvas.width - isDraggingNode.radius, isDraggingNode.x));
        isDraggingNode.y = Math.max(isDraggingNode.radius, Math.min(skillsCanvas.height - isDraggingNode.radius, isDraggingNode.y));

        // Check for node collision fusions
        checkNodeCollisions(isDraggingNode);
    }

    function onMouseUpSkills() {
        if (isDraggingNode) {
            isDraggingNode = null;
        }
    }

    // Detail Panel triggers
    const placeholderCard = document.getElementById("goober-placeholder");
    const detailCard = document.getElementById("goober-detail-card");
    const fusionCard = document.getElementById("goober-fusion-card");

    function showSkillDetails(node) {
        if (!detailCard || !placeholderCard || !fusionCard) return;

        placeholderCard.classList.remove("active");
        fusionCard.classList.remove("active");
        detailCard.classList.add("active");

        document.getElementById("gadget-detail-title").textContent = `🕸️ ${node.name}`;
        document.getElementById("gadget-detail-type").textContent = node.type;
        document.getElementById("gadget-tech-list").textContent = node.tech;
        document.getElementById("gadget-quote").textContent = `"${node.quote}"`;

        // Render battery gauge bar size
        const powerBar = document.getElementById("gadget-power-bar");
        const powerVal = document.getElementById("gadget-power-val");
        if (powerBar) powerBar.style.width = `${node.value}%`;
        if (powerVal) powerVal.textContent = `${node.value}%`;

        // Draw custom gauges inside Detail Panel based on active dimension style
        const activeDim = state.currentDimension;
        const svgEl = document.getElementById("gadget-svg");
        if (svgEl) {
            svgEl.innerHTML = "";
            if (activeDim === '1610') {
                // Analog steam dial gauge drawing
                svgEl.innerHTML = `
                    <circle cx="50" cy="35" r="22" fill="none" stroke="currentColor" stroke-width="2"/>
                    <path d="M 50 35 L 68 25" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                    <circle cx="50" cy="35" r="3" fill="currentColor"/>
                    <text x="50" y="52" font-family="Bangers" font-size="7" text-anchor="middle" fill="currentColor">PSI GAUGE</text>
                `;
            } else if (activeDim === '65') {
                // Grid CRT digital readout battery charging slots
                svgEl.innerHTML = `
                    <rect x="20" y="15" width="60" height="25" fill="none" stroke="currentColor" stroke-width="2"/>
                    <rect x="25" y="20" width="10" height="15" fill="currentColor"/>
                    <rect x="40" y="20" width="10" height="15" fill="currentColor"/>
                    <rect x="55" y="20" width="10" height="15" fill="currentColor" opacity="0.3"/>
                    <text x="50" y="52" font-family="monospace" font-size="6" text-anchor="middle" fill="currentColor">BATTERY_CELLS</text>
                `;
            } else if (activeDim === '928') {
                // Futuristic double concentric rings HUD
                svgEl.innerHTML = `
                    <circle cx="50" cy="30" r="22" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="8 4"/>
                    <circle cx="50" cy="30" r="14" fill="none" stroke="currentColor" stroke-width="1.5"/>
                    <line x1="50" y1="5" x2="50" y2="55" stroke="currentColor" stroke-width="0.5"/>
                    <line x1="25" y1="30" x2="75" y2="30" stroke="currentColor" stroke-width="0.5"/>
                `;
            } else {
                // Simple sketched progress outline boxes
                svgEl.innerHTML = `
                    <path d="M 15 15 L 85 18 L 82 45 L 20 42 Z" fill="none" stroke="currentColor" stroke-width="2"/>
                    <path d="M 20 20 L 70 23" stroke="currentColor" stroke-width="3"/>
                    <path d="M 23 30 L 60 32" stroke="currentColor" stroke-width="3"/>
                `;
            }
        }
    }

    // Node collision detection for Skill Fusion fusions
    function checkNodeCollisions(draggedNode) {
        for (let i = 1; i < skillNodes.length; i++) {
            const other = skillNodes[i];
            if (other.id === draggedNode.id) continue;

            const dist = Math.hypot(draggedNode.x - other.x, draggedNode.y - other.y);
            if (dist < draggedNode.radius + other.radius - 5) {
                // Trigger Fusion!
                triggerSkillFusion(draggedNode, other);
                break;
            }
        }
    }

    const fusionOutputs = {
        "neural-net+prompt-engine": { result: "Autonomous GenAI Agent", desc: "A system running self-prompting neural loops to build models that evaluate their own performance pipelines.", nodes: ["Python Neural-Net", "Prompt Optimizer"] },
        "web-shooter+code-web": { result: "Optimized Web Compiler", desc: "Compiling C loops into high speed WebAssembly modules, serving react front-ends at maximum throughput speeds.", nodes: ["C Programming", "React Webshooters"] },
        "gen-brush+web-shooter": { result: "Generative Interface UI", desc: "A front-end interface that morphs layouts dynamically using prompt art vector structures.", nodes: ["AI Art Brush", "React Webshooters"] },
        "neural-net+data-stream": { result: "Predictive Analytics Engine", desc: "Siphoning raw multi-dimensional data pipelines straight into neural class evaluation structures.", nodes: ["Python Neural-Net", "Data Analytics Streams"] }
    };

    function triggerSkillFusion(nodeA, nodeB) {
        // Sort keys to look up combinatorics symmetrically
        const key = [nodeA.id, nodeB.id].sort().join("+");
        const match = fusionOutputs[key];

        if (match) {
            playSound('glitch');
            isDraggingNode = null;

            // Trigger visual chromatic explosion overlay
            const canvasWrapper = document.querySelector(".goober-canvas-wrapper");
            if (canvasWrapper) {
                canvasWrapper.style.transform = "scale(0.97)";
                canvasWrapper.style.borderColor = "#FF00AA";
                setTimeout(() => {
                    canvasWrapper.style.transform = "none";
                    canvasWrapper.style.borderColor = "var(--border-dim)";
                }, 300);
            }

            // Populate Fusion Card
            placeholderCard.classList.remove("active");
            detailCard.classList.remove("active");
            fusionCard.classList.add("active");

            document.getElementById("fusion-node-1").textContent = match.nodes[0].toUpperCase();
            document.getElementById("fusion-node-2").textContent = match.nodes[1].toUpperCase();
            document.getElementById("fusion-result-text").textContent = match.result;
            document.getElementById("fusion-result-desc").textContent = match.desc;

            // Repel nodes physically after fusion
            const angle = Math.atan2(nodeB.y - nodeA.y, nodeB.x - nodeA.x);
            nodeA.x -= Math.cos(angle) * 75;
            nodeA.y -= Math.sin(angle) * 75;
            nodeB.x += Math.cos(angle) * 75;
            nodeB.y += Math.sin(angle) * 75;
        }
    }

    const closeFusionBtn = document.getElementById("close-fusion-btn");
    if (closeFusionBtn) {
        closeFusionBtn.addEventListener("click", () => {
            playSound('thwip');
            fusionCard.classList.remove("active");
            placeholderCard.classList.add("active");
        });
    }

    // Goober Physics Animation Loop
    function updateGooberPhysics() {
        if (!skillsCtx) return;

        // Clear
        skillsCtx.clearRect(0, 0, skillsCanvas.width, skillsCanvas.height);
        const theme = state.currentDimension;

        // 1. Update Springs (Web Elastic cords)
        springWebs.forEach(web => {
            const dx = web.nodeB.x - web.nodeA.x;
            const dy = web.nodeB.y - web.nodeA.y;
            const dist = Math.hypot(dx, dy);
            
            if (dist === 0) return;

            const force = (dist - web.restLength) * web.k;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            // Apply force to B (non-static node)
            if (!web.nodeB.isStatic && web.nodeB !== isDraggingNode) {
                web.nodeB.vx -= fx * 0.15;
                web.nodeB.vy -= fy * 0.15;
            }
        });

        // 2. Node collision repulsion (prevent overlapping nodes)
        for (let i = 0; i < skillNodes.length; i++) {
            const nodeA = skillNodes[i];
            for (let j = i + 1; j < skillNodes.length; j++) {
                const nodeB = skillNodes[j];
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const dist = Math.hypot(dx, dy);
                const minDist = nodeA.radius + nodeB.radius + 15;

                if (dist < minDist) {
                    const overlap = minDist - dist;
                    const forceX = (dx / (dist || 1)) * overlap * 0.08;
                    const forceY = (dy / (dist || 1)) * overlap * 0.08;

                    if (!nodeA.isStatic && nodeA !== isDraggingNode) {
                        nodeA.vx -= forceX;
                        nodeA.vy -= forceY;
                    }
                    if (!nodeB.isStatic && nodeB !== isDraggingNode) {
                        nodeB.vx += forceX;
                        nodeB.vy += forceY;
                    }
                }
            }
        }

        // 3. Move & Draw Nodes
        skillNodes.forEach((node, idx) => {
            if (!node.isStatic && node !== isDraggingNode) {
                // Apply friction
                node.vx *= 0.85;
                node.vy *= 0.85;
                
                // Add tiny noise drift
                node.vx += (Math.random() - 0.5) * 0.15;
                node.vy += (Math.random() - 0.5) * 0.15;

                node.x += node.vx;
                node.y += node.vy;

                // Canvas boundaries bounce
                if (node.x < node.radius) { node.x = node.radius; node.vx *= -0.5; }
                if (node.x > skillsCanvas.width - node.radius) { node.x = skillsCanvas.width - node.radius; node.vx *= -0.5; }
                if (node.y < node.radius) { node.y = node.radius; node.vy *= -0.5; }
                if (node.y > skillsCanvas.height - node.radius) { node.y = skillsCanvas.height - node.radius; node.vy *= -0.5; }
            }

            // Draw spring web connection lines
            if (idx > 0) {
                skillsCtx.beginPath();
                skillsCtx.moveTo(skillNodes[0].x, skillNodes[0].y);
                skillsCtx.lineTo(node.x, node.y);
                
                // Styling web line depending on active dimension
                if (theme === '1610') {
                    skillsCtx.strokeStyle = "#000000";
                    skillsCtx.lineWidth = 2.5;
                } else if (theme === '65') {
                    skillsCtx.strokeStyle = "#FF00AA";
                    skillsCtx.lineWidth = 1.8;
                } else if (theme === '928') {
                    skillsCtx.strokeStyle = "rgba(0, 240, 255, 0.4)";
                    skillsCtx.lineWidth = 1.2;
                } else {
                    skillsCtx.strokeStyle = "rgba(255, 255, 255, 0.15)";
                    skillsCtx.lineWidth = 1.5;
                }
                skillsCtx.stroke();
            }
        });

        // Draw node circles
        skillNodes.forEach(node => {
            skillsCtx.beginPath();
            skillsCtx.arc(node.x, node.y, node.radius, 0, Math.PI*2);
            
            // Draw backgrounds depending on dimension class
            if (theme === '1610') {
                skillsCtx.fillStyle = node.isStatic ? "#FFE600" : "#F4F1EA";
                skillsCtx.strokeStyle = "#000000";
                skillsCtx.lineWidth = 3;
                skillsCtx.fill();
                skillsCtx.stroke();
            } else if (theme === '65') {
                skillsCtx.fillStyle = "#0B001A";
                skillsCtx.strokeStyle = node.isStatic ? "#00F0FF" : "#FF00AA";
                skillsCtx.lineWidth = 2;
                skillsCtx.fill();
                skillsCtx.stroke();
            } else if (theme === '928') {
                skillsCtx.fillStyle = "rgba(26, 0, 51, 0.6)";
                skillsCtx.strokeStyle = "#00F0FF";
                skillsCtx.lineWidth = 1.5;
                skillsCtx.fill();
                skillsCtx.stroke();
            } else if (theme === '42') {
                skillsCtx.fillStyle = "#F0EAD6";
                skillsCtx.strokeStyle = "#4A3B32";
                skillsCtx.lineWidth = 2.5;
                skillsCtx.fill();
                skillsCtx.stroke();
            } else {
                // Default Prime theme
                skillsCtx.fillStyle = "#121212";
                skillsCtx.strokeStyle = "#FF0040";
                skillsCtx.lineWidth = 2;
                skillsCtx.fill();
                skillsCtx.stroke();
            }

            // Draw Node emojis / center icons
            skillsCtx.font = `${node.radius * 0.75}px sans-serif`;
            skillsCtx.textAlign = "center";
            skillsCtx.textBaseline = "middle";
            
            // Text color override for comic themes
            skillsCtx.fillStyle = (theme === '1610' || theme === '42') ? "#000" : "#FFF";
            skillsCtx.fillText(node.label, node.x, node.y);
        });

        requestAnimationFrame(updateGooberPhysics);
    }

    // Trigger skills HUD observation
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initGooberPhysics();
                requestAnimationFrame(updateGooberPhysics);
            }
        });
    }, { threshold: 0.1 });
    const skillsSection = document.getElementById("skills-section");
    if (skillsSection) skillsObserver.observe(skillsSection);

    // ==========================================================================
    // 8. ABOUT SECTION: DYNAMIC ORIGIN STORY COMPOSITIONS
    // ==========================================================================
    const originStories = {
        prime: {
            narrative1: "Just an ordinary student in Igatpuri, India, studying the mechanics of the web...",
            narrative2: "Then at RSM Polytechnic in Nashik, a spider-ML bit. The code started running in my veins!",
            narrative3: "First C loops compiled, predictive models trained, and prompt workflows took shape!",
            narrative4: "Embracing an AI-first mindset, compiling structures that bridge dimensions.",
            banner: "I NEVER ASKED FOR THESE POWERS... BUT HERE WE ARE.",
            region: "Igatpuri, Maharashtra",
            affiliation: "Rajarshi Shahu Maharaj Polytechnic, Nashik",
            powers: "AI/ML, GenAI, Front-End, Prompt Eng",
            weakness: "Coffee + Deep Learning Papers at 3AM"
        },
        1610: {
            narrative1: "Raised in a graphic universe, studying standard database loops inside Igatpuri...",
            narrative2: "Bitten by a radioactive AI algorithm at RSM Polytechnic lab Nashik. Saturated primary logic burst in!",
            narrative3: "Designed feedforward hyperplanes, training weights at a 45° angle. Ben-Day matrix initialized!",
            narrative4: "Taking up the mantle of the AI Engineer. Constructing ML blueprints with thick ink outlines.",
            banner: "WITH GREAT ALGORITHM POWER COMES GREAT COMPUTATIONAL RESPONSIBILITY.",
            region: "Brooklyn / Igatpuri E-1610",
            affiliation: "Spider-Society ML Core",
            powers: "Supervised Net Tuning, Halftone Vectors, Classification Bounds",
            weakness: "Halftone dot leakage under high validation loss"
        },
        65: {
            narrative1: "A digital musician in Igatpuri E-65, playing drum beats while sorting raw logs...",
            narrative2: "Discovering prompt engineering after a glitch surge at RSM Polytechnic digital labs...",
            narrative3: "Constructing prompt structures (PTCF) that stream directly as neon CRT signals...",
            narrative4: "Building generative widgets inside terminal command screens. Glitch code rain active!",
            banner: "WE ARE ALL SWINGING IN THE DIGITIZED WEB.",
            region: "Chelsea / Nashik E-65",
            affiliation: "GenAI Prompt Hub",
            powers: "PTCF Prompt Framework, CRT Glitch Shading, Matrix Streams",
            weakness: "CRT refresh rate flicker at low power states"
        },
        928: {
            narrative1: "A systems strategist analyzing data nodes in futuristic Igatpuri 2099...",
            narrative2: "Bitten by an experimental cybernetic web particle at RSM futuristic diagnostics division...",
            narrative3: "Compiled real-time data pipelines, streaming inventory metrics onto glowing HUDs...",
            narrative4: "Accessing multiverse archives. Building chrome glassmorphic dashboards across dimensions.",
            banner: "THE SECURITY DECRYPTION PIPELINE IS FULLY OPERATIONAL.",
            region: "Nueva York / Nashik E-928",
            affiliation: "Oscorp Data Core",
            powers: "Chrome Glass Refraction, Predictive Data Pipelines, 3D CSS Perspectives",
            weakness: "Sub-zero temperatures in server cooling loops"
        },
        42: {
            narrative1: "A sketching artist tracing sepia watercolor outlines inIgapturi E-42...",
            narrative2: " découvrir prompt templates inside a mystical sketchbook at RSM Polytechnic...",
            narrative3: "Penciled loops animated on load, washes of paint bleeding across the canvas grid...",
            narrative4: "Using generative brush tools to paint creative front-ends and watercolor visualizations.",
            banner: "THE INK RUNS DEEP ACROSS THE CANVAS WORLD.",
            region: "Prowler Base / Igatpuri E-42",
            affiliation: "Creative AI Guild",
            powers: "Watercolor Ink Bleeds, Penciled Wireframes, Generative Art",
            weakness: "Rainwater washing away fresh canvas ink washes"
        }
    };

    function renderOriginStory(originId) {
        const story = originStories[originId];
        if (!story) return;

        // Update Narratives
        const n1 = document.getElementById("origin-narrative-1");
        const n2 = document.getElementById("origin-narrative-2");
        const n3 = document.getElementById("origin-narrative-3");
        const n4 = document.getElementById("origin-narrative-4");
        const banner = document.getElementById("origin-narration-banner");

        if (n1) n1.textContent = `"${story.narrative1}"`;
        if (n2) n2.textContent = `"${story.narrative2}"`;
        if (n3) n3.textContent = `"${story.narrative3}"`;
        if (n4) n4.textContent = `"${story.narrative4}"`;
        if (banner) banner.textContent = `"${story.banner}"`;

        // Update Character stats
        const regionEl = document.getElementById("card-region-val");
        const affEl = document.getElementById("card-aff-val");
        const powersEl = document.getElementById("card-powers-val");
        const weaknessEl = document.getElementById("card-weakness-val");

        if (regionEl) regionEl.textContent = story.region;
        if (affEl) affEl.textContent = story.affiliation;
        if (powersEl) powersEl.textContent = story.powers;
        if (weaknessEl) weaknessEl.textContent = story.weakness;

        // Apply comic panels color burst effect toggle
        const pageLeft = document.getElementById("origin-page-left");
        if (pageLeft) {
            // Remove previous dimension tags
            pageLeft.className = "comic-page page-left";
            pageLeft.classList.add(`origin-theme-${originId}`);
        }
    }

    document.querySelectorAll(".origin-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            playSound('swish');
            const chosenOrigin = btn.getAttribute("data-origin");
            document.querySelectorAll(".origin-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderOriginStory(chosenOrigin);
        });
    });

    // ==========================================================================
    // 8.5 NAVIGATION POLISH
    // ==========================================================================
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const hireMeBtn = document.getElementById("hire-me-btn");

    function setMobileMenu(open) {
        if (!mobileMenuBtn || !navMenu) return;
        mobileMenuBtn.classList.toggle("is-open", open);
        navMenu.classList.toggle("is-open", open);
        document.body.classList.toggle("menu-open", open);
        mobileMenuBtn.setAttribute("aria-expanded", String(open));
        mobileMenuBtn.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    }

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            setMobileMenu(!navMenu.classList.contains("is-open"));
            playSound('thwip');
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => setMobileMenu(false));
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") setMobileMenu(false);
        });

        document.addEventListener("click", (e) => {
            if (!navMenu.classList.contains("is-open")) return;
            if (navMenu.contains(e.target) || mobileMenuBtn.contains(e.target)) return;
            setMobileMenu(false);
        });
    }

    if (hireMeBtn) {
        hireMeBtn.addEventListener("click", () => {
            document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
        });
    }

    const sectionsForNav = Array.from(navLinks)
        .map(link => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    if (sectionsForNav.length) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(link => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 });

        sectionsForNav.forEach(section => navObserver.observe(section));
    }

    // ==========================================================================
    // 9. CONTACT SECTION: PORTAL CANVAS & DRIFTING PHYSICS FRAGMENTS
    // ==========================================================================
    // Standard form initialization (obsolete physics and portal loops removed)

    // Oscorp submit shooting animation
    const oscorpForm = document.getElementById("oscorp-contact-form");
    const successOverlay = document.getElementById("form-success-overlay");

    if (oscorpForm) {
        oscorpForm.addEventListener("submit", (e) => {
            e.preventDefault();
            playSound('thwip');

            // Animate form card pop scale on submit
            const formCard = document.querySelector(".contact-form-card");
            if (formCard) {
                formCard.style.transform = "scale(0.98) rotate(-0.5deg)";
                formCard.style.opacity = "0.8";
                formCard.style.transition = "all 0.15s ease-in-out";
            }

            setTimeout(() => {
                // Show Success overlay
                if (successOverlay) {
                    successOverlay.classList.add("active");
                    
                    const successH3 = successOverlay.querySelector("h3");
                    if (successH3) {
                        successH3.className = "glitch-text font-bangers";
                        successH3.setAttribute("data-text", "MESSAGE CAUGHT IN WEB!");
                        successH3.textContent = "MESSAGE CAUGHT IN WEB!";
                    }
                }

                // Restore form card dimensions
                if (formCard) {
                    formCard.style.transform = "none";
                    formCard.style.opacity = "1";
                    formCard.style.transition = "none";
                }

                // Reset form values
                oscorpForm.reset();

            }, 300);

            // Close success overlay automatically
            setTimeout(() => {
                if (successOverlay) successOverlay.classList.remove("active");
            }, 4500);
        });
    }

    // Intersection observer for contact portal canvas removed

    // ==========================================================================
    // 10. PAGE LOADING INTRO SEQUENCE (Skip handler)
    // ==========================================================================
    const skipBtn = document.getElementById("skip-loader-btn");
    const loaderOverlay = document.getElementById("loader-overlay");

    function closeLoader() {
        if (!state.loaderActive) return;
        state.loaderActive = false;
        loaderOverlay.classList.add("fade-out");
        
        // Custom scrolling reveal triggers once load wraps
        setTimeout(() => {
            loaderOverlay.style.display = "none";
            // Initialize elements
            initGooberPhysics();
        }, 500);
    }

    if (skipBtn) {
        skipBtn.addEventListener("click", closeLoader);
    }

    // Auto-resolve loader after countdown finishes
    setTimeout(closeLoader, 3500);

});
