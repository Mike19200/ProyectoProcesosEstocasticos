const cardValues = {
    'red': 10,
    'black': -5,
    'heart': 15,
    'diamond': 20,
    'spade': -15,
    'club': -20
};

const scoreElement = document.getElementById('score');
const drawCardButton = document.getElementById('drawCard');
const drawCountInput = document.getElementById('drawCount');
const progressElement = document.getElementById('progress');

let totalScore = 0;

function drawCard() {
    const colors = ['red', 'black'];
    const suits = ['heart', 'diamond', 'spade', 'club'];

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];

    const cardType = randomColor;
    const cardValue = cardValues[cardType];

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