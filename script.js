const scoreElement = document.getElementById('score');
const drawCardButton = document.getElementById('drawCard');
const drawCountInput = document.getElementById('drawCount');
const progressElement = document.getElementById('progress');
const histogramCtx = document.getElementById('histogramChart').getContext('2d');

let totalScore = 0;
let cardsLeft = 52;
let scoreCounts = Array.from({ length: 201 }, () => 0);

const histogramChart = new Chart(histogramCtx, {
    type: 'bar',
    data: {
        labels: Array.from({ length: 201 }, (_, i) => i), 
        datasets: [{
            label: 'Probabilidad de Puntuación ≥ 200',
            data: Array.from({ length: 201 }, () => 0), // Inicializamos a 0
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            x: {
                beginAtZero: true,
                max: 200
            },
            y: {
                beginAtZero: true,
                max: 1 
            }
        }
    }
});

function drawCard() {
    if (cardsLeft === 0) {
        alert('No quedan cartas en la baraja.');
        return;
    }

    const randomCard = Math.floor(Math.random() * 13) + 2; 

    cardsLeft--;

    if (randomCard >= 11 && randomCard <= 14) {
        totalScore += 10;
    } else {
        totalScore += randomCard;
    }

    scoreElement.textContent = 'Puntuación Total: ' + totalScore;
    scoreCounts[totalScore]++;
    
    const probabilities = scoreCounts.map(count => count / cardsLeft); 
    histogramChart.data.datasets[0].data = probabilities;
    histogramChart.update();
}

drawCardButton.addEventListener('click', () => {
    const drawCount = parseInt(drawCountInput.value, 10);
    progressElement.textContent = '';

    for (let i = 0; i < drawCount; i++) {
        setTimeout(() => {
            drawCard();
            progressElement.textContent = `Extracción ${i + 1} de ${drawCount}`;
        }, i * 1000);
    }
});