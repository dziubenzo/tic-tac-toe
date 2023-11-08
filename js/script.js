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
  const DEFAULT_SCORE_TO_WIN = 5;

  // Get a random array index between 0 and 2, both inclusive
  const getRandomIndex = function () {
    let min = Math.ceil(0);
    let max = Math.floor(2);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Put the computer's marker randomly somewhere in the board
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

  // Put the human player's marker manually
  // TBC

  // Create players
  const createPlayers = function () {
    if (players.isX === true) {
      playerX = players.createHumanPlayer();
      console.log(playerX);
      playerO = players.createComputerPlayer();
    } else {
      playerX = players.createComputerPlayer();
      playerO = players.createHumanPlayer();
    }
  };

  // Play a round of tic-tac-toe
  const playRound = function () {
    while (totalMoves <= LAST_MOVE) {
      if (playerX.moves === playerO.moves) {
        putMarkerRandomly(playerX);
        if (totalMoves >= 5) {
          if (isGameOver(playerX)) {
            break;
          }
        }
        totalMoves++;
        playerX.moves++;
      } else {
        putMarkerRandomly(playerO);
        if (totalMoves >= 6) {
          if (isGameOver(playerO)) {
            break;
          }
        }
        totalMoves++;
        playerO.moves++;
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
    playerX.moves = 0;
    playerO.moves = 0;
    if (isGameOver(playerX)) {
      console.log(`${playerX.name} wins!`);
      playerX.score++;
    } else if (isGameOver(playerO)) {
      console.log(`${playerO.name} wins!`);
      playerO.score++;
    } else {
      console.log('Tie!');
      ties++;
    }
    console.log(`
    Round: ${round - 1}
    X score: ${playerX.score}
    O score: ${playerO.score}
    Ties: ${ties}
    `);
    // Clear the board
    board = gameBoard.clearBoard();
  };

  // Play the game until any player reaches scoreToWin
  const playGame = function (scoreToWin) {
    while (
      playerX.score < scoreToWin &&
      playerO.score < scoreToWin
    ) {
      playRound();
    }
  };

  return { createPlayers, playGame };
})();

// MODULE - PLAYERS
let players = (function () {
  // Factory function for creating players
  const createPlayerObject = function (name, marker, isHuman) {
    let score = 0;
    let moves = 0;
    return { name, marker, isHuman, score, moves };
  };

  // Get the name and marker of a human player
  const playerName = prompt('Enter your name:');
  const isX = confirm('Press OK to play as X. Press Cancel to play as O.');

  // Create a human player
  const createHumanPlayer = function () {
    let humanPlayer;
    if (isX === true) {
      humanPlayer = createPlayerObject(`${playerName}`, 'X', true);
    } else {
      humanPlayer = createPlayerObject(`${playerName}`, 'O', true);
    }
    return humanPlayer;
  };

  // Create a computer player
  const createComputerPlayer = function () {
    let computerPlayer;
    if (isX === true) {
      computerPlayer = createPlayerObject('Computer 0', 'O', false);
    } else {
      computerPlayer = createPlayerObject('Computer X', 'X', false);
    }
    return computerPlayer;
  };

  return { createHumanPlayer, createComputerPlayer, isX };
})();

gameLogic.createPlayers();
gameLogic.playGame(5);
