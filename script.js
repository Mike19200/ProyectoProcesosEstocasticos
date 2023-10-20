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
const progressElement = document.getElementById('progress');
const resultadosList = document.getElementById('resultados');
const startSimulation = document.getElementById('startSimulation');
const numSimulationsInput = document.getElementById('numSimulations');

let totalScore = 0;
let cardsLeft = 52;
let currentCard = 0;
let resultados = []; // Arreglo para almacenar los resultados

const suits = ['hearts', 'diamonds', 'spades', 'clubs'];

function drawCard() {
    if (cardsLeft === 0) {
        alert('No quedan cartas en la baraja.');
        return;
    }

    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    const randomCardValue = cardValues[randomSuit][Math.floor(Math.random() * cardValues[randomSuit].length)];

    cardsLeft--;

    let cardScore = 0;

    if (randomSuit === 'hearts' || randomSuit === 'diamonds') {
        if (randomCardValue === 'J' || randomCardValue === 'Q' || randomCardValue === 'K') {
            cardScore = (randomSuit === 'hearts') ? 15 : 20;
        } else {
            cardScore = 10;
        }
    } else if (randomSuit === 'spades' || randomSuit === 'clubs') {
        if (randomCardValue === 'J' || randomCardValue === 'Q' || randomCardValue === 'K') {
            cardScore = (randomSuit === 'spades') ? -15 : -20;
        } else {
            cardScore = -5;
        }
    }

    totalScore += cardScore;
    scoreElement.textContent = 'Puntuación Total: ' + totalScore;

    currentCard++;
    
    if (currentCard < 5) {
        // Si no se han extraído las 5 cartas, actualiza el progreso
        progressElement.textContent = `Carta ${currentCard} de 5`;
    } else {
        // Si se han extraído las 5 cartas, guarda el resultado, actualiza la lista y reinicia el juego
        resultados.push(totalScore);
        updateResultadosList();
        resetGame();
    }
}

function updateResultadosList() {
    resultadosList.innerHTML = '';

    const mostrarHasta = Math.min(10, resultados.length);

    for (let i = 0; i < mostrarHasta; i++) {
        const resultadoItem = document.createElement('li');
        resultadoItem.textContent = `Simulación ${i + 1}: ${resultados[i]}`;
        resultadosList.appendChild(resultadoItem);
    }
}

function resetGame() {
    totalScore = 0;
    cardsLeft = 52;
    currentCard = 0;
    scoreElement.textContent = 'Puntuación Total: 0';
    progressElement.textContent = '';
}

drawCardButton.addEventListener('click', () => {
    resetGame();

    for (let j = 0; j < 5; j++) {
        setTimeout(drawCard, j * 500); // Extrae una carta cada segundo
    }
});

startSimulation.addEventListener('click', () => {
    const numSimulations = parseInt(numSimulationsInput.value);

    for (let i = 0; i < numSimulations; i++) {
        drawCardButton.click(); // Simula un clic en el botón drawCardButton
    }
    console.log(resultados);
});

function calcularPromedio() {
    if (resultados.length === 0) {
        return 0; // Si no hay resultados, el promedio es 0
    }

    const suma = resultados.reduce((acc, val) => acc + val, 0);
    return suma / resultados.length;
}

function updateProbabilityChart() {
    const counts = {};
    resultados.forEach(result => {
        counts[result] = (counts[result] || 0) + 1;
    });

    const labels = Object.keys(counts);
    const data = labels.map(label => counts[label]);

    const ctx = document.getElementById('probabilityChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Frecuencia',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: Math.min(...labels),
                    max: Math.max(...labels),
                    title: {
                        display: true,
                        text: 'Puntuación Total'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Frecuencia'
                    }
                }
            }
        }
    });
}

function generarGraficoPromedio(promedio) {
    const ctx = document.getElementById('promedioChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Promedio'],
            datasets: [{
                label: 'Promedio',
                data: [promedio],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Puntuación Total'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Promedio'
                    }
                }
            }
        }
    });
}


document.getElementById('calcularPromedio').addEventListener('click', () => {
    const promedio = calcularPromedio();
    console.log('El promedio es:', promedio);
});

document.getElementById('generateGraphProm').addEventListener('click', () => {
    const promedio = calcularPromedio();
    generarGraficoPromedio(promedio);
});

document.getElementById('generateChart').addEventListener('click', () => {
    updateProbabilityChart();
});