const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
let startAngle = 0;

function updateWheel() {
    const prizes = document.getElementById('prizesInput').value.split('\n').filter(p => p.trim() !== "");
    if (prizes.length === 0) return;

    const arc = Math.PI * 2 / prizes.length;
    prizes.forEach((prize, i) => {
        const angle = startAngle + i * arc;
        ctx.fillStyle = `hsl(${i * (360 / prizes.length)}, 70%, 60%)`;
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, angle, angle + arc);
        ctx.fill();
        
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 18px Arial";
        ctx.fillText(prize, 230, 10);
        ctx.restore();
    });
}

// Draw the wheel as soon as the page loads
window.onload = updateWheel;

document.getElementById('spinBtn').onclick = async () => {
    const participants = document.getElementById('optionsInput').value.split('\n').filter(p => p.trim() !== "");
    
    if (participants.length === 0) {
        alert("Please add participants!");
        return;
    }

    // Ask Python to pick a winner
    const response = await fetch('/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ options: participants })
    });
    const result = await response.json();

    // Show the results on the screen
    document.getElementById('winnerDisplay').innerText = result.winner;
    document.getElementById('prizeDisplay').innerText = result.prize;

    // Add to the history table
    const table = document.getElementById('historyBody');
    const row = table.insertRow(0);
    row.insertCell(0).innerText = table.rows.length;
    row.insertCell(1).innerText = result.prize;
    row.insertCell(2).innerText = result.winner;
};
