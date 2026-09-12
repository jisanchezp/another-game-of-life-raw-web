class GameCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.ctx.font = "50px Arial";
        this.ctx.fillStyle = "purple";
        this.ctx.fillText("Hello World",10,80);
    }

    drawRectangle(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    drawText(text, x, y, font = '16px Console', color = 'black') {
        this.ctx.font = font;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class Cell {
    constructor(x, y, size = 10) {
        this.x = x;
        this.y = y;
        this.size = size;
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
        this.canvas = new GameCanvas('gameCanvas');
        this.generation = 0;
        this.population = this.cells.length;
    }

    async start() {
        while (this.isRunning) {
            this.#tick();
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    stop (){
        this.isRunning = false;
        console.log("Cleaning canvas...");
        this.canvas.clearCanvas();
    }
    
    #tick() {
        if (!this.isRunning) return;
        this.generation++;
        this.population = this.cells.length;
        this.canvas.clearCanvas();
        this.#drawStats();
        this.#drawCells(this.cells);
        this.#calculateNextGeneration();
    }

    #drawStats() {
        this.canvas.drawText(`Generation: ${this.generation}`, 380, 15);
        this.canvas.drawText(`Population: ${this.population}`, 380, 30);
    }

    #drawCell(cell) {
        this.canvas.drawRectangle(cell.x * cell.size, cell.y * cell.size, cell.size, cell.size, 'black');
    }

    #drawCells(cells) {
        for (let cell of cells) {
            this.#drawCell(cell);
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
    let cellMap = new Map();
    let customCells = [
        new Cell(15, 15),
        new Cell(16, 14),
        new Cell(17, 14),
        new Cell(18, 13),
        new Cell(18, 15)
    ];
    let glider = [
        new Cell(1, 0),
        new Cell(2, 1),
        new Cell(0, 2),
        new Cell(1, 2),
        new Cell(2, 2)
    ];
    cellMap.set('custom', customCells);
    cellMap.set('glider', glider);
    let game = null;

    function start() {
        if (game !== null) return;

        console.log("Starting the game...");
        let cells = [];
        cells.push(...cellMap.get('glider'));
        cells.push(...cellMap.get('custom'));
        game = new Game(cells);
        game.start();
    }    

    function restart() {
        if (game !== null) {            
            stop();
        }
        console.log("Restarting the game...");
        start();
    }

    function stop() {
        if (game === null) return;
        console.log("Stopping the game..."); 
        game.stop();
        game = null;
        console.log("Game stopped successfully.");
    }

    return {
        start,
        restart,
        stop
    };
})();

app;