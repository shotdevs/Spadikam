// ================= CONFIG =================
const JAVA_IP = "spadikam.fun";
const BEDROCK_IP = "spadikam.fun";
const BEDROCK_PORT = "25257";
const REFRESH_INTERVAL = 30000; // 30 seconds
const CACHE_DURATION = 15000; // 15 seconds cache

// ================= SERVER STATUS =================
let lastFetch = 0;
let cachedData = null;

async function fetchStatus(forceRefresh = false) {
    const statusText = document.getElementById("player-count");
    const statusDot = document.querySelector(".status-dot");
    const navDot = document.querySelector(".nav-dot");
    const navText = document.getElementById("nav-status-text");
    const peakEl = document.getElementById("peak-players");
    
    const now = Date.now();
    
    // Use cached data if available and recent
    if (!forceRefresh && cachedData && (now - lastFetch < CACHE_DURATION)) {
        updateUI(cachedData);
        return;
    }

    // Show loading state
    statusText.textContent = "Updating...";
    navText.textContent = "Checking...";

    try {
        // Fetch both Java and Bedrock status with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const [javaRes, bedrockRes] = await Promise.all([
            fetch(`https://api.mcsrvstat.us/3/${JAVA_IP}`, { signal: controller.signal })
                .then(r => r.json())
                .catch(() => ({ online: false })),
            fetch(`https://api.mcsrvstat.us/bedrock/3/${BEDROCK_IP}:${BEDROCK_PORT}`, { signal: controller.signal })
                .then(r => r.json())
                .catch(() => ({ online: false }))
        ]);

        clearTimeout(timeoutId);

        const data = {
            javaOnline: javaRes.online === true,
            bedrockOnline: bedrockRes.online === true,
            javaPlayers: javaRes.online ? (javaRes.players?.online || 0) : 0,
            bedrockPlayers: bedrockRes.online ? (bedrockRes.players?.online || 0) : 0,
            timestamp: now
        };

        cachedData = data;
        lastFetch = now;
        
        updateUI(data);

    } catch (err) {
        console.error('Status fetch error:', err);
        // Fallback to offline state
        const fallbackData = {
            javaOnline: false,
            bedrockOnline: false,
            javaPlayers: 0,
            bedrockPlayers: 0,
            timestamp: now
        };
        updateUI(fallbackData);
    }
}

function updateUI(data) {
    const statusText = document.getElementById("player-count");
    const statusDot = document.querySelector(".status-dot");
    const navDot = document.querySelector(".nav-dot");
    const navText = document.getElementById("nav-status-text");
    const peakEl = document.getElementById("peak-players");
    
    const totalPlayers = data.javaPlayers + data.bedrockPlayers;
    const isOnline = data.javaOnline || data.bedrockOnline;

    // Get today's date key for peak tracking
    const today = new Date().toDateString();
    const peakKey = `peak_${today}`;
    let peakToday = Number(localStorage.getItem(peakKey)) || 0;

    if (isOnline) {
        // HERO STATUS
        statusText.textContent = `${totalPlayers} Player${totalPlayers !== 1 ? 's' : ''} Online`;
        statusText.style.color = "#4ade80";
        
        statusDot.style.backgroundColor = "#4ade80";
        statusDot.style.boxShadow = "0 0 10px #4ade80";

        // NAVBAR STATUS
        navDot.style.backgroundColor = "#4ade80";
        navDot.style.boxShadow = "0 0 10px #4ade80";
        navText.textContent = `${totalPlayers} Online`;
        navText.style.color = "#4ade80";

        // PEAK PLAYERS
        if (totalPlayers > peakToday) {
            peakToday = totalPlayers;
            localStorage.setItem(peakKey, peakToday);
        }
        peakEl.textContent = `Peak Today: ${peakToday} Player${peakToday !== 1 ? 's' : ''}`;
        peakEl.style.color = "#fbbf24";

    } else {
        // OFFLINE STATE
        statusText.textContent = "Server Offline";
        statusText.style.color = "#ff4444";
        
        statusDot.style.backgroundColor = "#ff4444";
        statusDot.style.boxShadow = "0 0 10px #ff4444";

        navDot.style.backgroundColor = "#ff4444";
        navDot.style.boxShadow = "0 0 10px #ff4444";
        navText.textContent = "Offline";
        navText.style.color = "#ff4444";

        peakEl.textContent = `Peak Today: ${peakToday} Player${peakToday !== 1 ? 's' : ''}`;
        peakEl.style.color = "#9ca3af";
    }
}

// ================= COPY BUTTON =================
function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.textContent;

        btn.textContent = "COPIED ✓";
        btn.style.backgroundColor = "#22c55e";
        btn.style.borderColor = "#22c55e";
        btn.style.color = "#000";

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = "transparent";
            btn.style.borderColor = "var(--red)";
            btn.style.color = "var(--red)";
        }, 2000);
    }).catch(err => {
        console.error('Copy failed:', err);
        btn.textContent = "FAILED";
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// ================= FADE-IN ON SCROLL =================
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll(".fade-in").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    observer.observe(el);
});

// ========== Hero IP ==============
function copyHeroIP(el) {
    const ip = "spadikam.fun";

    navigator.clipboard.writeText(ip).then(() => {
        const original = el.innerHTML;

        el.innerHTML = "COPIED ✓";
        el.style.color = "#4ade80";
        el.style.borderColor = "#4ade80";

        setTimeout(() => {
            el.innerHTML = original;
            el.style.color = "#fff";
            el.style.borderColor = "#333";
        }, 1800);
    }).catch(err => {
        console.error('Copy failed:', err);
    });
}

// ===== Scroll Indicator =====
const scrollIndicator = document.querySelector(".scroll-indicator");

if (scrollIndicator) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            scrollIndicator.classList.add("hidden");
        }
    }, { once: true });
}

// ================= PAGE VISIBILITY =================
// Update when page becomes visible
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        fetchStatus(true); // Force refresh when page becomes visible
    }
});

// Update on page load
window.addEventListener('load', () => {
    fetchStatus(true); // Force fresh data on page load
});

// ================= INIT =================
// Initial fetch on script load
fetchStatus(true);

// Regular interval updates
setInterval(() => fetchStatus(false), REFRESH_INTERVAL);
