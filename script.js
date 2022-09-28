const blocks = {
    box: {
        1: [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 2, 2],
        2: [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 2, 2],
        3: [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 2, 2],
        4: [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 2, 2],
    },
    line: {
        1: [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 4, 1],
        2: [[1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], 1, 4],
        3: [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 4, 1],
        4: [[1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], 1, 4],
    },
    z: {
        1: [[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 3, 2],
        2: [[1, 0, 0, 0], [1, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0], 2, 3],
        3: [[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 3, 2],
        4: [[1, 0, 0, 0], [1, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0], 2, 3],
    },
    t: {
        1: [[0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0], 3, 2],
        2: [[1, 0, 0, 0], [1, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0], 2, 3],
        3: [[1, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 3, 2],
        4: [[0, 1, 0, 0], [1, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0], 2, 3],
    },
    lR: {
        1: [[1, 1, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0], 2, 3],
        2: [[1, 1, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0], 3, 2],
        3: [[0, 1, 0, 0], [0, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], 2, 3],
        4: [[1, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0], 3, 2],
    },
    lL: {
        1: [[1, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0], 2, 3],
        2: [[0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0], 3, 2],
        3: [[1, 0, 0, 0], [1, 0, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], 2, 3],
        4: [[1, 1, 1, 0], [1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 3, 2],
    },
};

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

const BOX_SIZE = 38;
const COLORS = ["#4DDD3D", "", "#79B8E2", "#FFD110"];
const BLOCK_TYPES = ["box", "line", "z", "t", "lR", "lL"];
const GAME_FPS = 3;
let isPause = false;
let score = 0;

function bg() {
    ctx.beginPath();
    for (let i = BOX_SIZE; i < canvas.width; i += BOX_SIZE) {
        ctx.strokeStyle = "#1A1A1A";
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }

    for (let i = BOX_SIZE; i < canvas.height; i += BOX_SIZE) {
        ctx.strokeStyle = "#1A1A1A";
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    ctx.closePath();
}
bg();

// TODO: Сделать слева от canvas поле в котором будет показываться следующий блок

class Block {
    constructor(type) {
        this.rotateStatus = Math.ceil(4 * Math.random());
        let blocksPack = blocks[type][this.rotateStatus];
        this.block = [];
        this.block[0] = blocksPack[0];
        this.block[1] = blocksPack[1];
        this.block[2] = blocksPack[2];
        this.block[3] = blocksPack[3];
        this.width = blocksPack[4];
        this.height = blocksPack[5];

        this.type = type;
        this.y = 0;
        this.x = Math.floor(canvas.width / BOX_SIZE / 2);
        this.color = "#F9685C";
        this.inSpace = true;
    }

    draw() {
        let y = this.y;
        let x = (this.x - 1) * BOX_SIZE;
        ctx.beginPath();
        ctx.fillStyle = this.color;

        this.block.forEach((row) => {
            row.forEach((active, index) => {
                if (!active) return;
                let pixelX = x + index * BOX_SIZE;
                ctx.fillRect(pixelX, y, BOX_SIZE, BOX_SIZE);
            });
            y += BOX_SIZE;
        });
        ctx.closePath();
    }

    moveLeft() {
        if (isPause) return;
        let isPossible = true;
        this.block.forEach((row, rowIndex) => {
            row.forEach((value, column) => {
                if (!value) return;
                const x = this.x + column - 2;
                const y = this.y / BOX_SIZE + rowIndex;
                if (game.pixels[y][x]) isPossible = false;
            });
        });
        if (!isPossible) {
            return;
        }
        if ((this.x - 2) * BOX_SIZE < 0) return;
        this.x -= 1;
        game.updateFrame();
        this.draw();
    }
    moveRight() {
        if (isPause) return;
        let isPossible = true;
        this.block.forEach((row, rowIndex) => {
            row.forEach((value, column) => {
                if (!value) return;
                const x = this.x + column;
                const y = this.y / BOX_SIZE + rowIndex;
                if (game.pixels[y][x]) isPossible = false;
            });
        });
        if (!isPossible) {
            return;
        }
        if ((this.x + this.width) * BOX_SIZE > canvas.width) return;
        this.x += 1;
        game.updateFrame();
        this.draw();
    }

    rotate() {
        const newRotateStatus =
            this.rotateStatus + 1 > 4 ? 1 : this.rotateStatus + 1;
        const blocksPack = blocks[this.type][newRotateStatus];
        const newWidth = blocksPack[4];
        const newHeight = blocksPack[5];

        // Проверка если блок при повороте выйдет за края canvas
        if (
            this.x + newWidth - 1 > canvas.width / BOX_SIZE ||
            this.height + newHeight - 1 > canvas.height / BOX_SIZE
        ) {
            return;
        }

        let isPossible = true;

        // Проверка если блок при повороте войдет в дургой блок
        for (
            let row = this.y / BOX_SIZE;
            row < newHeight + this.y / BOX_SIZE;
            row++
        ) {
            for (let column = this.x; column < this.x + newWidth; column++) {
                if (!isPossible) return;
                if (game.pixels[row][column]) {
                    isPossible = false;
                }
            }
        }

        if (!isPossible) {
            return;
        }

        this.rotateStatus = newRotateStatus;
        this.block = [];
        this.block[0] = blocksPack[0];
        this.block[1] = blocksPack[1];
        this.block[2] = blocksPack[2];
        this.block[3] = blocksPack[3];
        this.width = newWidth;
        this.height = newHeight;
        game.updateFrame();
    }
}

class Game {
    constructor(fps) {
        this.fps = fps;
        this.blocks = [];
        this.activeBlock = null;
        this.gameTimeout = null;

        this.pixels = (() => {
            // Создает виртуальное поле, с 0 в пустой клетке и с 1 если в клетке находится блок
            const rows = canvas.height / BOX_SIZE;
            const columns = canvas.width / BOX_SIZE;
            const res = [];
            for (let row = 0; row < rows; row++) {
                res[row] = [];
                for (let column = 0; column < columns; column++) {
                    res[row][column] = 0;
                }
            }
            return res;
        })();
    }

    createBlock() {
        const block = new Block(
            BLOCK_TYPES[Math.floor(BLOCK_TYPES.length * Math.random())]
        );

        this.activeBlock = block;
    }

    clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bg();
    }

    updateFrame() {
        this.clear();
        this.activeBlock?.draw();
        this.drawFalledBlocks();
    }

    // Проверка, есть ли заполненая строка
    checkRows() {
        if (this.pixels[1].includes(1)) {
            console.log("game over");
            this.gameOver();
        }
        for (let i = 0; i < this.pixels.length; i++) {
            const row = this.pixels[i];
            if (!row.includes(0)) {
                this.pixels.splice(i, 1);
                const columns = canvas.width / BOX_SIZE;
                const res = [];
                for (let column = 0; column < columns; column++) {
                    res[column] = 0;
                }
                this.pixels.unshift(res);
                this.activeBlock.y - BOX_SIZE;
                this.drawFalledBlocks();

                score += 100;
                document.querySelector(".game .score .number").textContent =
                    score;
            }
        }
    }

    // Отрисовка зафиксированных блоков
    drawFalledBlocks() {
        ctx.beginPath();
        ctx.fillStyle = "#FFD110";
        this.pixels.forEach((row, rowIndex) => {
            row.forEach((value, column) => {
                if (!value) return;
                ctx.fillRect(
                    column * BOX_SIZE,
                    rowIndex * BOX_SIZE,
                    BOX_SIZE,
                    BOX_SIZE
                );
            });
        });
        ctx.closePath();
    }

    gameOver() {
        this.blocks = [];
        this.activeBlock = null;
        this.gameTimeout = null;

        this.pixels = (() => {
            // Создает виртуальное поле, с 0 в пустой клетке и с 1 если в клетке находится блок
            const rows = canvas.height / BOX_SIZE;
            const columns = canvas.width / BOX_SIZE;
            const res = [];
            for (let row = 0; row < rows; row++) {
                res[row] = [];
                for (let column = 0; column < columns; column++) {
                    res[row][column] = 0;
                }
            }
            return res;
        })();

        score = 0;
        document.querySelector(".game .score .number").textContent = score;
    }

    nextFrame() {
        this.clear();
        if (!this.activeBlock) {
            this.createBlock();
        }

        this.gameTimeout = setTimeout(() => {
            game.nextFrame();
        }, 1000 / game.fps);

        this.drawFalledBlocks();

        const block = this.activeBlock;
        block.draw();
        // проверка если блок упал на землю
        if (block.y + block.height * BOX_SIZE >= canvas.height) {
            block.inSpace = false;
            this.createBlock();
            block.block.forEach((row, rowIndex) => {
                row.forEach((value, column) => {
                    if (!value) return;
                    const y = block.y / BOX_SIZE + rowIndex;
                    this.pixels[y][block.x + column - 1] = 1;
                });
            });
            this.checkRows();
            return;
        }
        let stop = false; // Проверка если блок упал на другой блок
        block.block.forEach((row, rowIndex) => {
            row.forEach((value, column) => {
                if (!value || stop) return;
                const y = block.y / BOX_SIZE + rowIndex;
                const x = block.x + column - 1;
                if (this.pixels[y + 1][x] && !stop) {
                    block.inSpace = false;
                    this.createBlock();
                    stop = true;

                    block.block.forEach((row, rowIndex) => {
                        row.forEach((value, column) => {
                            if (!value) return;
                            this.pixels[block.y / BOX_SIZE + rowIndex][
                                block.x + column - 1
                            ] = 1;
                        });
                    });
                    this.checkRows();
                }
            });
        });
        if (stop) return;
        // Опускает блок на клетку ниже
        if (block.y + BOX_SIZE + block.height * BOX_SIZE <= canvas.height) {
            block.y += BOX_SIZE;
        }
    }

    moveLeft() {
        this.activeBlock.moveLeft();
    }
    moveRight() {
        this.activeBlock.moveRight();
    }
    speedUp() {
        game.fps = GAME_FPS * 4;
    }
    speedDown() {
        game.fps = GAME_FPS;
    }
    rotate() {
        this.activeBlock.rotate();
    }
}

const game = new Game(2.5);
game.nextFrame();

window.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowLeft") {
        game.moveLeft();
    }
    if (key == "ArrowRight") {
        game.moveRight();
    }
    if (key == "ArrowDown") {
        game.speedUp();
    }
    if (key == "ArrowUp") {
        game.rotate();
    }
});

window.addEventListener("keyup", ({ key }) => {
    if (key == "ArrowDown") {
        game.speedDown();
    }
});

document.querySelector(".pause").addEventListener("click", () => {
    if (!isPause) {
        clearTimeout(game.gameTimeout);
        isPause = true;
    } else {
        game.nextFrame();
        isPause = false;
    }
});

document.querySelector(".restart").addEventListener("click", () => {
    game.blocks = [];
    game.activeBlock = null;
    game.gameTimeout = null;

    game.pixels = (() => {
        // Создает виртуальное поле, с 0 в пустой клетке и с 1 если в клетке находится блок
        const rows = canvas.height / BOX_SIZE;
        const columns = canvas.width / BOX_SIZE;
        const res = [];
        for (let row = 0; row < rows; row++) {
            res[row] = [];
            for (let column = 0; column < columns; column++) {
                res[row][column] = 0;
            }
        }
        return res;
    })();

    score = 0;
    document.querySelector(".game .score .number").textContent = score;

    if (isPause) {
        game.nextFrame();
        isPause = false;
    }
});

setInterval(() => {
    game.updateFrame();
}, 1000 / 60);

console.log(document.querySelector(".score"));
