/**
 * This is a simple implementation of the Snake game in
 * JavaScript.
 */


/**
 * @param {number} width Represents the width of the board.
 * @param {number} height Represents the height of the board.
 * @struct @constructor
 */
function Board(width, height) {
  this.width_ = width;
  this.height_ = height;
  // Initialize an empty baord.
  this.board_ = new Array(height);
  for (var i = 0; i < height; i++) {
  	this.board_[i] = new Array(width);
  };

  /**
   * @private {?Snake}
   */
  this.snake_ = null;
}


/**
 * Check if the x and y coordinates is inside a Snake's body.
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */
Board.prototype.isSnakeBody = function(x, y) {
  var result = false;
  this.snake_.body.forEach(function (bodyPart) {
  	if ((x === bodyPart.x) && (y === bodyPart.y)) {
  	  result = true;
  	}
  })
  return result;
};


/**
 * Prints the current board.
 */
Board.prototype.print = function() {
  for (var y = 0; y < this.height_; y++) {
  	var row = '';
  	for (var x = 0; x < this.width_; x++) {
  		var value = this.board_[x][y];
  		if (this.isSnakeBody(x, y)) {
  			value = '-';
  		}
  		row += (value ? value : 0) + ' ';
  	}
    console.log(row);
  };
  console.log('____________________________________');
};


/**
 * Adds a snake to the board.
 * @param {Snake} snake
 */
Board.prototype.addSnake = function(snake) {
  this.snake_ = snake;
};


/**
 * Initializes the board with several eatable objects
 * @param {number} numObjs
 */
Board.prototype.initialize = function(numObjs) {
  var self = this;
  this.pieces_ = [];

  while (numObjs) {
  	var x = Math.floor(Math.random() * (this.width_));
  	var y = Math.floor(Math.random() * (this.height_));
  	if (!this.board_[x][y]) {
  	  this.board_[x][y] = new Piece();
  	  this.pieces_.push({x: x, y: y});
  	  numObjs--;
  	};
  }
};

/**
 * A piece is an eatable piece by the Snake.
 * @struct @constructor
 */
function Piece() {
  this.char_ = '#';
  this.point = 1;
}


/**
 * Prints the current piece.
 */
Piece.prototype.toString = function() {
  return this.char_;
};


/**
 * A star is a special piece.
 * @struct @constructor
 * @extends {Piece}
 */
function Star() {
  this.char_ = '*'
  this.point = 2;
}
Star.prototype = new Piece();


/*
 * Engine controls how the game runs
 * @param {Board} board
 * @param {Snake} snake
 * @struct @constructor
 */
function Engine(board, snake) {
  this.board_ = board;
  this.snake_ = snake;
  /* @enum
   * 0 - Left
   * 1 - Up
   * 2 - Right
   * 3 - Down
   */
  this.currentSnakeDirection_ = 0;
}


/**
 * Direction input from the user
 * @param {number} direction
 */
Engine.prototype.input = function(direction) {
  this.currentSnakeDirection_ = direction;
}


/**
 * Runs the game with update every 1 second.
 */
Engine.prototype.run = function() {
  this.board_.addSnake(this.snake_);
  this.board_.print();
  setInterval(this.update.bind(this), 1000);
}


/**
 * Updates the state of the game.
 */
Engine.prototype.update = function() {
  this.snake_.body.pop();
  var head = this.snake_.body[0];
  // Decide new head position based on the current direction
  var newHead = {
  	x: head.x-1,
  	y: head.y
  }
  if (newHead.x < 0) {
  	this.gameOver();
  } else if (this.board_.isSnakeBody(newHead.x, newHead.y)) {
  	this.gameOver();
  } else {
    this.snake_.body.unshift(newHead);
    this.board_.print();
  }
}


/**
 * Displays game over to the client.
 */
Engine.prototype.gameOver = function() {
  console.log('GAME OVER !!!!!!!!!!!!');
}


/**
 * @param {number} length Length of the snake.
 * @param {number} startX The starting x coordinate for the
 *     snake.
 * @param {number} startY The starting y cooridnate for the
 *     snake.
 * @struct @constructor
 */
function Snake(length, startX, startY) {
  this.body = [];
  for(var i = 0; i < length; i++) {
  	this.body.push({
  	  x: startX+i,
  	  y: startY
  	})
  }
}


// Main Program
var board = new Board(10, 10);
board.initialize(10);
var snake = new Snake(3, 7, 7);
var engine = new Engine(board, snake);
engine.run();
