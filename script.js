// --- Canvas Floating Rockets & Starfield Animation ---
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');

let width, height;
function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Advanced Rocket Particle class reproducing the Blue Launch insignia styling
class RocketParticle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 150;
        this.speed = 1.2 + Math.random() * 2.8;
        this.scale = 0.4 + Math.random() * 0.6;
        this.opacity = 0.25 + Math.random() * 0.75;
        this.wobbleSpeed = 0.02 + Math.random() * 0.03;
        this.wobbleDist = 15 + Math.random() * 25;
        this.baseX = this.x;
        this.angle = Math.random() * Math.PI * 2;
        this.trail = [];
    }

    update() {
        this.y -= this.speed;
        this.angle += this.wobbleSpeed;
        this.x = this.baseX + Math.sin(this.angle) * this.wobbleDist;

        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 20) this.trail.shift();

        if (this.y < -60) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;

        // Draw Thruster Plasma Trail
        if (this.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
            ctx.lineWidth = 4 * this.scale;
            ctx.stroke();
        }

        // Translate and Scale Rocket
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);

        // Rocket Main Fuselage (White)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(0, -22);
        ctx.lineTo(9, 2);
        ctx.lineTo(9, 16);
        ctx.lineTo(-9, 16);
        ctx.lineTo(-9, 2);
        ctx.closePath();
        ctx.fill();

        // Gold Fins / Wings (Matching brand identity)
        ctx.fillStyle = '#D4AF37';
        ctx.beginPath();
        ctx.moveTo(-9, 6);
        ctx.lineTo(-16, 20);
        ctx.lineTo(-9, 16);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(9, 6);
        ctx.lineTo(16, 20);
        ctx.lineTo(9, 16);
        ctx.closePath();
        ctx.fill();

        // Central Circuit Node Core
        ctx.fillStyle = '#0D183E';
        ctx.beginPath();
        ctx.arc(0, -2, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Energetic Thruster Flame
        ctx.fillStyle = '#F5D77F';
        ctx.beginPath();
        ctx.moveTo(-6, 16);
        ctx.lineTo(0, 30 + Math.random() * 10);
        ctx.lineTo(6, 16);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

// Background Starfield
const stars = Array.from({ length: 110 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2.2,
    alpha: Math.random()
}));

const rockets = Array.from({ length: 16 }, () => new RocketParticle());

function animateSpace() {
    ctx.clearRect(0, 0, width, height);

    // Render Stars with twinkling
    ctx.fillStyle = '#FFFFFF';
    stars.forEach(star => {
        ctx.globalAlpha = star.alpha;
        ctx.fillRect(star.x, star.y, star.size, star.size);
        star.alpha += (Math.random() - 0.5) * 0.03;
        if (star.alpha < 0.1) star.alpha = 0.1;
        if (star.alpha > 1) star.alpha = 1;
    });

    // Render Floating Rockets
    rockets.forEach(r => {
        r.update();
        r.draw();
    });

    requestAnimationFrame(animateSpace);
}
animateSpace();


// --- Futuristic Countdown Timer to End of November 2026 ---
const launchTarget = new Date(2026, 10, 30, 23, 59, 59).getTime();

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchTarget - now;

    if (distance < 0) {
        daysEl.innerText = "00";
        hoursEl.innerText = "00";
        minutesEl.innerText = "00";
        secondsEl.innerText = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = days < 10 ? '0' + days : days;
    hoursEl.innerText = hours < 10 ? '0' + hours : hours;
    minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
    secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;

    // Trigger synthetic audio ticks on every second if active
    if (audioContext && soundActive && lastSecond !== seconds) {
        playTickBeep(seconds === 0 ? 880 : 440, 0.06);
        lastSecond = seconds;
    }
}

let lastSecond = -1;
setInterval(updateCountdown, 1000);
updateCountdown();


// --- Web Audio API Synthetic Audio FX ---
let audioContext = null;
let soundActive = false;

const soundBtn = document.getElementById('sound-btn');
const soundText = document.getElementById('sound-text');

soundBtn.addEventListener('click', () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (!soundActive) {
        soundActive = true;
        soundText.innerText = "AUDIO ACTIVO: RUMOR DE MOTORES";
        soundBtn.style.background = "#D4AF37";
        soundBtn.style.color = "#0D183E";
        playRocketRumble();
    } else {
        soundActive = false;
        soundText.innerText = "ACTIVAR AUDIO Y RUMOR DE MOTORES";
        soundBtn.style.background = "linear-gradient(135deg, #0D183E 0%, #1a2c6d 100%)";
        soundBtn.style.color = "#D4AF37";
    }
});

function playTickBeep(freq, duration) {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);
    gain.gain.setValueAtTime(0.08, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + duration);
}

function playRocketRumble() {
    if (!audioContext || !soundActive) return;
    const bufferSize = audioContext.sampleRate * 3;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, audioContext.currentTime);

    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.1, audioContext.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    noise.start();
}
