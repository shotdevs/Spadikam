// CONFIGURATION
const SERVER_IP = "spadikam.fun"; // Your Java IP
const API_URL = `https://api.mcsrvstat.us/2/${SERVER_IP}`;

// DOM ELEMENTS
const playerCountSpan = document.getElementById("player-count");
const discordCountSpan = document.getElementById("discord-count"); // Placeholder logic

// 1. FETCH PLAYER COUNT
async function fetchServerStats() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.online) {
            playerCountSpan.innerText = `${data.players.online} / ${data.players.max}`;
        } else {
            playerCountSpan.innerText = "Offline";
            playerCountSpan.style.color = "red";
        }
    } catch (error) {
        console.error("Error fetching stats:", error);
        playerCountSpan.innerText = "Error";
    }
}

// 2. FAKE DISCORD COUNT (Since real Discord API needs a backend usually)
// If you want real count, you need WidgetBot or a specific API. 
// For now, I'll simulate a random active number or set it static.
function setDiscordCount() {
    // This is a fake number for visuals. 
    // To get real number, enable "Widget" in Discord Server Settings and use that JSON.
    discordCountSpan.innerText = "100+"; 
}

// 3. COPY IP FUNCTION
function copyIp() {
    const ipText = document.getElementById("ip-text").innerText;
    navigator.clipboard.writeText(ipText).then(() => {
        alert("IP Copied to clipboard: " + ipText);
    });
}

// 4. SCROLL ANIMATION (Fade In)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// INITIALIZE
window.onload = () => {
    fetchServerStats();
    setDiscordCount();
};
