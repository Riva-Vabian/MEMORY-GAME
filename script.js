const gameBoard = document.getElementById('game-board');
const restartBtn = document.getElementById('restart');
const timeDisplay = document.getElementById('time');

const flipSound = document.getElementById("flip-sound");
const matchSound = document.getElementById("match-sound");
const errorSound = document.getElementById("error-sound");

const symbols = ['🍎', '🍌', '🍇', '🍉', '🍒', '🍓', '🥭', '🍍'];
let cardsArray = [];
let flippedCards = [];
let matchedCards = [];
let timer;
let timeElapsed = 0;

// Fungsi untuk mengacak array
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Fungsi untuk membuat kartu di dalam game board
function createCards() {
    gameBoard.innerHTML = ''; // Bersihkan papan permainan
    const cardSymbols = shuffle([...symbols, ...symbols]); // Gandakan dan acak simbol

    cardSymbols.forEach((symbol) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-symbol', symbol);
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });

    cardsArray = document.querySelectorAll('.card');
}

// Fungsi untuk membalik kartu
function flipCard() {
    const card = this;

    // Cegah interaksi jika kartu sudah terbalik atau ada 2 kartu sedang dibandingkan
    if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    playSound(flipSound);
    card.classList.add('flipped');
    card.textContent = card.getAttribute('data-symbol'); // Tampilkan simbol kartu
    flippedCards.push(card);

    // Jika sudah ada 2 kartu yang terbalik, cek apakah cocok
    if (flippedCards.length === 2) checkMatch();
}

// Fungsi untuk memeriksa kecocokan antara dua kartu
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.getAttribute('data-symbol') === card2.getAttribute('data-symbol')) {
        // Jika cocok, tambahkan ke daftar kartu yang cocok
        playSound(matchSound);
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards.push(card1, card2);
    } else {
        // Jika tidak cocok, sembunyikan kembali setelah 1 detik
        playSound(errorSound);
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
        }, 1000);
    }

    flippedCards = []; // Reset flipped cards

    // Jika semua kartu sudah cocok, hentikan timer
    if (matchedCards.length === cardsArray.length) clearInterval(timer);
}

// Fungsi untuk memulai timer
function startTimer() {
    timeElapsed = 0;
    timeDisplay.textContent = timeElapsed;
    timer = setInterval(() => {
        timeElapsed++;
        timeDisplay.textContent = timeElapsed;
    }, 1000);
}

// Fungsi untuk me-restart permainan
function restartGame() {
    clearInterval(timer); // Hentikan timer
    startTimer(); // Mulai ulang timer
    flippedCards = [];
    matchedCards = [];
    createCards(); // Buat ulang kartu
}

// Fungsi untuk memutar suara
function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// Event listener untuk tombol restart
restartBtn.addEventListener('click', restartGame);

// Inisialisasi permainan saat halaman dimuat
window.onload = () => {
    startTimer();
    createCards();
};
