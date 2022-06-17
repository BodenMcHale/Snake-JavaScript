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
    - Redo key inputs
    - Add sfx
    - Reformat code
    - Update index.html

    Author
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Twitter: @Boden_McHale https://twitter.com/Boden_McHale
    Blog: https://lostrabbitdigital.com/blog/
    Last Updated: June 16th 2022
*/

// Section of the snake, only has the X and Y coordinate
class SnakePart 
{
	constructor(x, y) 
	{
		this.x = x;
		this.y = y;
	}
}

// The whole snake
class Snake 
{
	constructor(game, x, y, initialPartsAmount) 
	{
		this.game = game;
		this.x = x;
		this.y = y;
		this.isAlive = true;
		this.looping = document.getElementById('loopCanvasCheckbox').checked;

		// Determines if the snake is going Up / Down or Left / Right
		this.xSpeed = 1;
		this.ySpeed = 0;

		// Create the sections of the snake
		this.parts = [];
		for (var index = 0; index < initialPartsAmount; index++)
			this.parts.push(new SnakePart(x-index, y));

		// Captures the key pressed by the player
		var _this = this; 
		document.addEventListener('keydown', function (event) 
		{
			_this.controller(event.which);
		});
	}

    // Snake control
	controller(key) 
	{
		// Enter
		if (key == 13) 
			this.game.isPaused = !this.game.isPaused;

		// If it is paused it will not receive any other input
		if (this.game.isPaused)
			return;
		
		// Shift
		if (key == 16)
			this.looping = !this.looping;

		// Left
		if (key == 37 && this.ySpeed != 0) 
		{
			this.canChangeDirection = false;
			this.xSpeed = -1;
			this.ySpeed = 0;
		}

		// Right
		if (key == 39 && this.ySpeed != 0) 
		{
			this.canChangeDirection = false;
			this.xSpeed = 1;
			this.ySpeed = 0;
		}

		// Up
		if (key == 38 && this.xSpeed != 0) 
		{
			this.canChangeDirection = false;
			this.xSpeed = 0;
			this.ySpeed = -1;
		}

		// Down 
		if (key == 40 && this.xSpeed != 0) 
		{
			this.canChangeDirection = false;
			this.xSpeed = 0;
			this.ySpeed = 1;
		}
	}

	// Add a new section to the end of the snake
	addPart() 
	{
		var lastPart = this.parts[this.parts.length - 1];
		this.parts.push(new SnakePart(lastPart.x, lastPart.y));
	}

	// Update the snake in the canvas
	update() 
	{
		this.x += this.xSpeed;
		this.y += this.ySpeed;

        if(this.looping)
		{
       		// Loop the snake around the canvas instead of ending the game
			if (this.x > this.game.width - 1)
				this.x = 0;
			if (this.x < 0) 
				this.x = this.game.width -1

			if (this.y > this.game.height - 1)
				this.y = 0;
			if (this.y < 0) 
				this.y = this.game.height - 1;
		}
		else
		{
			// End the game when the snake touches the edge of the canvas
			if (this.x >= this.game.width - 1)
				this.isAlive = false;
			if (this.x <= 0) 
				this.isAlive = false;
			
			if (this.y >= this.game.height - 1)
				this.isAlive = false;
			if (this.y <= 0) 
				this.isAlive = false;
		}

		// Draws each section starting by the last
		for (var index = this.parts.length - 1; index >= 0; index--) 
		{
			var part = this.parts[index];

			if (index != 0)
			{
				part.x = this.parts[index - 1].x;
				part.y = this.parts[index - 1].y;

				// If the head touches any section of the body the game ends
				if (this.x == part.x && this.y == part.y) 
					this.die();
			}
			else 
			{
				part.x = this.x;
				part.y = this.y;
			}
            
            // Snake
			this.game.grid.fillTile(part.x, part.y, "#fac800");
		}
	}

	// End the game
	die() 
	{
		this.isAlive = false;
	}

}

// Calculate and place food
class Food 
{
	constructor(game) 
	{
		this.game = game;
		this.placeFood();
	}

	// Places a food in a random tile in the grid
	placeFood() 
	{
		this.x = Math.floor(Math.random() * this.game.width);
		this.y = Math.floor(Math.random() * this.game.height);
	}

	// Draw the food in the grid 
	update() 
	{
        // Food
		this.game.grid.fillTile(this.x, this.y, "#00e5fa");
	}
}
// The game grid, this can be any size
class DrawGrid 
{
	constructor(game) 
	{
		this.game = game;
		this.grid = [];

		this.buildGrid();
	}

	buildGrid() 
	{
		// Loop through all the rows of the grid
		for (var x = 0; x < this.game.width; x++) 
		{
			this.grid[x] = [];

			// Loop through all the columns of the grid
			for (var y = 0; y < this.game.height; y++) 
			{
				// Create a tile to add to the grid
				var divTile = document.createElement("div");
				divTile.style.position = "absolute";
				divTile.style.width = divTile.style.height = this.game.size + "px";
				divTile.style.left = x * this.game.size + "px";
				divTile.style.top = y * this.game.size + "px";

				// Add the newly created tile to the grid
				this.game.divStage.appendChild(divTile);

				this.grid[x][y] = 
				{
					div: divTile,
					isFilled: false,
					color: "white"
				};
			}
		}
	}

	fillTile(x, y, color) 
	{
		if (this.grid[x]) 
		{
			if (this.grid[x][y]) 
			{
				var tile = this.grid[x][y];

				tile.isFilled = true;
				tile.color = color;
			}
		}
	}

	update() 
	{
		for (var x = 0; x < this.game.width; x++) 
		{
			for (var y = 0; y < this.game.height; y++) 
			{
				var tile = this.grid[x][y];

                // Background
				var newBackgroundColor = tile.isFilled ? tile.color : "#000000";
				tile.div.style.background = newBackgroundColor;

				// Needs to be reset incase the next frame needs it filled
				tile.isFilled = false;
			}
		}
	}
}

class Game 
{
	constructor(size, fps, divStageId, spanScoreId, spanDeathsId, spanMaxScoreId) 
	{
		this.width = size;
		this.height = size;
		this.size = size;
		this.fps = fps;
		this.isPaused = true;

		this.divStage = document.getElementById(divStageId);
		this.spanScore = document.getElementById(spanScoreId);
		this.spanDeaths = document.getElementById(spanDeathsId);
		this.spanMaxScore = document.getElementById(spanMaxScoreId);

		this.score = 0;
		this.deaths = 0;
		this.maxScore = this.score;
		this.grid = new DrawGrid(this);
		this.food = new Food(this);
		this.snake = new Snake(this, 5, 2, 3);

		//Start loop.
		var _this = this;
		this.interval = setInterval(function () 
		{
			_this.update();
		}, 1000/this.fps);
	}

	update() 
	{
		if (this.isPaused)
			return;

		this.spanScore.innerHTML = this.score;
		this.spanDeaths.innerHTML = this.deaths;
		this.spanMaxScore.innerHTML = this.maxScore;

		if (!this.snake.isAlive) 
		{
			this.maxScore = this.score > this.maxScore ? this.score : this.maxScore;
			this.score = 0;
			this.deaths++;

			this.snake = new Snake(this, 5, 2, 3);
			this.food.placeFood();
		}

		this.food.update();
		this.snake.update();

		// Add a new section to the snake if it touches the food
		if (this.snake.x == this.food.x && this.snake.y == this.food.y) 
		{
			this.food.placeFood();
			this.snake.addPart();
			this.score++;
		}

		this.grid.update();
	}
}
