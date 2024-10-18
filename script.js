const board = document.getElementById('bingo-board');
const resetButton = document.getElementById('reset-button');
const bingoWord = document.querySelectorAll('#bingo-word span');
let bingoProgress = 0; // Track how many letters are revealed
let completedLines = new Set(); // To prevent duplicate letter reveals

// Generate a 5x5 Bingo board with random numbers
function generateBoard() {
  board.innerHTML = ''; // Clear the board
  let numbers = Array.from({ length: 25 }, (_, i) => i + 1); // Numbers 1-25
  numbers = shuffle(numbers); // Shuffle the numbers

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.textContent = numbers[i];
    cell.addEventListener('click', () => markCell(cell));
    board.appendChild(cell);
  }

  // Reset bingo progress
  bingoProgress = 0;
  completedLines.clear();
  updateBingoWord();
}

// Shuffle the array to randomize numbers
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Mark a cell when clicked
function markCell(cell) {
  cell.classList.toggle('marked');
  checkBingo();
}

// Check if there's a completed row, column, or diagonal
function checkBingo() {
  const cells = Array.from(document.querySelectorAll('.cell'));
  const rows = Array(5).fill().map(() => []);
  const cols = Array(5).fill().map(() => []);
  let diagonal1 = [], diagonal2 = [];

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 5);
    const col = index % 5;

    rows[row].push(cell);
    cols[col].push(cell);
    if (row === col) diagonal1.push(cell);
    if (row + col === 4) diagonal2.push(cell);
  });

  // Check if any row, column, or diagonal is fully marked
  const completed =
    rows.some((row, i) => markLine(row, `row-${i}`)) ||
    cols.some((col, i) => markLine(col, `col-${i}`)) ||
    markLine(diagonal1, 'diagonal1') ||
    markLine(diagonal2, 'diagonal2');

  if (completed) {
    revealNextBingoLetter();
  }
}

// Mark a line only if it hasn't been marked before
function markLine(cells, lineName) {
  if (completedLines.has(lineName)) return false;
  if (cells.every(cell => cell.classList.contains('marked'))) {
    completedLines.add(lineName); // Mark the line as completed
    return true;
  }
  return false;
}

// Reveal the next letter in "BINGO"
function revealNextBingoLetter() {
  if (bingoProgress < bingoWord.length) {
    bingoWord[bingoProgress].style.color = '#333'; // Reveal letter
    bingoProgress++;

    if (bingoProgress === bingoWord.length) {
      alert('Bingo!');
    }
  }
}

// Update the bingo word (reset all letters to light gray)
function updateBingoWord() {
  bingoWord.forEach(letter => (letter.style.color = 'lightgray'));
}

// Reset the board
resetButton.addEventListener('click', generateBoard);

// Initialize the board on page load
generateBoard();
