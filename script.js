const cardValues = {
    'hearts': 10,
    'diamonds': 20,
    'spades': -5,
    'clubs': -10
};

const scoreElement = document.getElementById('score');
const drawCardButton = document.getElementById('drawCard');
const drawCountInput = document.getElementById('drawCount');
const progressElement = document.getElementById('progress');

let totalScore = 0;
let cardsLeft = 52;

function drawCard() {
    if (cardsLeft === 0) {
        alert('No quedan cartas en la baraja.');
        return;
    }

    const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
    const randomSuitIndex = Math.floor(Math.random() * suits.length);
    const randomSuit = suits[randomSuitIndex];

    cardsLeft--;
    
    const cardValue = cardValues[randomSuit];

    totalScore += cardValue;

    scoreElement.textContent = 'Puntuación Total: ' + totalScore;
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
