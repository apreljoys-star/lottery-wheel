let options = [];
// Use the initialOptions passed from HTML
if (typeof initialOptions !== 'undefined') {
    options = initialOptions;
}

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
let startAngle = 0;

function updateWheel() {
    // CHANGE THIS: Look at 'prizesInput' instead of 'optionsInput'
    const text = document.getElementById('prizesInput').value;
    const wheelItems = text.split('\n').filter(name => name.trim() !== "");

    if (wheelItems.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    const arc = Math.PI * 2 / wheelItems.length;
    wheelItems.forEach((opt, i) => {
        const angle = startAngle + i * arc;
        ctx.fillStyle = `hsl(${i * (360 / wheelItems.length)}, 70%, 60%)`;
        // ... (rest of the drawing code is fine)
        ctx.fillText(opt, canvas.width / 2 - 10, 5);
        ctx.restore();
    });
}

// Ensure the wheel draws as soon as the page loads
window.onload = updateWheel;

document.getElementById('spinBtn').onclick = async () => {
    if (options.length === 0) return;
    
    // Call the Python /spin route to get a fair winner
    const response = await fetch('/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ options: options })
    });
    const result = await response.json();
    
    // Display the winner and prize
    document.getElementById('winnerDisplay').innerText = result.winner;
    document.getElementById('prizeDisplay').innerText = result.prize;
    
    // Add to History Table
    const table = document.getElementById('historyBody');
    const row = table.insertRow(0);
    row.insertCell(0).innerText = table.rows.length;
    row.insertCell(1).innerText = result.prize;
    row.insertCell(2).innerText = result.winner;
};
