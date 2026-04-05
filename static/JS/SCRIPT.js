let options = [];
// Use the initialOptions passed from HTML
if (typeof initialOptions !== 'undefined') {
    options = initialOptions;
}

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
let startAngle = 0;

function updateWheel() {
    // Get the current names from the textarea
    const text = document.getElementById('optionsInput').value;
    options = text.split('\n').filter(name => name.trim() !== "");

    if (options.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    const arc = Math.PI * 2 / options.length;
    options.forEach((opt, i) => {
        const angle = startAngle + i * arc;
        // This creates the colors for the slices
        ctx.fillStyle = `hsl(${i * (360 / options.length)}, 70%, 60%)`;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, angle, angle + arc);
        ctx.fill();
        ctx.save();
        
        // Add the names to the slices
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";
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
