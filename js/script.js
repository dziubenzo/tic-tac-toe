// Game board module
let gameBoard = (function () {
  // Create the game board as a 2D array
  const board = [
    ['e', 'e', 'e'],
    ['e', 'e', 'e'],
    ['e', 'e', 'e'],
  ];

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

  // Get board
  const getBoard = function () {
    return board;
  };
  return { showBoard, getBoard };
})();

// Module responsible for game logic
let gameLogic = (function () {
  // Variables related to the board
  const board = gameBoard.getBoard();
  const empty = 'e';
  const X = 'X';
  const O = 'O';

  // Variables for controlling game flow
  let scoreX = 0;
  let scoreO = 0;
  let ties = 0;
  let round = 0;
  let turn = 1;
  let counterX = 0;
  let counterY = 0;
  const scoreToWin = 5;

  // Get a random array index between 0 and 2, both inclusive
  const randomIndex = function () {
    let min = Math.ceil(0);
    let max = Math.floor(2);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Put a random X or Y somewhere in the board
  const putMarkerRandomly = function (marker) {
    const firstIndex = randomIndex();
    const secondIndex = randomIndex();
    // Check board square for emptiness
    // Rerun the function is the square is already taken
    if (board[firstIndex][secondIndex] === empty) {
      board[firstIndex][secondIndex] = marker;
    } else if (
      board[firstIndex][secondIndex] === X ||
      board[firstIndex][secondIndex] === O
    )
      putMarkerRandomly(marker);
    // Render board again
    gameBoard.showBoard();
  };

  // Play a round of tic-tac-toe
  const playRound = function () {
    while (turn < 10)
      if (counterX === counterY) {
        putMarkerRandomly(players.playerX.marker);
        turn++;
        counterX++;
      } else {
        putMarkerRandomly(players.playerO.marker);
        turn++;
        counterY++;
      }
  };

  // Check if any of the winning conditions is true
  const isGameOver = function (player) {
    const winningCombination = player.marker + player.marker + player.marker;
    const winningPositions = [
      board[0][0] + board[0][1] + board[0][2],
      board[1][0] + board[1][1] + board[1][2],
      board[2][0] + board[2][1] + board[2][2],
      board[0][0] + board[1][0] + board[2][0],
      board[0][1] + board[1][1] + board[2][1],
      board[0][2] + board[1][2] + board[2][2],
      board[0][0] + board[1][1] + board[2][2],
      board[2][0] + board[1][1] + board[0][2],
    ];
    return winningPositions;
  };

  return { playRound, isGameOver };
})();

// Module responsible for handling players
let players = (function () {
  // Factory function for creating players
  const createPlayer = function (name, marker) {
    return { name, marker };
  };
  // Create two players
  const playerX = createPlayer('Misza', 'X');
  const playerO = createPlayer('Adolf', 'O');
  return { playerX, playerO };
})();

gameLogic.playRound();
console.log(gameLogic.isGameOver(players.playerO));
