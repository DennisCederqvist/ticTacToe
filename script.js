
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = "X";
let gameOver = false;

const winningLines = [
    [0,1,2], 
    [3,4,5], 
    [6,7,8], 
    [0,3,6], 
    [1,4,7], 
    [2,5,8], 
    [0,4,8], 
    [2,4,6]];

let winningLine = null;

const cells = document.querySelectorAll('.cell');

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

let aiTimer = null;

function handleCellClick(event){
    if (gameOver || currentPlayer !== 'X') return;
    
    const index = parseInt(event.target.dataset.index);

    if (board[index] !== '') return;

    board[index] = 'X';
    evaluateEnd();
    render();

    if (!gameOver) {
        currentPlayer = 'O';
        render();
        if (aiTimer) clearTimeout(aiTimer);
        aiTimer = setTimeout(() => {
            computerMove();
            aiTimer = null;
        }, 600);
    }
}

function evaluateEnd() {
  // check winner
    for (const line of winningLines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        winningLine = line;
        gameOver = true;
        return;
        }
    }
    // check draw (no empties)
    if (!board.includes('')) {
        gameOver = true;
    }
}

function findWinningMove(symbol) {
  for (const line of winningLines) {
    const [a, b, c] = line;
    const values = [board[a], board[b], board[c]];
    const countSymbol = values.filter(v => v === symbol).length;
    const countEmpty = values.filter(v => v === '').length;

    // if there are 2 of our symbol and 1 empty, that's a winning move
    if (countSymbol === 2 && countEmpty === 1) {
      const emptyIndex = line[values.indexOf('')];
      return emptyIndex;
    }
  }
  return null; // no winning move found
}

function computerMove() {
  if (gameOver || currentPlayer !== 'O') return;

  // 1. Try to win
  let move = findWinningMove('O');

  // 2. Try to block
  if (move === null) move = findWinningMove('X');

  // 3. Take center
  if (move === null && board[4] === '') move = 4;

  // 4. Take a corner
  const corners = [0, 2, 6, 8].filter(i => board[i] === '');
  if (move === null && corners.length > 0) {
    move = corners[Math.floor(Math.random() * corners.length)];
  }

  // 5. Random fallback
  if (move === null) {
    const empty = [];
    for (let i = 0; i < board.length; i++) if (board[i] === '') empty.push(i);
    move = empty[Math.floor(Math.random() * empty.length)];
  }

  board[move] = 'O';
  evaluateEnd();
  if (!gameOver) currentPlayer = 'X';
  render();
}


const statusE1 = document.getElementById('status');

function render() {
    for (let i = 0; i < board.length; i++) {
        const cell = cells[i];
        cell.textContent = board[i];
        cell.classList.toggle('filled', board[i] !== '');
        cell.classList.toggle('win', winningLine && winningLine.includes(i));
    }

    if(gameOver) {
        if(winningLine) {
            const winner = board[winningLine[0]];
            statusE1.textContent = `${winner} wins!`
        } else {
            statusE1.textContent = "Its a draw!";
        }
    
    } else {
        if (currentPlayer === 'X') {
            statusE1.textContent = "Your Turn";
        } else {
            statusE1.textContent = "Computer thinking...";
        }
    }
}

const resBtn = document.getElementById('resBtn');
resBtn.addEventListener('click', resetGame);

function resetGame() {
  if (aiTimer) { clearTimeout(aiTimer); aiTimer = null; } // stop any scheduled O-move
  board = Array(9).fill('');
  winningLine = null;
  gameOver = false;
  currentPlayer = 'X';  // X starts again
  render();
}


render();