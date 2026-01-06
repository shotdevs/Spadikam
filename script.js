// --- CONFIGURATION ---
const SERVER_IP = "play.spadikam.fun";

// --- 1. SERVER STATUS CHECKER ---
async function fetchStatus() {
    const statusText = document.getElementById("player-count");
    const statusDot = document.querySelector(".status-dot");
    
    try {
        const response = await fetch(`https://api.mcsrvstat.us/2/${SERVER_IP}`);
        const data = await response.json();

        if (data.online) {
            statusText.innerText = `${data.players.online} Players Online`;
            statusText.style.color = "#4ade80"; // Bright Green
            statusDot.style.backgroundColor = "#4ade80";
            statusDot.style.boxShadow = "0 0 10px #4ade80";
        } else {
            statusText.innerText = "Server Offline";
            statusText.style.color = "#ff4444"; // Red
            statusDot.style.backgroundColor = "#ff4444";
            statusDot.style.boxShadow = "0 0 10px #ff4444";
        }
    } catch (e) {
        statusText.innerText = "Server Offline";
        statusText.style.color = "#ff4444";
    }
}

// --- 2. COPY TO CLIPBOARD ---
function copyText(txt) {
    navigator.clipboard.writeText(txt).then(() => {
        // Simple visual feedback (Alert)
        alert("IP Copied: " + txt);
    }).catch(err => {
        console.error('Failed to copy', err);
    });
}

// --- 3. SCROLL ANIMATIONS (FADE IN) ---
const observerOptions = {
    threshold: 0.1 // Trigger when 10% of element is visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

// Apply animation to elements with .fade-in class
document.querySelectorAll('.fade-in').forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)"; // Start slightly lower
    el.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
    observer.observe(el);
});

// Initialize Status
fetchStatus();

