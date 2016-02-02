
/**
 * @struct @constructor
 * @param {number} width Represent the width of the board
 * @param {number} height Represent the height of the board
 */
function Board(width, height) {
  this.width_ = width;
  this.height_ = height;
  // Initialize an empty baord.
  this.board_ = new Array(height);
  for (var i = 0; i < height; i++) {
  	this.board_[i] = new Array(width);
  };
}

/**
 * Check if the x and y coordinates is inside a Snake's body.
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */
Board.prototype.isSnakeBody = function(x, y) {
  var flag = false;
  this.snake_.body.forEach(function (bodyPart) {
  	if ((x === bodyPart.x) && (y === bodyPart.y)) {
  	  flag = true;
  	}
  })
  return flag;
}

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
}

Board.prototype.addSnake = function(snake) {
  this.snake_ = snake;
}

/**
 * @param {number} numObjs
 */
Board.prototype.initialize = function(numObjs) {

  this.pieces_ = [];

  function checkExistence(x ,y) {
  	return true;
  };

  while (numObjs) {
  	var x = Math.floor(Math.random() * (this.width_));
  	var y = Math.floor(Math.random() * (this.height_));
  	if (checkExistence(x, y)) {
  	  this.board_[x][y] = new Piece();
  	  this.pieces_.push({x: x, y: y});
  	  numObjs--;
  	};
  }
};

function Piece() {
  this.char_ = '#';
  this.point = 1;
}
Piece.prototype.toString = function() {
  return this.char_;
}

function Star() {
  this.char_ = '*'
  this.point = 2;
}
Star.prototype = new Piece();


// Controls how the game runs
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
 */
Engine.prototype.input = function(direction) {
  this.currentSnakeDirection_ = direction;
}

Engine.prototype.run = function() {
  this.board_.addSnake(this.snake_);
  this.board_.print();
  setInterval(this.update.bind(this), 1000);
}

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

Engine.prototype.gameOver = function() {
  console.log('GAME OVER !!!!!!!!!!!!');
}

/**
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
