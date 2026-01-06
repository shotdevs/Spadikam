// 1. FADE IN ANIMATION
const observerOptions = {
    threshold: 0.1 // Trigger when 10% of the item is visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

// Select all elements with the fade class
const fadeElements = document.querySelectorAll('.fade-on-scroll');
fadeElements.forEach((el) => observer.observe(el));


// 2. SERVER STATUS
const SERVER_IP = "spadikam.fun";
async function fetchStatus() {
    const statusText = document.getElementById("player-count");
    try {
        const response = await fetch(`https://api.mcsrvstat.us/2/${SERVER_IP}`);
        const data = await response.json();
        if (data.online) {
            statusText.innerText = `${data.players.online} Players Online`;
            statusText.style.color = "#4ade80"; // Green
        } else {
            statusText.innerText = "Offline";
            statusText.style.color = "#ef4444"; // Red
        }
    } catch (e) {
        statusText.innerText = "Server Offline";
    }
}
fetchStatus();


// 3. COPY IP
function copyText(txt) {
    navigator.clipboard.writeText(txt).then(() => {
        alert("IP Copied: " + txt);
    });
}

