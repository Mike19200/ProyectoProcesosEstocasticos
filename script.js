const cardValues = {
    'hearts': [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'],
    'diamonds': [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'],
    'spades': [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'],
    'clubs': [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A']
};

const maxCardsPerType = 4;
const maxCardsPerNumber = 9;

const scoreElement = document.getElementById('score');
const drawCardButton = document.getElementById('drawCard');
const drawCountInput = document.getElementById('drawCount');
const progressElement = document.getElementById('progress');
const expectedValueElement = document.getElementById('expectedValue');
const ctx = document.getElementById('chart').getContext('2d');

let totalScore = 0;
let cardsLeft = 52;

let cardCounts = {};

const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
const comparisonCtx = document.getElementById('comparisonChart').getContext('2d');
const scoreProbabilityCtx = document.getElementById('scoreProbabilityChart').getContext('2d');

function initializeCardCounts() {
    for (const suit in cardValues) {
        cardCounts[suit] = cardValues[suit].length;
    }
}

function calculateExpectedValue() {
    let expectedValue = 0;

    for (const suit in cardCounts) {
        for (const card of cardValues[suit]) {
            if (isNaN(card)) {
                expectedValue += 10 * (maxCardsPerType - cardCounts[suit]);
            } else {
                expectedValue += card * (maxCardsPerNumber - cardCounts[suit]);
            }
        }
    }

    return expectedValue / cardsLeft;
}

function drawCard() {
    if (cardsLeft === 0) {
        alert('No quedan cartas en la baraja.');
        return;
    }

    const randomSuitIndex = Math.floor(Math.random() * suits.length);
    const randomSuit = suits[randomSuitIndex];

    const cardArray = cardValues[randomSuit];

    if (cardArray.length === 0) {
        drawCard();
        return;
    }

    const randomCardIndex = Math.floor(Math.random() * cardArray.length);
    const randomCard = cardArray.splice(randomCardIndex, 1)[0];

    cardsLeft--;

    if (isNaN(randomCard)) {
        totalScore += 10;
    } else {
        totalScore += randomCard;
    }

    scoreElement.textContent = 'Puntuación Total: ' + totalScore;
}

function generateProbabilityChart() {
    const suitProbabilities = {};

    for (const suit in cardCounts) {
        suitProbabilities[suit] = cardCounts[suit] / cardsLeft;
    }

    const labels = Object.keys(suitProbabilities);
    const data = Object.values(suitProbabilities);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Probabilidad',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });
}

function calculateProbabilityOfHighScore(drawCount) {
    let successfulOutcomes = 0;

    for (let i = 0; i < drawCount; i++) {
        const tempScore = totalScore;
        let tempCardsLeft = cardsLeft;

        for (let j = 0; j < drawCount; j++) {
            if (tempScore >= 200) {
                successfulOutcomes++;
                break;
            }

            const randomSuitIndex = Math.floor(Math.random() * suits.length);
            const randomSuit = suits[randomSuitIndex];

            const cardArray = cardValues[randomSuit];

            if (cardArray.length === 0) {
                continue;
            }

            const randomCardIndex = Math.floor(Math.random() * cardArray.length);
            const randomCard = cardArray.splice(randomCardIndex, 1)[0];

            tempCardsLeft--;

            if (isNaN(randomCard)) {
                tempScore += 10;
            } else {
                tempScore += randomCard;
            }
        }
    }

    return successfulOutcomes / drawCount;
}

function generateComparisonChart(results) {
    new Chart(comparisonCtx, {
        type: 'line',
        data: {
            labels: results.map((_, index) => `Interacción ${index + 1}`),
            datasets: [{
                label: 'Resultados',
                data: results,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    min: Math.min(...results),
                    max: Math.max(...results)
                }
            }
        }
    });
}

function generateScoreProbabilityChart() {
    const results = [];

    for (let drawCount = 1; drawCount <= 50; drawCount++) {
        let successfulOutcomes = 0;

        for (let i = 0; i < drawCount; i++) {
            const tempScore = totalScore;
            let tempCardsLeft = cardsLeft;

            for (let j = 0; j < drawCount; j++) {
                if (tempScore >= 200) {
                    successfulOutcomes++;
                    break;
                }

                const randomSuitIndex = Math.floor(Math.random() * suits.length);
                const randomSuit = suits[randomSuitIndex];

                const cardArray = cardValues[randomSuit];

                if (cardArray.length === 0) {
                    continue;
                }

                const randomCardIndex = Math.floor(Math.random() * cardArray.length);
                const randomCard = cardArray.splice(randomCardIndex, 1)[0];

                tempCardsLeft--;

                if (isNaN(randomCard)) {
                    tempScore += 10;
                } else {
                    tempScore += randomCard;
                }
            }
        }

        results.push(successfulOutcomes / drawCount);
    }

    new Chart(scoreProbabilityCtx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 50 }, (_, i) => i + 1),
            datasets: [{
                label: 'Probabilidad de puntuación >= 200',
                data: results,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    stepSize: 5
                },
                y: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });
}

drawCardButton.addEventListener('click', () => {
    const drawCount = parseInt(drawCountInput.value, 10);
    progressElement.textContent = '';

    let results = [];

    for (let i = 0; i < drawCount; i++) {
        setTimeout(() => {
            drawCard();
            progressElement.textContent = `Extracción ${i + 1} de ${drawCount}`;

            results.push(totalScore);

            if (i === drawCount - 1) {
                generateComparisonChart(results);

                generateScoreProbabilityChart();
            }
        }, i * 1000);
    }
});

initializeCardCounts();
generateProbabilityChart();
