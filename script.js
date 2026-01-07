// ================= CONFIG =================
const JAVA_IP = "play.spadikam.fun";
const BEDROCK_IP = "spadikam.fun";
const BEDROCK_PORT = "25257";
const REFRESH_INTERVAL = 30000; // 30 seconds

// ================= SERVER STATUS =================
async function fetchStatus() {
    const statusText = document.getElementById("player-count");
    const statusDot = document.querySelector(".status-dot");

    const navDot = document.querySelector(".nav-dot");
    const navText = document.getElementById("nav-status-text");

    const peakEl = document.getElementById("peak-players");
    let peakToday = Number(localStorage.getItem("peakToday")) || 0;

    try {
        const [javaRes, bedrockRes] = await Promise.all([
            fetch(`https://api.mcsrvstat.us/2/${JAVA_IP}`).then(r => r.json()),
            fetch(`https://api.mcsrvstat.us/bedrock/2/${BEDROCK_IP}:${BEDROCK_PORT}`).then(r => r.json())
        ]);

        const javaOnline = javaRes.online === true;
        const bedrockOnline = bedrockRes.online === true;

        const javaPlayers = javaOnline ? (javaRes.players?.online || 0) : 0;
        const bedrockPlayers = bedrockOnline ? (bedrockRes.players?.online || 0) : 0;

        const totalPlayers = javaPlayers + bedrockPlayers;

        if (javaOnline || bedrockOnline) {
            // HERO STATUS
            statusText.textContent = `${totalPlayers} Players Online`;
            statusText.style.color = "#4ade80";

            statusDot.style.backgroundColor = "#4ade80";
            statusDot.style.boxShadow = "0 0 10px #4ade80";

            // NAVBAR STATUS
            navDot.style.backgroundColor = "#4ade80";
            navText.textContent = "Online";

            // PEAK PLAYERS
            if (totalPlayers > peakToday) {
                peakToday = totalPlayers;
                localStorage.setItem("peakToday", peakToday);
            }
            peakEl.textContent = `Peak Today: ${peakToday} Players`;

        } else {
            // OFFLINE STATE
            statusText.textContent = "Server Offline";
            statusText.style.color = "#ff4444";

            statusDot.style.backgroundColor = "#ff4444";
            statusDot.style.boxShadow = "0 0 10px #ff4444";

            navDot.style.backgroundColor = "#ff4444";
            navText.textContent = "Offline";

            peakEl.textContent = `Peak Today: ${peakToday} Players`;
        }

    } catch (err) {
        // HARD FAIL SAFE
        statusText.textContent = "Server Offline";
        statusText.style.color = "#ff4444";

        statusDot.style.backgroundColor = "#ff4444";
        statusDot.style.boxShadow = "0 0 10px #ff4444";

        navDot.style.backgroundColor = "#ff4444";
        navText.textContent = "Offline";
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

// ================= INIT =================
fetchStatus();
setInterval(fetchStatus, REFRESH_INTERVAL);
