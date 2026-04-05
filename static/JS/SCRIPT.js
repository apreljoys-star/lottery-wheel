const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
let options = [];

function updateWheel() {
    const prizeText = document.getElementById('prizesInput').value;
    const wheelItems = prizeText.split('\n').filter(p => p.trim() !== "");
    if (wheelItems.length === 0) return;

    const arc = Math.PI * 2 / wheelItems.length;
    wheelItems.forEach((opt, i) => {
        const angle = i * arc;
        ctx.fillStyle = `hsl(${i * (360 / wheelItems.length)}, 70%, 60%)`;
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
        ctx.fillText(opt, 230, 10);
        ctx.restore();
    });
}

// Draw the wheel on load
window.onload = updateWheel;

// THE FIX FOR THE BUTTON:
document.getElementById('spinBtn').addEventListener('click', async function() {
    console.log("Button clicked!"); // This helps us see if it's working
    
    const participantText = document.getElementById('optionsInput').value;
    const participants = participantText.split('\n').filter(p => p.trim() !== "");

    if (participants.length === 0) {
        alert("請輸入抽獎者名單！");
        return;
    }

    try {
        const response = await fetch('/spin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ options: participants })
        });
        
        const result = await response.json();

        // Update the screen with the winner
        document.getElementById('winnerDisplay').innerText = result.winner;
        document.getElementById('prizeDisplay').innerText = result.prize;

        // Add to history
        const table = document.getElementById('historyBody');
        const row = table.insertRow(0);
        row.insertCell(0).innerText = table.rows.length;
        row.insertCell(1).innerText = result.prize;
        row.insertCell(2).innerText = result.winner;
    } catch (error) {
        console.error("Error spinning:", error);
        alert("Server error, please try again.");
    }
});
