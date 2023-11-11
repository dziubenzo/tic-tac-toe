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

  // Clear the board array and the board on the page once a round is over
  const clearBoard = function () {
    displayController.clearMarkers();
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
  let totalMoves = 0;
  let firstTo = 0;
  let firstArrayIndex;
  let secondArrayIndex;
  let square;

  const LAST_MOVE = 9;

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

  const boardDOM = document.querySelector('main .board');

  // Get a random array index between 0 and 2, both inclusive
  const getRandomIndex = function () {
    let min = Math.ceil(0);
    let max = Math.floor(2);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Put the computer's marker randomly somewhere in the board
  const putMarkerRandomly = function (player) {
    // Find an empty board square
    do {
      firstArrayIndex = getRandomIndex();
      secondArrayIndex = getRandomIndex();
    } while (board[firstArrayIndex][secondArrayIndex] !== empty);
    // Add the computer's marker to the array
    board[firstArrayIndex][secondArrayIndex] = player.marker;
    // Find correlator's key based on value
    const value = [firstArrayIndex, secondArrayIndex];
    let key = Object.keys(correlator).find(
      (key) => JSON.stringify(correlator[key]) === JSON.stringify(value)
    );

    // Display the marker on the board
    document.querySelector(`.square[data-id="${key}"] > span`).textContent =
      player.marker.toLowerCase();
    // Print the board to the console
    gameBoard.showBoard();
  };

  // Convert the data-id attribute from the DOM element to the indices corresponding to the given array item
  const convertData = function (square) {
    firstArrayIndex = correlator[square][0];
    secondArrayIndex = correlator[square][1];
  };

  // Put the human player's marker manually
  const putMarkerManually = function (player) {
    // Add the player's marker to the array
    board[firstArrayIndex][secondArrayIndex] = player.marker;
    // Display the marker on the board
    document.querySelector(`.square[data-id="${square}"] > span`).textContent =
      player.marker.toLowerCase();
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
    displayController.setStaticVariables(playerX.name, playerO.name, firstTo);
    boardDOM.addEventListener('click', (event) => {
      square = event.target.getAttribute('data-id');
      // Allow the game to progress if the board square clicked is an empty one
      if (square !== null) {
        convertData(square);
        playTurn();
        return;
      }
    });
  };

  // Play a turn of tic-tac-toe
  const playTurn = function () {
    if (playerX.moves === playerO.moves) {
      if (playerX.isHuman) {
        putMarkerManually(playerX);
      } else {
        putMarkerRandomly(playerX);
      }
      playerX.moves++;
      totalMoves++;
      if (
        (isGameOver(playerX) && totalMoves >= 5) ||
        totalMoves === LAST_MOVE
      ) {
        updateGameState();
        displayController.updateDynamicVariables(
          ties,
          playerX.score,
          playerO.score
        );
        return;
      }
    } else {
      if (playerO.isHuman) {
        putMarkerManually(playerO);
      } else {
        putMarkerRandomly(playerO);
      }
      playerO.moves++;
      totalMoves++;
      if (
        (isGameOver(playerO) && totalMoves >= 6) ||
        totalMoves === LAST_MOVE
      ) {
        updateGameState();
        displayController.updateDynamicVariables(
          ties,
          playerX.score,
          playerO.score
        );
        return;
      }
    }
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
    totalMoves = 0;
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
    // Clear the page board and the board array
    setTimeout(() => {
      board = gameBoard.clearBoard();
    }, 3000);
  };

  // Play the game until any player reaches scoreToWin
  const playGame = function (scoreToWin) {
    firstTo = scoreToWin;
    while (playerX.score < scoreToWin && playerO.score < scoreToWin) {
      playRound();
    }
  };

  return { createPlayers, playGame, playRound };
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
  // Init function
  const init = function () {
    showModal();
    listenForButtons();
    startGame();
  };

  // DOM elements
  const playerXName = document.querySelector('header .player-x');
  const playerOName = document.querySelector('header .player-o');
  const firstToValue = document.querySelector('header .first-to-value');
  const tiesCount = document.querySelector('header .ties-value');
  const scoreX = document.querySelector('.score-x .score');
  const scoreO = document.querySelector('.score-o .score');
  const markers = document.querySelectorAll('.square span');

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

  // Set static variables on the main page
  const setStaticVariables = function (nameX, nameO, scoreToWin) {
    playerXName.textContent = nameX;
    playerOName.textContent = nameO;
    firstToValue.textContent = scoreToWin;
  };

  // Update dynamic variables on the main page
  const updateDynamicVariables = function (ties, playerXScore, playerOScore) {
    tiesCount.textContent = ties;
    scoreX.textContent = playerXScore;
    scoreO.textContent = playerOScore;
  };

  // Clear markers displayed on the page
  const clearMarkers = function () {
    markers.forEach((square) => {
      square.textContent = '';
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
      gameLogic.playRound();
    });
  };
  return { init, setStaticVariables, updateDynamicVariables, clearMarkers };
})();

displayController.init();
