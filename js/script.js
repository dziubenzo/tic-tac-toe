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
    // Put the computer's marker there
    board[firstIndex][secondIndex] = player.marker;
    // Print the board to the console
    gameBoard.showBoard();
  };

  // Put the human player's marker manually
  const putMarkerManually = function (player) {
    let firstIndex;
    let secondIndex;
    // Create an object to correlate human input with the array item
    const correlator = {
      1: [0, 0],
      2: [0, 1],
      3: [0, 2],
      4: [1, 0],
      5: [1, 1],
      6: [1, 2],
      7: [2, 0],
      8: [2, 1],
      9: [2, 2],
    };
    // Make sure the selected board square is empty
    do {
      const answer = prompt(
        `Type a number between 1 and 9 to put your marker. Positions are as follows:

        1  |  2  |  3  
       ---------------
        4  |  5  |  6
       ---------------
        7  |  8  |  9
        `
      );
      if (answer >= 1 && answer <= 9) {
        firstIndex = correlator[answer][0];
        secondIndex = correlator[answer][1];
      }
    } while (board[firstIndex][secondIndex] !== empty);
    // Put the player's marker there
    board[firstIndex][secondIndex] = player.marker;
    // Print the board to the console
    gameBoard.showBoard();
  };

  // Create the right players based on modal form data
  const createPlayers = function (formData) {
    if (formData.playerX === 'human') {
      playerX = players.createHumanPlayer(formData.playerXName, 'X');
    } else {
      playerX = players.createComputerPlayer('X');
    }
    if (formData.playerO === 'human') {
      playerO = players.createHumanPlayer(formData.playerOName, 'O');
    } else {
      playerO = players.createComputerPlayer('O');
    }
  };

  // Play a round of tic-tac-toe
  const playRound = function () {
    while (totalMoves <= LAST_MOVE) {
      if (playerX.moves === playerO.moves) {
        if (playerX.isHuman) {
          putMarkerManually(playerX);
        } else {
          putMarkerRandomly(playerX);
        }
        if (totalMoves >= 5) {
          if (isGameOver(playerX)) {
            break;
          }
        }
        totalMoves++;
        playerX.moves++;
      } else {
        if (playerO.isHuman) {
          putMarkerManually(playerO);
        } else {
          putMarkerRandomly(playerO);
        }
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
    ${playerX.name}'s score (as X): ${playerX.score}
    ${playerO.name}'s score (as O): ${playerO.score}
    Ties: ${ties}
    `);
    // Clear the board
    board = gameBoard.clearBoard();
  };

  // Play the game until any player reaches scoreToWin
  const playGame = function (scoreToWin) {
    while (playerX.score < scoreToWin && playerO.score < scoreToWin) {
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

  // Create a human player
  const createHumanPlayer = function (name, marker) {
    let humanPlayer;
    if (marker === 'X') {
      humanPlayer = createPlayerObject(`${name}`, 'X', true);
    } else {
      humanPlayer = createPlayerObject(`${name}`, 'O', true);
    }
    return humanPlayer;
  };

  // Create a computer player
  const createComputerPlayer = function (marker) {
    let computerPlayer;
    if (marker === 'X') {
      computerPlayer = createPlayerObject('Computer', 'X', false);
    } else {
      computerPlayer = createPlayerObject('Computer', 'O', false);
    }
    return computerPlayer;
  };
  return { createHumanPlayer, createComputerPlayer };
})();

// MODULE - DISPLAY CONTROLLER
let displayController = (function () {
  // Show modal on page load
  const showModal = function () {
    const modal = document.querySelector('dialog');
    modal.showModal();
  };

  // Show or hide the name input field and label when the human or computer button is clicked
  const listenForButtons = function () {
    const modalButtons = document.querySelectorAll('input[type="radio"]');
    modalButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const nameLabel =
          button.parentNode.parentNode.querySelector('.name-label');
        const nameInput =
          button.parentNode.parentNode.querySelector('.name-input');
        const inputField = nameInput.querySelector('input');
        if (button.id.includes('human')) {
          nameLabel.removeAttribute('hidden', 'hidden');
          nameInput.removeAttribute('hidden', 'hidden');
          // Make the name input field required if the human button is clicked
          inputField.setAttribute('required', 'required');
          // Focus on the name input field if the former is clicked
          inputField.focus();
        } else {
          nameLabel.setAttribute('hidden', 'hidden');
          nameInput.setAttribute('hidden', 'hidden');
          inputField.removeAttribute('required', 'required');
        }
      });
    });
  };

  // Use modal form data to create players and start the game
  const startGame = function () {
    const modalForm = document.querySelector('#modal-form');
    modalForm.addEventListener('submit', () => {
      const playersToCreate = {
        playerX: modalForm.elements['player-x'].value,
        playerO: modalForm.elements['player-o'].value,
        playerXName: modalForm.elements['player-x-name'].value,
        playerOName: modalForm.elements['player-o-name'].value,
      };
      gameLogic.createPlayers(playersToCreate);
      gameLogic.playGame(2);
    });
  };
  return { showModal, listenForButtons, startGame };
})();

// Hide inside a module and use an init() module to run the app
displayController.showModal();
displayController.listenForButtons();
displayController.startGame();
