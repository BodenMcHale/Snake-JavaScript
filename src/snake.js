let canvas = document.getElementById('game');
let context = canvas.getContext('2d');

// Canvas Width/Height, Snake X/Y, food X/Y must be divisible by canvasGrid
// Canvas / canvasGrid = Whole Int
// 400 / 16 = 25
canvas.height = 400;
canvas.width = 400;
let canvasGrid = 16;

// Game loop
let loopCount = 0;

let snake = 
{
    // Initial starting location
    x: randomXPositionOnGrid(),
    y: randomYPositionOnGrid(),

    // Snake velociry
    dx: canvasGrid,
    dy: 0,

    // Snake cells
    cells: [],

    // Length of the snake
    // Set this here for the inital length
    maxCells: 2
};

let food = 
{
    x: randomXPositionOnGrid(),
    y: randomYPositionOnGrid()
};

// Gets a random X position that is divisible by the canvasGrid
function randomXPositionOnGrid()
{
    ranPosX = Math.floor(Math.random() * ((canvas.width) - 0)) + 0;

    while(ranPosX % canvasGrid !== 0)
    {
        ranPosX++;
    }

    return ranPosX;
}

// Gets a random Y position that is divisible by the canvasGrid
function randomYPositionOnGrid()
{
    ranPosX = Math.floor(Math.random() * ((canvas.width) - 0)) + 0;

    while(ranPosX % canvasGrid !== 0)
    {
        ranPosX++;
    }

    return ranPosX;
}

// Get a random whole number within a specific range
function getRandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min)) + min;
}

// Get a random whole number within a specific range
function getRandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min)) + min;
}

// The main game loop
function game() 
{
  requestAnimationFrame(game);

  // Set the FPS to 15
  // 60/15 = 4
  if (loopCount++ < 4) {
    return;
  }

  loopCount = 0;
  context.clearRect(0,0,canvas.width,canvas.height);

  // move snake by it's velocity
  snake.x += snake.dx;
  snake.y += snake.dy;

  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - canvasGrid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - canvasGrid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});

  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // draw food
  context.fillStyle = 'red';
  context.fillRect(food.x, food.y, canvasGrid-1, canvasGrid-1);

  // draw snake one cell at a time
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {

    // drawing 1 px smaller than the canvasGrid creates a canvasGrid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, canvasGrid-1, canvasGrid-1);

    // snake ate food
    if (cell.x === food.x && cell.y === food.y) {
      snake.maxCells++;

      // canvas is 400x400 which is 25x25 grids
      food.x = getRandomInt(0, 25) * canvasGrid;
      food.y = getRandomInt(0, 25) * canvasGrid;
    }

    // check collision with all cells after this one (modified bubble sort)
    for (let i = index + 1; i < snake.cells.length; i++) {

      // snake occupies same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = canvasGrid;
        snake.dy = 0;

        food.x = getRandomInt(0, 25) * canvasGrid;
        food.y = getRandomInt(0, 25) * canvasGrid;
      }
    }
  });
}

// listen to keyboard events to move the snake
document.addEventListener('keydown', function(e) {
  // prevent snake from backtracking on itself by checking that it's
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body)

  // left arrow key
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -canvasGrid;
    snake.dy = 0;
  }
  // up arrow key
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -canvasGrid;
    snake.dx = 0;
  }
  // right arrow key
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = canvasGrid;
    snake.dy = 0;
  }
  // down arrow key
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = canvasGrid;
    snake.dx = 0;
  }
});

// start the game
requestAnimationFrame(game);