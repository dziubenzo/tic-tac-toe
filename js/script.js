// Game board module
let gameBoard = (function () {
  // Create the game board as a 2D array
  const board = [
    ['e', 'e', 'e'],
    ['e', 'e', 'e'],
    ['e', 'e', 'e'],
  ];
  const empty = 'e';

  // Print the formatted board to the console
  const showBoard = function () {
    console.log(`
      ${board[0][0]}  |  ${board[0][1]}  |  ${board[0][2]}
    -----|-----|-----
      ${board[1][0]}  |  ${board[1][1]}  |  ${board[1][2]}
    -----|-----|-----
      ${board[2][0]}  |  ${board[2][1]}  |  ${board[2][2]}
    `);
  };

  // Put a random X somewhere in the board if the array is empty
  const updateBoard = function () {
    const firstIndex = gameLogic.randomIndex();
    const secondIndex = gameLogic.randomIndex();
    // Check board square for emptiness
    if (board[firstIndex][secondIndex] === empty) {
      board[firstIndex][secondIndex] = 'X';
    }
    // Render board again
    showBoard();
  };
  return { showBoard, updateBoard };
})();

// Module responsible for game logic
let gameLogic = (function () {
  // Get a random array index between 0 and 2, both inclusive
  const randomIndex = function () {
    let min = Math.ceil(0);
    let max = Math.floor(2);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  return { randomIndex };
})();

gameBoard.showBoard();
gameBoard.updateBoard();
