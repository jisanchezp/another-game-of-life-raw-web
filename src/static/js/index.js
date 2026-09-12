let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

function drawRectangle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

class Cell {
    constructor(x, y, size = 10) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    draw() {
        drawRectangle(this.x * this.size, this.y * this.size, this.size, this.size, 'black');
    }

    getNeighbors() {
        let neighbors = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                neighbors.push({ x: this.x + dx, y: this.y + dy });
            }
        }
        return neighbors;
    }
}

class Game {
    constructor(cells) {
        this.cells = cells;
        this.isRunning = true;
    }

    async start() {
        while (this.isRunning) {
            this.tick();
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    stop (){
        this.isRunning = false;
    }
    
    tick() {
        if (!this.isRunning) return;
        this.#drawCells(this.cells);
        this.#calculateNextGeneration();
    }

    #drawCells(cells) {
        clearCanvas();
        for (let cell of cells) {
            cell.draw();
        }
    }

    #calculateNextGeneration() {
        let newCells = [];
        let cellMap = new Map();
        
        for (let cell of this.cells) {
            let neighbors = cell.getNeighbors();
            for (let neighbor of neighbors) {
                let key = `${neighbor.x},${neighbor.y}`;
                cellMap.set(key, (cellMap.get(key) || 0) + 1);
            }
        }

        for (let [key, count] of cellMap.entries()) {
            let [x, y] = key.split(',').map(Number);
            let cell = this.cells.find(cell => cell.x === x && cell.y === y);
            if (cell && (count === 2 || count === 3)) {
                newCells.push(cell);
                console.log(`Cell at (${x}, ${y}) will survive.`);
            } else if (!cell && count === 3) {
                newCells.push(new Cell(x, y));
                console.log(`Cell at (${x}, ${y}) will be born.`);
            } else if (cell && (count < 2 || count > 3)) {
                console.log(`Cell at (${x}, ${y}) will die.`);
            }
        }

        this.cells = newCells;
    }
}

let app = (function () {
    let isRunning = false;
    let cells = [];
    let game = null;

    function start() {
        if (isRunning) return;
        console.log("Starting the game...");
        isRunning = true;
        cells.push(new Cell(15, 15));
        cells.push(new Cell(16, 14));
        cells.push(new Cell(17, 14));
        cells.push(new Cell(18, 13));
        cells.push(new Cell(18, 15));   

        game = new Game(cells);
        game.start();
    }

    function stop() {
        if (game === null) return;
        console.log("Stopping the game..."); 
        game.stop();
        cells = [];
        isRunning = false;
        console.log("Cleaning canvas...");
        clearCanvas();
        console.log("Game stopped successfully.");
    }

    return {
        start,
        stop
    };
})();

app;