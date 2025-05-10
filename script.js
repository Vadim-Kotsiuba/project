let secretNumber, attempts, maxNumber;
let bestScores = {};
function toggleTheme() {
  document.body.classList.toggle('dark');
}
function showGame(gameId) {
  document.querySelectorAll('.menu, .game-container').forEach(el => el.classList.remove('active'));
  document.getElementById(gameId + 'Game').classList.add('active');
  if (gameId === 'guess') startGuessGame();
  else if (gameId === 'memory') startMemoryGame();
}
function goToMenu() {
  document.querySelectorAll('.game-container').forEach(el => el.classList.remove('active'));
  document.getElementById('mainMenu').classList.add('active');
}
function startGuessGame() {
  maxNumber = parseInt(document.getElementById('difficultySelect').value);
  secretNumber = Math.floor(Math.random() * maxNumber) + 1;
  attempts = 0;
  document.getElementById('guessMessage').textContent = 'Вгадай число!';
  document.getElementById('guessInput').value = '';
  document.getElementById('guessAttempts').textContent = 'Спроби: 0';
  document.getElementById('guessRecord').textContent = bestScores[maxNumber] || '—';
}
function makeGuess() {
  const guess = parseInt(document.getElementById('guessInput').value);
  if (!guess) return;
  attempts++;
  document.getElementById('guessAttempts').textContent = `Спроби: ${attempts}`;
  if (guess === secretNumber) {
    document.getElementById('guessMessage').textContent = '🎉 Правильно!';
    if (!bestScores[maxNumber] || attempts < bestScores[maxNumber]) {
      bestScores[maxNumber] = attempts;
      document.getElementById('guessRecord').textContent = attempts;
    }
  } else {
    document.getElementById('guessMessage').textContent = guess < secretNumber ? '📉 Занадто мало!' : '📈 Занадто багато!';
  }
}
const emojis = ["🍎", "🍌", "🍒", "🍇", "🍓", "🍍", "🥝", "🍉"];
let memoryFirstCard = null, memorySecondCard = null, memoryScore = 0, memoryStartTime, memoryTimerInterval;
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
function startMemoryGame() {
  memoryScore = 0;
  document.getElementById("memoryScore").textContent = 0;
  document.getElementById("memoryMessage").textContent = "";
  const grid = document.getElementById("cardGrid");
  grid.innerHTML = "";
  let cards = [...emojis, ...emojis];
  cards = shuffle(cards);
  cards.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = index;
    card.dataset.emoji = emoji;
    card.textContent = "❓";
    card.onclick = () => flipCard(card);
    grid.appendChild(card);
  });
  memoryStartTime = Date.now();
  clearInterval(memoryTimerInterval);
  memoryTimerInterval = setInterval(() => {
    const seconds = Math.floor((Date.now() - memoryStartTime) / 1000);
    document.getElementById("memoryTimer").textContent = `⏱ Час: ${seconds}с`;
  }, 1000);
}
function flipCard(card) {
  if (card.classList.contains("matched") || card === memoryFirstCard || memorySecondCard) return;
  card.textContent = card.dataset.emoji;
  if (!memoryFirstCard) {
    memoryFirstCard = card;
  } else {
    memorySecondCard = card;
    if (memoryFirstCard.dataset.emoji === memorySecondCard.dataset.emoji) {
      memoryFirstCard.classList.add("matched");
      memorySecondCard.classList.add("matched");
      memoryScore++;
      document.getElementById("memoryScore").textContent = memoryScore;
      if (memoryScore === emojis.length) {
        clearInterval(memoryTimerInterval);
        document.getElementById("memoryMessage").textContent = "🎉 Вітаємо! Ви знайшли всі пари!";
        showFireworks();
      }
      memoryFirstCard = null;
      memorySecondCard = null;
    } else {
      setTimeout(() => {
        memoryFirstCard.textContent = "❓";
        memorySecondCard.textContent = "❓";
        memoryFirstCard = null;
        memorySecondCard = null;
      }, 1000);
    }
  }
}
function showFireworks() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height / 2;
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    const radius = Math.random() * 3 + 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fill();
  }
  setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 1500);
}