/*
    License
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    MIT License
    Copyright (c) 2022, Boden McHale
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
	
    Future Modifications
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  	- SFX
    - Convert FPS counter to function, halfway done
    - Add difficulty levels which are different speeds
    - Add thicker yellow border to favicon
    - Add mute button
    - Bug: Sometimes food doesn't spawn

    Author
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Twitter: @Boden_McHale https://twitter.com/Boden_McHale
    Blog: https://lostrabbitdigital.com/blog/
    Last Updated: June 16th 2022
*/


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
let isPaused = false;

let foodColor = `rgb(0, 250, 230)`;
let snakeBodyColor = `rgb(150, 0, 150)`;
let snakeHeadColor = `rgb(250, 0, 250)`;
// Border around Snake and Food
let pixelOffset = 2;

let score = 0;
let maxScore = score;
let lives = 3;

let snake = 
{
    // Initial starting location
    x: getRandomXPositionOnGrid(),
    y: getRandomYPositionOnGrid(),

    // Snake velociry
    dx: canvasGrid,
    dy: 0,

    // Snake cells
    cells: [],

    // Length of the snake
    // Set this here for the inital length
    maxCells: 1
};

let food = 
{
    x: getRandomXPositionOnGrid(),
    y: getRandomYPositionOnGrid()
};

// Gets a random X position that is divisible by the canvasGrid
function getRandomXPositionOnGrid()
{
    ranPosX = Math.floor(Math.random() * ((canvas.width) - 0)) + 0;

    while(ranPosX % canvasGrid !== 0)
    {
        ranPosX++;
    }

    return ranPosX;
}

// Gets a random Y position that is divisible by the canvasGrid
function getRandomYPositionOnGrid()
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

function resetGame()
{
  snake.x = 160;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 1;
  snake.dx = canvasGrid;
  snake.dy = 0;
  lives = 3;
  score = 0;

  spawnFood();
}

function resetPlayer()
{
  snake.x = 160;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 1;
  snake.dx = canvasGrid;
  snake.dy = 0;
  lives--;
  score = 0;

  spawnFood();
}
function playSFXDeath()
{
  if (!mute)
  {
    //let sfxMusic = new Audio('audio/death.mp3');
  }
}

function playSFXFood()
{
  if (!mute)
  {
    //let sfxMusic = new Audio('audio/food.mp3');
    
  }
}

function playSFXMusic()
{
  if (!mute)
  {
    //let sfxMusic = new Audio('audio/music.mp3');
  }
}

function wrapSnake()
{
  // Wrap the position of the Snake horizontally
  if (snake.x < 0) 
  {
    snake.x = canvas.width - canvasGrid;
  }
  else if (snake.x >= canvas.width) 
  {
    snake.x = 0;
  }

  // Wrap the position of the Snake vertically
  if (snake.y < 0) 
  {
    snake.y = canvas.height - canvasGrid;
  }
  else if (snake.y >= canvas.height) 
  {
    snake.y = 0;
  }
}

function doNotWrapSnake()
{

  if (snake.x < 0) 
  {
    resetPlayer();
  }
  else if (snake.x >= canvas.width) 
  {
    resetPlayer();
  }

  if (snake.y < 0) 
  {
    resetPlayer();
  }
  else if (snake.y >= canvas.height) 
  {
    resetPlayer();
  }
}

function drawUI()
{
  document.getElementById('max_score').innerHTML = maxScore;
  document.getElementById('score').innerHTML = score;
  document.getElementById('lives').innerHTML = lives;
}

function drawFood()
{
  // draw food
  context.fillStyle = foodColor;
  context.fillRect(food.x, food.y, canvasGrid-pixelOffset, canvasGrid-pixelOffset);
}

function spawnFood()
{
  food.x = getRandomInt(0, 25) * canvasGrid;
  food.y = getRandomInt(0, 25) * canvasGrid;
}

function drawSnake()
{
    // Draw one cell of the Snake at a time
    snake.cells.forEach(function(cell, index) 
    {
      context.fillStyle = snakeBodyColor;
      // Draw the body - pixelOffset to see a border around each cell
      context.fillRect(cell.x, cell.y, canvasGrid-pixelOffset, canvasGrid-pixelOffset);
      
      for (let i = index; i < 1; i++) 
      {
        context.fillStyle = snakeHeadColor;
        // Draw the head - pixelOffset to see a border around each cell
        // This layers another rectangle on top of the body
        context.fillRect(cell.x, cell.y, canvasGrid - pixelOffset, canvasGrid - pixelOffset);
      }
    });
}

function moveSnake()
{
  snake.x += snake.dx;
  snake.y += snake.dy;
}

function feedSnake()
{
  snake.cells.forEach(function(cell, index) 
  {
    if (cell.x === food.x && cell.y === food.y) 
    {
      snake.maxCells++;
      score++;

      spawnFood();
    }
  });
}

function checkCollisions()
{
  snake.cells.forEach(function(cell, index) 
  {
    // Search through each cell, including the snake cell
    for (let i = index + 1; i < snake.cells.length; i++) 
    {
      // If the Snake collides with itself, kill the player
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) 
      {
        resetPlayer();
      }
    }
  });
}

function checkLives()
{
  if (lives <= 0)
  {
    resetGame();
  }
}

function controls()
{
  // Allows input from WASD, wasd, Arrow Keys
  document.addEventListener('keydown', 
  function(event) 
  {
    if (event.key === 'ArrowLeft' && snake.dx == 0 || event.key === 'A' && snake.dx == 0 || event.key === 'a' && snake.dx == 0) {
      snake.dx = -canvasGrid;
      snake.dy = 0;
    }
    else if (event.key === 'ArrowRight' && snake.dx == 0 || event.key === 'D' && snake.dx == 0 || event.key === 'd' && snake.dx == 0) {
      snake.dx = canvasGrid;
      snake.dy = 0;
    }
    else if (event.key === 'ArrowUp' && snake.dy == 0 || event.key === 'W' && snake.dy == 0 || event.key === 'w' && snake.dy == 0) {
      snake.dy = -canvasGrid;
      snake.dx = 0;
    }
    else if (event.key === 'ArrowDown' && snake.dy == 0 || event.key === 'S' && snake.dy == 0 || event.key === 's' && snake.dy == 0) {
      snake.dy = canvasGrid;
      snake.dx = 0;
    } 
    else if (event.key === 'Enter')
    {
      isPaused = !isPaused;
    }
  });
}

function game() 
{
  requestAnimationFrame(game);

  if (isPaused)
    return;

  // Set the FPS to 15
  // 60/15 = 4
  let targetFPS = 15;
  let targetFPSConverted = 60/targetFPS;
  console.log(targetFPSConverted);
  if (loopCount++ < 4) {
    return;
  }

  loopCount = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);

  maxScore = score > maxScore ? score : maxScore;

  drawUI();
  drawFood();
  drawSnake();
  moveSnake();
  //wrapSnake();
  doNotWrapSnake();
  feedSnake();
  checkCollisions();
  checkLives();

  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});

  // Add movement
  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
}

// Call controls() outside of game() to avoid missing key inputs
controls();


// start the game
requestAnimationFrame(game);