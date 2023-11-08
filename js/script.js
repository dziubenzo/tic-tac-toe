// MODULE - GAME BOARD
let gameBoard = (function () {
  // Create an empty game board as a 2D array
  let board = [
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

  // Get the board
  const getBoard = function () {
    return board;
  };

  // Clear the board
  const clearBoard = function () {
    board = [
      ['e', 'e', 'e'],
      ['e', 'e', 'e'],
      ['e', 'e', 'e'],
    ];
    return board;
  };
  return { showBoard, getBoard, clearBoard };
})();

// MODULE - GAME LOGIC
let gameLogic = (function () {
  // Variables related to the board
  let board = gameBoard.getBoard();
  const empty = 'e';
  const X = 'X';
  const O = 'O';

  // Variables for controlling game flow
  let ties = 0;
  let round = 1;
  let totalMoves = 1;
  const LAST_MOVE = 9;
  const SCORE_TO_WIN = 5;

  // Get a random array index between 0 and 2, both inclusive
  const getRandomIndex = function () {
    let min = Math.ceil(0);
    let max = Math.floor(2);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Put the player's marker randomly somewhere in the board
  const putMarkerRandomly = function (player) {
    let firstIndex;
    let secondIndex;
    // Find an empty board square
    do {
      firstIndex = getRandomIndex();
      secondIndex = getRandomIndex();
    } while (board[firstIndex][secondIndex] !== empty);
    // Put the player's marker there
    board[firstIndex][secondIndex] = player.marker;
    // Render board again
    gameBoard.showBoard();
  };

  // Play a round of tic-tac-toe
  const playRound = function () {
    while (totalMoves <= LAST_MOVE) {
      if (players.playerX.moves === players.playerO.moves) {
        putMarkerRandomly(players.playerX);
        if (totalMoves >= 5) {
          if (isGameOver(players.playerX)) {
            break;
          }
        }
        totalMoves++;
        players.playerX.moves++;
      } else {
        putMarkerRandomly(players.playerO);
        if (totalMoves >= 6) {
          if (isGameOver(players.playerO)) {
            break;
          }
        }
        totalMoves++;
        players.playerO.moves++;
      }
    }
    updateGameState();
  };

  // Check if any player is the winner
  const isGameOver = function (player) {
    // Define a winning combination and winning conditions
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
    if (winningPositions.includes(winningCombination)) {
      return true;
    }
    return false;
  };

  // Update and reset game variables when the game ends
  const updateGameState = function () {
    totalMoves = 1;
    round++;
    players.playerX.moves = 0;
    players.playerO.moves = 0;
    if (isGameOver(players.playerX)) {
      console.log(`${players.playerX.name} wins!`);
      players.playerX.score++;
    } else if (isGameOver(players.playerO)) {
      console.log(`${players.playerO.name} wins!`);
      players.playerO.score++;
    } else {
      console.log('Tie!');
      ties++;
    }
    console.log(`
    Round: ${round - 1}
    Player X score: ${players.playerX.score}
    Player O score: ${players.playerO.score}
    Ties: ${ties}
    `);
    // Clear the board
    board = gameBoard.clearBoard();
  };

  // Play the game until any player reaches scoreToWin
  const playGame = function (scoreToWin) {
    while (
      players.playerX.score < scoreToWin &&
      players.playerO.score < scoreToWin
    ) {
      playRound();
    }
  };

  return { playGame };
})();

// MODULE - PLAYERS
let players = (function () {
  // Factory function for creating players
  const createPlayer = function (name, marker) {
    let score = 0;
    let moves = 0;
    return { name, marker, score, moves };
  };

  // Get the marker of a human player
  const isX = confirm('Press OK to play as X. Press Cancel to play as O');

  // Create a human player
  const createHumanPlayer = function () {
    let humanPlayer;
    if (isX === true) {
      humanPlayer = createPlayer('Human Player', 'X');
    } else {
      humanPlayer = createPlayer('Human Player', 'O');
    }
    return humanPlayer;
  };

  // Create a computer player
  const createComputerPlayer = function () {
    let computerPlayer;
    if (isX === true) {
      computerPlayer = createPlayer('Computer 0', 'O');
    } else {
      computerPlayer = createPlayer('Computer X', 'X');
    }
    return computerPlayer;
  };

  return { createHumanPlayer, createComputerPlayer };
})();

gameLogic.playGame(5);
