class LifeGame {
    constructor() {
        this.sqPg = null;
        this.columnAmnt = null;
        this.rowAmnt = null;
        this.predatorAmnt = null;
        this.preyAmnt = null;
        this.predatorLfTime = null;
        this.preyLfTime = null;
        this.predatorRate = null;
        this.preyRate = null;
        this.rootNode = document.querySelector('.pgField');
        this.message = this.rootNode.querySelector('.message');
        this.playGround = this.rootNode.querySelector('.playground');
        this.startButton = document.getElementById("start");
        this.renderButton = document.getElementById("render");
        this.pauseButton = document.getElementById("pause");
        this.stopButton = document.getElementById("stop");
        this.attachControlEvents();
    }

    renderPlayGround() {
        this.sqPg = this.columnAmnt * this.rowAmnt;
        for (let i = 0; i < this.sqPg; i++) {
            let square = document.createElement('div');
            let row = Math.floor(i / this.columnAmnt);
            let column = i - (row * this.columnAmnt);
            square.classList.add('square');
            square.setAttribute('row', row);
            square.setAttribute('column', column);
            this.playGround.style.width = `${25*this.columnAmnt}px`;
            this.playGround.appendChild(square);
        }
        this.renderPlayers();
    }

    attachControlEvents() {
        this.startButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.message.classList.add('hidden');
            this.columnAmnt = document.getElementById("column").value;
            this.rowAmnt = document.getElementById("row").value;
            this.predatorAmnt = document.getElementById("predatorAmnt").value;
            this.preyAmnt = document.getElementById("preyAmnt").value;
            this.predatorLfTime = document.getElementById("predatorLfTime").value;
            this.preyLfTime = document.getElementById("preyLfTime").value;
            this.predatorRate = document.getElementById("predatorRate").value;
            this.preyRate = document.getElementById("preyRate").value;
            if(this.playGround.innerHTML != '') {
                this.start();
            } else {
                this.renderPlayGround();
                this.start();
            }
        });
        this.renderButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.message.classList.add('hidden');
            this.columnAmnt = document.getElementById("column").value;
            this.rowAmnt = document.getElementById("row").value;
            this.predatorAmnt = document.getElementById("predatorAmnt").value;
            this.preyAmnt = document.getElementById("preyAmnt").value;
            this.playGround.innerHTML = '';
            this.renderPlayGround();
        });
        this.pauseButton.addEventListener('click', () => {
            this.start();
        });
        this.stopButton.addEventListener('click', () => {
            this.start();
        });
    }

    checkStats() {
        let head = this.snake[0];
        this.snake.forEach((part, index) => {
            if (index > 1) {
                if (part.row === head.row && part.column === head.column) {
                    alert('U loose rofl');
                    clearInterval(this.game);
                }
            }
        })
    }

    start() {
        clearInterval(this.game);
        this.snake = [];
        this.game = null;
        this.food = null;
        this.initSnake();
        this.renderSnake();
        this.generateFood();

        this.game = setInterval(() => {
            this.snake = this.snake.map((part, index) => {
                if (index === 0) {
                    let newPosition = {
                        row: part.row,
                        column: part.column
                    }
                    if (this.direction === 'left') {
                        newPosition.column -= 1;
                    } else if (this.direction === 'right') {
                        newPosition.column += 1;
                    } else if (this.direction === 'up') {
                        newPosition.row -= 1;
                    } else if (this.direction === 'down') {
                        newPosition.row += 1;
                    }

                    if (newPosition.row > this.dimension - 1) {
                        newPosition.row = 0;
                    } else if (newPosition.row < 0) {
                        newPosition.row = this.dimension - 1;
                    }

                    if (newPosition.column > this.dimension - 1) {
                        newPosition.column = 0;
                    } else if (newPosition.column < 0) {
                        newPosition.column = this.dimension - 1;
                    }

                    return newPosition;
                } else {
                    return this.snake[index - 1];
                }
            })
            if (this.food.row === this.snake[0].row && this.food.column === this.snake[0].column) {
                this.snake.push(this.snake[this.snake.length - 1]);
                this.generateFood();
            }
            this.checkLoose();
            this.renderSnake();
        }, this.speed)
    }

    renderPlayers() {
        for(let i = 0; i < this.preyAmnt ; i++) {
            this.prey = null;
            do {
                this.player = {
                row: Math.floor(Math.random() * this.rowAmnt),
                column: Math.floor(Math.random() * this.columnAmnt)
                }
                var result = this.checkSq(); 
            } while (result)
            var prey = document.querySelector(`[row="${this.player.row}"][column="${this.player.column}"]`); 
            prey.classList.add('prey');
        }
        for(let i = 0; i < this.predatorAmnt ; i++) {
            this.predator = null;
            do {
                this.player = {
                    row: Math.floor(Math.random() * this.rowAmnt),
                    column: Math.floor(Math.random() * this.columnAmnt)
                }
                var result = this.checkSq();   
            } while (result)
            var predator = document.querySelector(`[row="${this.player.row}"][column="${this.player.column}"]`);
            predator.classList.add('predator');
        }
    }

    checkSq() {
        var player = document.querySelector(`[row="${this.player.row}"][column="${this.player.column}"]`);
        let checkHerbs = player.classList.contains('predator');
        let checkPredators = player.classList.contains('prey');
        var result = checkHerbs || checkPredators;
        return result;
    }

    initSnake() {
        this.snake.push({
            row: Math.floor(this.dimension / 2),
            column: Math.floor(this.dimension / 2)
        })
    }
}

let lifeGame = new LifeGame();