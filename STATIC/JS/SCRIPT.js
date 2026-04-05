const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const optionsInput = document.getElementById("optionsInput");
const prizesInput = document.getElementById("prizesInput");
const updateBtn = document.getElementById("updateBtn");
const spinBtn = document.getElementById("spinBtn");
const resultText = document.getElementById("resultText");
const historyBody = document.getElementById("historyBody");

let options = (typeof initialOptions !== 'undefined') ? initialOptions : [];
let currentAngle = 0;
let isSpinning = false;
let historyCount = 0;

const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];

function getOptionsFromTextarea() {
    return optionsInput.value.split("\n").map(item => item.trim()).filter(item => item !== "");
}

function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 220;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Get the list of prizes from the textarea
    const prizeList = prizesInput.value.split('\n').filter(i => i.trim());
    
    if (prizeList.length === 0) return;

    // 2. IMPORTANT: We divide the wheel by the number of PRIZES, not people
    const arcSize = (Math.PI * 2) / prizeList.length;

    for (let i = 0; i < prizeList.length; i++) {
        const startAngle = currentAngle + i * arcSize;
        
        // Draw the colorful slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + arcSize);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw the Prize Text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + arcSize / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 18px Arial"; // Made font bigger since slices are larger
        ctx.fillText(prizeList[i], radius - 35, 5);
        ctx.restore();
    }
}

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

async function spinWheel() {
    if (isSpinning) return;
    options = getOptionsFromTextarea();
    if (options.length === 0) return alert("請輸入名單");

    isSpinning = true;
    spinBtn.disabled = true;
    resultText.textContent = "抽獎中...";

    try {
        const response = await fetch("/spin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ options })
        });
        const data = await response.json();
        
        const winnerIndex = data.winner_index;
        const winnerText = data.winner_text;
        const arcSize = (Math.PI * 2) / options.length;
        const targetAngle = (Math.PI * 2 * 6) + (Math.PI * 1.5) - (winnerIndex * arcSize + arcSize / 2);
        const startAngle = currentAngle;
        const startTime = performance.now();

        function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / 4000, 1);
            currentAngle = startAngle + (targetAngle - startAngle) * easeOutCubic(progress);
            drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                currentAngle = targetAngle % (Math.PI * 2);
                drawWheel();
                
                const currentPrizes = prizesInput.value.split('\n').filter(i => i.trim());
                const assignedPrize = currentPrizes[winnerIndex % currentPrizes.length] || "參加獎";
                
                resultText.innerHTML = `獎品：<strong>${assignedPrize}</strong><br>得獎者：<strong>${winnerText}</strong>`;
                
                historyCount++;
                const newRow = `<tr><td>${historyCount}</td><td>${assignedPrize}</td><td>${winnerText}</td></tr>`;
                historyBody.insertAdjacentHTML('afterbegin', newRow);

                isSpinning = false;
                spinBtn.disabled = false;
            }
        }
        requestAnimationFrame(animate);
    } catch (e) { console.error(e); isSpinning = false; spinBtn.disabled = false; }
}

window.addEventListener('load', () => { drawWheel(); });
updateBtn.addEventListener("click", () => { options = getOptionsFromTextarea(); drawWheel(); });
spinBtn.addEventListener("click", spinWheel);