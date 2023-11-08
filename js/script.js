let gameBoard = (function () {
  // Create the game board as a 2D array
  let board = [
    ['e', 'e', 'e'],
    ['e', 'e', 'e'],
    ['e', 'e', 'e'],
  ];
  // Print the formatted board to the console
  let showBoard = function () {
    console.log(`
      ${board[0][0]}  |  ${board[0][1]}  |  ${board[0][2]}
    -----|-----|-----
      ${board[1][0]}  |  ${board[1][1]}  |  ${board[1][2]}
    -----|-----|-----
      ${board[2][0]}  |  ${board[2][1]}  |  ${board[2][2]}
    `);
  };
  return { showBoard };
})();

gameBoard.showBoard();

// Get a random array index between 0 and 2, both inclusive
function randomIndex() {
  let min = Math.ceil(0);
  let max = Math.floor(2);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
