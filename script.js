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
const COLORS = ["#4DDD3D", "#F9685C", "#79B8E2", "#FFD110"];
const BLOCK_TYPES = ["box", "line", "z", "t", "lR", "lL"];
let isPause = false;
const GAME_FPS = 3;

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
        this.color = COLORS[Math.floor(COLORS.length * Math.random())];
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
        if ((this.x - 2) * BOX_SIZE < 0) return;
        this.x -= 1;
        game.updateFrame();
        this.draw();
    }
    moveRight() {
        if ((this.x + this.width) * BOX_SIZE > canvas.width) return;
        this.x += 1;
        game.updateFrame();
        this.draw();
    }
    drop() {
        this.y += BOX_SIZE;
        game.updateFrame();
        this.draw();
    }
    rotate() {
        // TODO: Сделать, чтобы если поворачиваясь, блок нарушал физику, поворот был невозможен
        if (this.rotateStatus + 1 > 4) {
            this.rotateStatus = 1;
        } else {
            this.rotateStatus += 1;
        }
        let blocksPack = blocks[this.type][this.rotateStatus];
        this.block = [];
        this.block[0] = blocksPack[0];
        this.block[1] = blocksPack[1];
        this.block[2] = blocksPack[2];
        this.block[3] = blocksPack[3];
        this.width = blocksPack[4];
        this.height = blocksPack[5];
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

        this.blocks.push(block);
        this.activeBlock = block;
    }

    clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bg();
    }

    updateFrame() {
        this.clear();
        this.blocks.forEach((block) => {
            block.draw();
        });
    }

    nextFrame() {
        this.clear();
        if (!this.blocks.length) {
            this.createBlock();
        }

        this.blocks.forEach((block) => {
            block.draw();
            if (!block.inSpace) return;

            // Опускает блок на клетку ниже
            if (block.y + BOX_SIZE + block.height * BOX_SIZE <= canvas.height) {
                block.y += BOX_SIZE;
            }

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
                        console.log(this.pixels);

                        block.block.forEach((row, rowIndex) => {
                            row.forEach((value, column) => {
                                if (!value) return;
                                this.pixels[block.y / BOX_SIZE + rowIndex][
                                    block.x + column - 1
                                ] = 1;
                            });
                        });
                    }
                });
            });
        });
        this.gameTimeout = setTimeout(() => {
            game.nextFrame();
        }, 1000 / game.fps);
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
});
