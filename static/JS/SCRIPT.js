// --- 1. Basic Setup ---
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const prizesInput = document.getElementById('prizesInput');
const optionsInput = document.getElementById('optionsInput'); // This is the player list
const resultText = document.getElementById('resultText');

const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6"];
let currentAngle = 0;
let isSpinning = false;

// --- 2. Data Helper Functions ---

// Fixes the 'undefined' winner issue
function getPlayers() {
    return optionsInput.value.split('\n').filter(name => name.trim() !== "");
}

function getPrizes() {
    return prizesInput.value.split('\n').filter(prize => prize.trim() !== "");
}

// --- 3. Drawing the Wheel ---

function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 220;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const prizeList = getPrizes();
    if (prizeList.length === 0) return;

    const arcSize = (Math.PI * 2) / prizeList.length;

    prizeList.forEach((prize, i) => {
        const startAngle = currentAngle + i * arcSize;

        // Draw Slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + arcSize);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + arcSize / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px Arial";
        ctx.fillText(prize, radius - 30, 5);
        ctx.restore();
    });
}

// --- 4. Spin Logic ---

function spin() {
    if (isSpinning) return;
    
    const players = getPlayers();
    const prizes = getPrizes();

    if (players.length === 0 || prizes.length === 0) {
        alert("請確保獎品和抽獎者名單都不是空的！");
        return;
    }

    isSpinning = true;
    let extraSpins = (Math.random() * 5 + 5) * Math.PI * 2; // Spin 5-10 times
    let totalRotation = extraSpins;
    let duration = 4000; // 4 seconds
    let startTime = null;

    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        let progress = (currentTime - startTime) / duration;
        
        // Ease out (slow down at the end)
        let easeOut = 1 - Math.pow(1 - progress, 3);
        currentAngle += (totalRotation * (1 - easeOut)) * 0.05; 

        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            determineWinner(prizes, players);
        }
    }
    requestAnimationFrame(animate);
}

function determineWinner(prizes, players) {
    // Calculate which slice is at the top (1.5 * PI is 12 o'clock)
    const arcSize = (Math.PI * 2) / prizes.length;
    const normalizedAngle = (currentAngle % (Math.PI * 2) + (Math.PI * 2)) % (Math.PI * 2);
    
    // The pointer is at the top, so we calculate offset
    const winningIndex = Math.floor((prizes.length - (normalizedAngle / arcSize)) % prizes.length);
    const prizeWon = prizes[winningIndex];
    
    // Pick a random winner from the player list
    const winnerName = players[Math.floor(Math.random() * players.length)];

    // Update Result Display
    resultText.innerHTML = `獎品：<span style="color: #e74c3c;">${prizeWon}</span> <br> 得獎者：<span style="color: #e74c3c;">${winnerName}</span>`;
    
    // Add to Table
    addToHistory(prizeWon, winnerName);
}

function addToHistory(prize, winner) {
    const tbody = document.getElementById('historyBody');
    const rowCount = tbody.rows.length + 1;
    const row = `<tr><td>${rowCount}</td><td>${prize}</td><td>${winner}</td></tr>`;
    tbody.innerHTML += row;
}

function clearHistory() {
    document.getElementById('historyBody').innerHTML = "";
    resultText.innerHTML = "獎品：- <br> 得獎者：-";
}

// --- 5. Event Listeners ---

document.getElementById('updateBtn').addEventListener('click', () => {
    currentAngle = 0;
    drawWheel();
});

document.getElementById('spinBtn').addEventListener('click', spin);

// Initial Draw
window.onload = drawWheel;