class LifeGame {
    constructor() {
        this.game = null;
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
            this.playGround.classList.remove('hidden');
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
            this.playGround.classList.remove('hidden');
            this.columnAmnt = document.getElementById("column").value;
            this.rowAmnt = document.getElementById("row").value;
            this.predatorAmnt = document.getElementById("predatorAmnt").value;
            this.preyAmnt = document.getElementById("preyAmnt").value;
            this.playGround.innerHTML = '';
            this.renderPlayGround();
        });
        this.pauseButton.addEventListener('click', (e) => {
            e.preventDefault();
            clearInterval(this.game) 
        });
        this.stopButton.addEventListener('click', (e) => {
            e.preventDefault();
            clearInterval(this.game);
            this.playGround.innerHTML = '';
            this.playGround.classList.add('hidden');
            this.message.classList.remove('hidden');
        });
    }


    start() {
        this.game = setInterval(() => {
            let pgCopy = this.playGround.querySelectorAll('.square');
            let pg = this.playGround.children;
            for (let i=0; i < this.sqPg ; i++) {
                if(pgCopy[i].classList.contains('prey')) {
                    let greenAmnt = this.checkPeaceful(i);
                    let checkDie = true;
                    if((greenAmnt==2)||(greenAmnt==3)) { checkDie = false }
                    setTimeout(() => {
                        if(checkDie) {
                        pg[i].classList.remove('prey');
                        }
                    },this.preyLfTime)
                } else if (pgCopy[i].classList.contains('predator')) {
                    let redAmnt = this.checkPredator(i);
                    let checkDie = true;
                    if((redAmnt==2)||(redAmnt==3)) { checkDie = false }
                    setTimeout(() => {
                        if(checkDie) {
                        pg[i].classList.remove('prey');
                        }
                    },this.predatorLfTime)
                    this.predatorMove(i) 
                } else {
                    let greenAmnt = this.checkPeaceful(i);
                    let redAmnt = this.checkPredator(i);
                    setTimeout(() => {
                        if (greenAmnt == 3) {
                            pg[i].classList.add('prey');
                        }
                    },this.preyRate)
                    setTimeout(() => {
                        if (redAmnt == 3) {
                            pg[i].classList.add('predator');
                        }
                    },this.predatorRate)
                }
            }
        }, 250)
    }

    predatorMove(predNum) {
        let sq = this.playGround.children[predNum];
        let position = {
            row: sq.getAttribute('row'),
            column: sq.getAttribute('column')
        }
        let newPosition = {
            row: (position.row)/1 + this.getRandomArbitrary(-1, 1),
            column: (position.column)/1 + this.getRandomArbitrary(-1, 1)
        }
        if (newPosition.row > this.rowAmnt - 1) {
            newPosition.row = 0;
        } else if (newPosition.row < 0) {
            newPosition.row = this.rowAmnt - 1;
        }

        if (newPosition.column > this.columnAmnt - 1) {
            newPosition.column = 0;
        } else if (newPosition.column < 0) {
            newPosition.column = this.columnAmnt - 1;
        }
        document.querySelector(`[row="${(position.row/1)}"][column="${(position.column/1)}"]`).classList.remove('predator');
        if(document.querySelector(`[row="${(newPosition.row/1)}"][column="${(newPosition.column/1)}"]`).classList.contains('prey')){
            document.querySelector(`[row="${(newPosition.row/1)}"][column="${(newPosition.column/1)}"]`).classList.remove('prey');
            document.querySelector(`[row="${(newPosition.row/1)}"][column="${(newPosition.column/1)}"]`).classList.add('predator');
        } 
        else if(document.querySelector(`[row="${(newPosition.row/1)}"][column="${(newPosition.column/1)}"]`).classList.contains('predator')){
        }
        else{
            document.querySelector(`[row="${(newPosition.row/1)}"][column="${(newPosition.column/1)}"]`).classList.add('predator');
        }
    }

    getRandomArbitrary(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    checkPeaceful(sqNum) {
        let sq = this.playGround.children[sqNum];
        let amount = 0;
        let position = {
            row: sq.getAttribute('row'),
            column: sq.getAttribute('column')
        }
        if( 
            document.querySelector(`[row="${(position.row/1) + 1}"][column="${(position.column/1) + 1}"]`) != null &&
            document.querySelector(`[row="${(position.row/1) + 1}"][column="${(position.column/1) + 1}"]`).classList.contains('prey')
         ){
            amount += 1;
        }
        if( 
            document.querySelector(`[row="${(position.row/1) - 1}"][column="${(position.column/1) - 1}"]`) != null &&
            document.querySelector(`[row="${(position.row/1) - 1}"][column="${(position.column/1) - 1}"]`).classList.contains('prey')
         ){
            amount += 1;
        }
        if( 
            document.querySelector(`[row="${(position.row/1) + 1}"][column="${(position.column/1) - 1}"]`) != null &&
            document.querySelector(`[row="${(position.row/1) + 1}"][column="${(position.column/1) - 1}"]`).classList.contains('prey')){
            amount += 1;
        }
        if( 
            document.querySelector(`[row="${(position.row/1) - 1}"][column="${(position.column/1) + 1}"]`) != null &&
            document.querySelector(`[row="${(position.row/1) - 1}"][column="${(position.column/1) + 1}"]`).classList.contains('prey')){
            amount += 1;
        }
        if( 
            document.querySelector(`[row="${(position.row/1) + 1}"][column="${(position.column/1)}"]`) != null &&
            document.querySelector(`[row="${(position.row/1) + 1}"][column="${(position.column/1)}"]`).classList.contains('prey')){
            amount += 1;
        }
        if( 
            document.querySelector(`[row="${(position.row/1)}"][column="${(position.column/1) + 1}"]`) != null &&
            document.querySelector(`[row="${(position.row/1)}"][column="${(position.column/1) + 1}"]`).classList.contains('prey')){
            amount += 1;
        }
        if( 
            document.querySelector(`[row="${(position.row/1) - 1}"][column="${(position.column/1)}"]`) != null &&
            document.querySelector(`[row="${(position.row/1) - 1}"][column="${(position.column/1)}"]`).classList.contains('prey')){
            amount += 1;
        }
        if( 
            document.querySelector(`[row="${(position.row/1)}"][column="${(position.column/1) - 1}"]`) != null &&
            document.querySelector(`[row="${(position.row/1)}"][column="${(position.column/1) - 1}"]`).classList.contains('prey')){
            amount += 1;
        }
        return amount
    }
    checkPredator(sqNum) {
        let sq = this.playGround.children[sqNum];
        let amount = 0;
        let position = {
            row: sq.getAttribute('row'),
            column: sq.getAttribute('column')
        }
        if( 
            document.querySelector(`[row="${(position.row/1) + 1}"][column="${(position.column/1) + 1}"]`) != null &&
            document.querySelector(`[row="${(position.row/1) + 1}"][column="${(position.column/1) + 1}"]`).classList.contains('predator')){
            amount += 1;
        }
        if( 
            document.querySelector(`[row="${(position.row/1) - 1}"][column="${(position.column/1) - 1}"]`) != null &&
            document.querySelector(`[row="${(position.row/1) - 1}"][column="${(position.column/1) - 1}"]`).classList.contains('predator')){
            amount += 1;
        }
        if( 
            document.querySelector(`[row="${(position.row/1) + 1}"][column="${(position.column/1) - 1}"]`) != null &&
            document.querySelector(`[row="${(position.row/1) + 1}"][column="${(position.column/1) - 1}"]`).classList.contains('predator')){
            amount += 1;
        }
        if( 
            document.querySelector(`[row="${(position.row/1) - 1}"][column="${(position.column/1) + 1}"]`) != null &&
            document.querySelector(`[row="${(position.row/1) - 1}"][column="${(position.column/1) + 1}"]`).classList.contains('predator')){
            amount += 1;
        }
        if( 
            document.querySelector(`[row="${(position.row/1) + 1}"][column="${(position.column/1)}"]`) != null &&
            document.querySelector(`[row="${(position.row/1) + 1}"][column="${(position.column/1)}"]`).classList.contains('predator')){
            amount += 1;
        }
        if( 
            document.querySelector(`[row="${(position.row/1)}"][column="${(position.column/1) + 1}"]`) != null &&
            document.querySelector(`[row="${(position.row/1)}"][column="${(position.column/1) + 1}"]`).classList.contains('predator')){
            amount += 1;
        }
        if( 
            document.querySelector(`[row="${(position.row/1) - 1}"][column="${(position.column/1)}"]`) != null &&
            document.querySelector(`[row="${(position.row/1) - 1}"][column="${(position.column/1)}"]`).classList.contains('predator')){
            amount += 1;
        }
        if( 
            document.querySelector(`[row="${(position.row/1)}"][column="${(position.column/1) - 1}"]`) != null &&
            document.querySelector(`[row="${(position.row/1)}"][column="${(position.column/1) - 1}"]`).classList.contains('predator')){
            amount += 1;
        }
        return amount
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
}

let lifeGame = new LifeGame();