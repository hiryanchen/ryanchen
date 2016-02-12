
/**
 * @enum DIRECTION
 */
var DIRECTION = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3
};

/**
 * @enum GAME_OVER_REASONS
 */
var GAME_OVER_REASONS = {
  OUT_OF_BOUND : 0,
  ATE_MYSELF : 1,
  NO_MORE_FOOD : 2
};


/**
 * @struct @constructor
 * @param {number} width Represent the width of the board
 * @param {number} height Represent the height of the board
 */
function Board(width, height) {
  this.width = width;
  this.height = height;
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

/**
 * Visualize the current board in console.
 */
Board.prototype.print = function() {
  for (var y = 0; y < this.height; y++) {
  	var row = '';
  	for (var x = 0; x < this.width; x++) {
  		var value = this.board_[x][y];
  		if (this.isSnakeBody(x, y)) {
  			value = '+'; // Use '+++' to denote snake body in board
  		}
  		row += (value ? value : 0) + ' ';
  	}
    console.log(row);
  };
  console.log('____________________________________');
}

Board.prototype.addSnake = function(snake) {
  this.snake_ = snake;
};


Board.prototype.hasFood = function(x, y) {
  // This is linear time, use Hash to make constant lookup
  for (var i=0; i<this.foods_.length; i++) {
    var food = this.foods_[i];
    if ((food.x === x) && (food.y === y)) {
      return true;
    }
  }
  return false;
};


/**
 * Returns the piece at x,y from the board
 * @return {?Food}
 */
Board.prototype.pieceAt = function(x, y) {
  return this.board_[x][y];
};


/**
 * @param {number} numFoods Number of foods to put on the board.
 * @param {number} numStars Number of stars to put on the board. 
 */
Board.prototype.initialize = function(numFoods, numStars) {
  this.foods_ = [];
  while (numFoods > 0) {
    // Generate random location for the food
  	var x = Math.floor(Math.random() * (this.width));
  	var y = Math.floor(Math.random() * (this.height));
  	if (!this.hasFood(x, y)) {
      var food = new Food();
  	  this.board_[x][y] = food;
      food.x = x;
      food.y = y;
  	  this.foods_.push(food);
  	  numFoods--;
  	};
  }
  // TODO: put the stars in
  console.log('Done initializing board.');
};


Board.prototype.clearPiece = function(x, y) {
  this.board_[x][y] = null;
};

/**
 * Food represents a food on the board with points
 */
function Food() {
  this.char_ = '#';
  this.point = 1;
}

/**
 * Visual representation of the food.
 */
Food.prototype.toString = function() {
  return this.char_;
}


/**
 * A star inherits from food and gives more point than basic food.
 */
function Star() {
  this.char_ = '*'
  this.point = 2;
}
Star.prototype = new Food();


/**
 * The engine controls how the game runs
 * @param {Board} board
 * @param {Snake} snake
 */
function Engine(board, snake) {
  this.board_ = board;
  this.snake_ = snake;

  /*
   * Total game score.
   * @private {number}
   */
  this.score_ = 0;
}

/**
 * Direction input from the user
 */
Engine.prototype.input = function(direction) {
  this.snake_.dir = direction;
}

/**
 * Updates the snake every 1 second as it keeps crawling
 */
Engine.prototype.run = function() {
  this.board_.addSnake(this.snake_);
  this.board_.print();
  this.gameIntervalFunc_ = setInterval(this.update.bind(this), 1000);
}

Engine.prototype.update = function() {
  var head = this.snake_.body[0];
  // Decide new head position based on the current direction
  var newHead = {
  	x: head.x,
  	y: head.y
  }
  switch (this.snake_.dir) {
    case DIRECTION.UP:
      newHead.y = newHead.y - 1;
      break;
    case DIRECTION.RIGHT:
      newHead.x = newHead.x + 1;
      break;
    case DIRECTION.DOWN:
      newHead.y = newHead.y + 1;
      break;
    case DIRECTION.LEFT:
      newHead.x = newHead.x - 1;
      break;
  }

  if (newHead.x < 0 || newHead.y < 0 || newHead.x >= this.board_.width ||
      newHead.y >= this.board_.height) {
    this.gameOver(GAME_OVER_REASONS.OUT_OF_BOUND);
    return;
  } else if (this.board_.isSnakeBody(newHead.x, newHead.y)) {
    this.gameOver(GAME_OVER_REASONS.ATE_MYSELF);
    return;
  } else {
    this.snake_.body.unshift(newHead);
    var piece = this.board_.pieceAt(newHead.x, newHead.y);
    if (piece instanceof Food) {
      this.score_ += piece.point;
      this.board_.clearPiece(newHead.x, newHead.y);
    } else {
      // Snake didn't eat anything, remove one last from tail.
      this.snake_.body.pop(); 
    }
  }

  this.board_.print();
}


/**
 * Prints game over reason and final score.
 * @param {GameOverReason} reason
 */
Engine.prototype.gameOver = function(reason) {
  clearInterval(this.gameIntervalFunc_);
  console.log('GAME OVER because of ' + reason);
  console.log('Your final score is ' + this.score_);
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
  	});
  }
  this.dir = DIRECTION.LEFT; // initialize crawling left.
}

// Main Program
var board = new Board(10, 10);
board.initialize(10, 1);
var snake = new Snake(3, 7, 7);
var engine = new Engine(board, snake);
engine.run();
// TODO: Get real user input to run

