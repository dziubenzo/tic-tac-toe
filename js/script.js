// MODULE - GAME BOARD
let gameBoard = (function () {
  // Create an empty game board as a 2D array
  let board = [
    ['e', 'e', 'e'],
    ['e', 'e', 'e'],
    ['e', 'e', 'e'],
  ];

  // Get the board
  const getBoard = function () {
    return board;
  };

  // Clear the board array and the markers on the page
  const clearBoard = function () {
    displayController.clearMarkers();
    board = [
      ['e', 'e', 'e'],
      ['e', 'e', 'e'],
      ['e', 'e', 'e'],
    ];
    return board;
  };
  return { getBoard, clearBoard };
})();

// MODULE - GAME LOGIC
let gameLogic = (function () {
  // Variables related to the board
  let board = gameBoard.getBoard();
  const EMPTY = 'e';

  // Variables for controlling game flow
  let ties = 0;
  let round = 0;
  let totalMoves = 0;
  let playerX, playerO, endScore, square, firstArrayIndex, secondArrayIndex;

  const DELAY = 500;
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
    } while (board[firstArrayIndex][secondArrayIndex] !== EMPTY);
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
    // Remove hoverable class from the square with the marker
    if (player.marker === 'X') {
      document
        .querySelector(`.square[data-id="${key}"]`)
        .classList.remove('hoverable-o');
    } else {
      document
        .querySelector(`.square[data-id="${key}"]`)
        .classList.remove('hoverable-x');
    }
  };

  // Convert the data-id attribute from the DOM element to the indices corresponding to a given array item
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
    // Remove hoverable class from the square with the marker
    document
      .querySelector(`.square[data-id="${square}"]`)
      .classList.remove(`hoverable-${player.marker.toLowerCase()}`);
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
    displayController.makeHoverable(playerX, playerO);
  };

  // Play a round of tic-tac-toe
  const playRound = function () {
    // Run the method only once
    if (round === 0) {
      displayController.setStaticVariables(
        playerX.name,
        playerO.name,
        endScore
      );
    }
    // Stop execution if the score to end the game is reached
    if (playerX.score === endScore || playerO.score === endScore) {
      return;
    }
    // Get a valid board square click from the human to play their turn
    if (
      (playerX.isHuman && playerX.moves === playerO.moves) ||
      (playerO.isHuman && playerX.moves > playerO.moves)
    ) {
      boardDOM.addEventListener('click', function getValidClick(event) {
        square = event.target.getAttribute('data-id');
        let marker = event.target.querySelector('.marker');
        if (square !== null && marker.textContent === '') {
          convertData(square);
          boardDOM.removeEventListener('click', getValidClick);
          playTurn();
          playRound();
          // Change hoverable classes each turn if both players are human
          if (playerX.isHuman && playerO.isHuman) {
            displayController.changeHoverableClass();
          }
        }
      });
      // Otherwise, the computer plays its turn
    } else {
      setTimeout(() => {
        playTurn();
        playRound();
      }, DELAY);
    }
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
      displayController.styleCombination(
        winningPositions.indexOf(winningCombination)
      );
      return true;
    }
    return false;
  };

  // Update and reset game variables when the round ends
  const updateGameState = function () {
    totalMoves = 0;
    round++;
    playerX.moves = 0;
    playerO.moves = 0;
    if (isGameOver(playerX)) {
      playerX.score++;
    } else if (isGameOver(playerO)) {
      playerO.score++;
    } else {
      ties++;
    }
    // Clear the page board and the board array
    // Remove styling from the winning combination
    // Add hoverable class to all squares or remove all hoverable classes when the game is over
    // Display game over modal when the game is over
    setTimeout(() => {
      board = gameBoard.clearBoard();
      displayController.unstyleCombination();
      if (playerX.score === endScore || playerO.score === endScore) {
        displayController.removeHoverableClass();
        displayController.showGameOverModal(playerX, playerO, endScore, round);
      } else {
        displayController.makeHoverable(playerX, playerO);
      }
    }, DELAY);
  };

  // Play the game until any player reaches score
  const playGame = function (score) {
    endScore = score;
    playRound();
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
    showStartingModal();
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
  const squares = document.querySelectorAll('.square');
  const restartBtn = document.querySelector('.restart-button');
  let winningCombination = [1, 2, 3];

  // Refresh the page if the restart button is clicked
  restartBtn.addEventListener('click', () => {
    window.location.reload();
  });

  // Show starting modal on page load
  const showStartingModal = function () {
    const startingModal = document.querySelector('#starting-modal');
    startingModal.showModal();
    // Prevent modal from closing on pressing the Esc key
    startingModal.addEventListener('cancel', (event) => {
      event.preventDefault();
    });
  };

  // Show game over modal
  // Display winner details and rounds played
  // Refresh the page if the start new game button is clicked
  const showGameOverModal = function (playerX, playerO, endScore, rounds) {
    const gameOverModal = document.querySelector('#game-over-modal');
    const winner = document.querySelector('.winning-player');
    const winnerMarker = document.querySelector('.winning-player-marker');
    const roundsPlayed = document.querySelector('.rounds');
    const newGameButton = document.querySelector('#game-over-modal button');
    gameOverModal.showModal();
    if (playerX.score === endScore) {
      winner.textContent = playerX.name;
      winnerMarker.textContent = playerX.marker;
    } else {
      winner.textContent = playerO.name;
      winnerMarker.textContent = playerO.marker;
    }
    roundsPlayed.textContent = rounds;
    newGameButton.addEventListener('click', () => {
      window.location.reload();
    });
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
    markers.forEach((marker) => {
      marker.textContent = '';
    });
  };

  // Make all squares hoverable if at least one player is human
  // Make sure that only one hoverable class is added
  const makeHoverable = function (playerX, playerO) {
    squares.forEach((square) => {
      if (playerX.isHuman) {
        square.classList.add('hoverable-x');
        square.classList.remove('hoverable-o');
      } else if (playerO.isHuman) {
        square.classList.add('hoverable-o');
        square.classList.remove('hoverable-x');
      }
    });
  };

  // Change hoverable classes to hoverable-x or hoverable-o depending on which one is already added to the square
  const changeHoverableClass = function () {
    squares.forEach((square) => {
      if (square.classList.contains('hoverable-x')) {
        square.classList.replace('hoverable-x', 'hoverable-o');
      } else if (square.classList.contains('hoverable-o')) {
        square.classList.replace('hoverable-o', 'hoverable-x');
      }
    });
  };

  // Remove hoverable classes when the game is over
  const removeHoverableClass = function () {
    squares.forEach((square) => {
      square.classList.remove('hoverable-x');
      square.classList.remove('hoverable-o');
    });
  };

  // Add styling to the winning combination
  const styleCombination = function (index) {
    const winningSquares = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [7, 5, 3],
    ];
    // Determine winning combination
    winningCombination = winningSquares[index];
    // Add class to the winning board squares
    for (let i = 0; i < 3; i++) {
      document
        .querySelector(`.square[data-id="${winningCombination[i]}"] > span`)
        .classList.add('winner');
    }
  };

  // Remove styling from the winning combination
  const unstyleCombination = function () {
    // Remove class from the winning board squares
    for (let i = 0; i < 3; i++) {
      document
        .querySelector(`.square[data-id="${winningCombination[i]}"] > span`)
        .classList.remove('winner');
    }
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
      const gameLength = Number(modalForm.elements['first-to'].value);
      gameLogic.createPlayers(playersToCreate);
      gameLogic.playGame(gameLength);
    });
  };
  return {
    init,
    setStaticVariables,
    updateDynamicVariables,
    clearMarkers,
    styleCombination,
    unstyleCombination,
    makeHoverable,
    changeHoverableClass,
    removeHoverableClass,
    showGameOverModal,
  };
})();

displayController.init();
