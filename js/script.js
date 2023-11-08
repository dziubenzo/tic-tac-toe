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
  let round = 1;
  let turn = 1;
  let counterX = 0;
  let counterY = 0;
  const LAST_TURN = 9;
  const SCORE_TO_WIN = 5;

  // Get a random array index between 0 and 2, both inclusive
  const randomIndex = function () {
    let min = Math.ceil(0);
    let max = Math.floor(2);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Put a random X or Y somewhere in the board
  const putMarkerRandomly = function (player) {
    const firstIndex = randomIndex();
    const secondIndex = randomIndex();
    // Check board square for emptiness
    // Rerun the function is the square is already taken
    if (board[firstIndex][secondIndex] === empty) {
      board[firstIndex][secondIndex] = player.marker;
    } else if (
      board[firstIndex][secondIndex] === X ||
      board[firstIndex][secondIndex] === O
    ) {
      putMarkerRandomly(player);
    }
    // Render board again
    gameBoard.showBoard();
  };

  // Play a round of tic-tac-toe
  const playRound = function () {
    while (turn <= LAST_TURN) {
      if (counterX === counterY) {
        putMarkerRandomly(players.playerX);
        if (turn >= 5) {
          if (isGameOver(players.playerX)) {
            break;
          }
        }
        turn++;
        counterX++;
      } else {
        putMarkerRandomly(players.playerO);
        if (turn >= 6) {
          if (isGameOver(players.playerO)) {
            break;
          }
        }
        turn++;
        counterY++;
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
    } else {
      return false;
    }
  };

  // Update and reset game variables when the game ends
  const updateGameState = function () {
    turn = 1;
    round++;
    counterX = 0;
    counterO = 0;
    if (isGameOver(players.playerX)) {
      console.log(`${players.playerX.name} wins!`);
      scoreX++;
    } else if (isGameOver(players.playerO)) {
      console.log(`${players.playerO.name} wins!`);
      scoreO++;
    } else {
      console.log('Tie!');
      ties++;
    }
    console.log(`
    Player X score: ${scoreX}
    Player O score: ${scoreO}
    Ties: ${ties}
    `);
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
