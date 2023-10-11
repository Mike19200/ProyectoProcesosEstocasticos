const cardValues = {
    'hearts': [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'],
    'diamonds': [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'],
    'spades': [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'],
    'clubs': [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A']
};

const maxCardsPerType = 4; // Máximo 4 cartas de cada tipo (J, Q, K, A)
const maxCardsPerNumber = 9; // Máximo 9 cartas numéricas de cada tipo

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

    const cardArray = cardValues[randomSuit];

    if (cardArray.length === 0) {
        drawCard(); // Si ya se han extraído todas las cartas de este tipo, intenta de nuevo
        return;
    }

    const randomCardIndex = Math.floor(Math.random() * cardArray.length);
    const randomCard = cardArray.splice(randomCardIndex, 1)[0];

    cardsLeft--;

    if (isNaN(randomCard)) {
        totalScore += 10; // J, Q, K valen 10
    } else {
        totalScore += randomCard;
    }

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
