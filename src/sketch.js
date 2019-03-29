// Jarad Gray
// Implementation of Conway's Game of Life
// https://en.wikipedia.org/wiki/Conway's_Game_of_Life

const TICK_LENGTH = 100;
const CELL_SIZE = 20;

let startButton, randomizeButton, clearButton;

let numRows, numCols;
let cells = [];
let newState = [];
let playing = false;
let lastTick;

function setup() {
	startButton = createButton("Start");
	randomizeButton = createButton("Randomize");
	clearButton = createButton("Clear");

	startButton.mousePressed(startButton_Click);
	randomizeButton.mousePressed(randomizeButton_Click);
	clearButton.mousePressed(clearButton_Click);

	numRows = floor(windowHeight / CELL_SIZE);
	numCols = floor(windowWidth / CELL_SIZE);

	for (let i = 0; i < numCols; i++) {
		let col = [];
		for (let j = 0; j < numRows; j++) {
			let cell = new Cell(i, j, CELL_SIZE);
			col.push(cell);
		}
		cells.push(col);
	}

	createCanvas(numCols * CELL_SIZE, numRows * CELL_SIZE);
	lastTick = millis();
}//end setup()

function draw() {
	let curTime = millis();
	let doTick = (curTime - lastTick >= TICK_LENGTH);
	if (doTick) lastTick = curTime;
	background(51);

	newState = copyCellsArray(cells); // clone cells, so changes won't affect logic this frame

	// now perform logic on cells
	// but make updates to newState

	for (let i = 0; i < numCols; i++) {
		for (let j = 0; j < numRows; j++) {
			let cell = cells[i][j];
			cell.hovered = false; // reset cell.hovered
			if (playing && doTick) {
				// set cell.alive based on cell.alive and number of alive neighbors
				let numAliveNeighbors = getNumAliveNeighbors(cell);
				if (cell.alive) {
					if (numAliveNeighbors < 2 || numAliveNeighbors > 3) {
						newState[i][j].alive = false;
					}
				}
				else if (numAliveNeighbors == 3) {
					newState[i][j].alive = true;
				}
			}
			// detect cell clicks and hovers
			if (cell.isBehindCursor()) {
				if (mouseIsPressed) {
					if (mouseButton === LEFT) newState[i][j].alive = true;
					else if (mouseButton === RIGHT) newState[i][j].alive = false;
				}
				else {
					cell.hovered = true; // update cell for hover effect to show
					console.log(getNumAliveNeighbors(cell));
				}
			}
			cell.render();
		}
	}

	cells = copyCellsArray(newState);
}//end draw()

function startButton_Click() {
	if (playing) {
		startButton.html("Start");
	}
	else {
		startButton.html("Stop");
	}
	playing = !playing;
}

function randomizeButton_Click() {
	for (let i = 0; i < numCols; i++) {
		for (let j = 0; j < numRows; j++) {
			let alive = (floor(random(5)) == 0);
			cells[i][j].alive = alive;
		}
	}
}

function clearButton_Click() {
	for (let i = 0; i < numCols; i++) {
		for (let j = 0; j < numRows; j++) {
			cells[i][j].alive = false;
		}
	}
}

// Given a reference to a Cell, return the number of adjacent alive Cells.
function getNumAliveNeighbors(cell) {
	let result = 0;
	let i = cell.x;
	let j = cell.y;
	// check if each neighbor exists and is alive
	if (i > 0 && j > 0                     && cells[i - 1][j - 1].alive) result++;
	if (j > 0                              && cells[i    ][j - 1].alive) result++;
	if (i < numCols - 1 && j > 0           && cells[i + 1][j - 1].alive) result++;
	if (i > 0                              && cells[i - 1][j    ].alive) result++;
	if (i < numCols - 1                    && cells[i + 1][j    ].alive) result++;
	if (i > 0 && j < numRows - 1           && cells[i - 1][j + 1].alive) result++;
	if (j < numRows - 1                    && cells[i    ][j + 1].alive) result++;
	if (i < numCols - 1 && j < numRows - 1 && cells[i + 1][j + 1].alive) result++;
	return result;
}

// Return a deep copy of the cells array
function copyCellsArray(arr) {
	let result = [];
	for (let i = 0; i < numCols; i++) {
		let col = [];
		for (let j = 0; j < numRows; j++) {
			col.push(arr[i][j].deepCopy());
		}
		result.push(col);
	}
	return result;
}