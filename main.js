(() => {
    // Game state
    let board = [];
    let moveCount = 0;
    let timerInterval = null;
    let startTime = null;
    let gameStarted = false;

    // DOM Elements
    const gameBoard = document.getElementById('gameBoard');
    const moveCounter = document.getElementById('moveCounter');
    const timer = document.getElementById('timer');
    const restartButton = document.getElementById('restartButton');
    const winModal = document.getElementById('winModal');
    const playAgainButton = document.getElementById('playAgainButton');

    // Initialize the game when DOM is loaded
    document.addEventListener('DOMContentLoaded', initGame);

    // Initialize game
    function initGame() {
        createBoard();
        scrambleBoard();
        setupEventListeners();
    }

    // Create the game board
    function createBoard() {
        board = Array.from({ length: 16 }, (_, i) => i);
        renderBoard();
    }

    // Render the board to DOM
    function renderBoard() {
        gameBoard.innerHTML = '';
        board.forEach((num, index) => {
            const tile = document.createElement('div');
            if (num !== 0) {
                tile.className = `tile bg-blue-500 hover:bg-blue-600 text-white text-2xl font-bold rounded-lg shadow-md cursor-pointer flex items-center justify-center h-[70px]`;
                tile.textContent = num;
                tile.dataset.index = index;
                tile.addEventListener('click', () => handleTileClick(index));
            } else {
                tile.className = 'bg-gray-200 rounded-lg h-[70px]';
            }
            gameBoard.appendChild(tile);
        });
    }

    // Scramble the board
    function scrambleBoard() {
        // Make random valid moves to ensure solvability
        for (let i = 0; i < 200; i++) {
            const emptyIndex = board.indexOf(0);
            const possibleMoves = getValidMoves(emptyIndex);
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            swapTiles(emptyIndex, randomMove);
        }
        renderBoard();
        resetStats();
    }

    // Get valid moves for a given position
    function getValidMoves(index) {
        const moves = [];
        const row = Math.floor(index / 4);
        const col = index % 4;

        if (row > 0) moves.push(index - 4); // up
        if (row < 3) moves.push(index + 4); // down
        if (col > 0) moves.push(index - 1); // left
        if (col < 3) moves.push(index + 1); // right

        return moves;
    }

    // Handle tile click
    function handleTileClick(index) {
        const emptyIndex = board.indexOf(0);
        if (getValidMoves(emptyIndex).includes(index)) {
            if (!gameStarted) {
                startTimer();
                gameStarted = true;
            }
            swapTiles(emptyIndex, index);
            moveCount++;
            moveCounter.textContent = moveCount;
            renderBoard();
            
            if (checkWin()) {
                endGame();
            }
        }
    }

    // Swap two tiles
    function swapTiles(index1, index2) {
        [board[index1], board[index2]] = [board[index2], board[index1]];
    }

    // Check if the puzzle is solved
    function checkWin() {
        return board.every((num, index) => num === (index + 1) % 16);
    }

    // Start the timer
    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Update the timer display
    function updateTimer() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        timer.textContent = `${minutes}:${seconds}`;
    }

    // Reset game statistics
    function resetStats() {
        moveCount = 0;
        moveCounter.textContent = '0';
        timer.textContent = '00:00';
        gameStarted = false;
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    // End the game
    function endGame() {
        clearInterval(timerInterval);
        winModal.classList.remove('hidden');
    }

    // Setup event listeners
    function setupEventListeners() {
        restartButton.addEventListener('click', () => {
            scrambleBoard();
            winModal.classList.add('hidden');
        });

        playAgainButton.addEventListener('click', () => {
            scrambleBoard();
            winModal.classList.add('hidden');
        });
    }
})();