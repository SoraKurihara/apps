const width = 10;
const colors = [
    'orange', 'red', 'purple', 'green', 'blue'
];

// Lテトリミノ
const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
];

// Zテトリミノ
const zTetromino = [
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1]
];

// Tテトリミノ
const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
];

// Oテトリミノ (四角)
const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
];

// Iテトリミノ
const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
];

// Jテトリミノ
const jTetromino = [
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [width, width + 1, width + 2, width * 2],
    [0, 1, width + 1, width * 2 + 1],
    [width + 2, width * 2, width * 2 + 1, width * 2 + 2]
];

// Sテトリミノ
const sTetromino = [
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [1, width, width + 1, width * 2],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [1, width, width + 1, width * 2]
];

// すべてのテトリミノを配列にまとめる
const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino, jTetromino, sTetromino];
let timerId;
let score = 0;
let nextRandom = 0;
let currentPosition = 4;
let currentRotation = 0;
let random = Math.floor(Math.random() * theTetrominoes.length);
let current;

let squares = [];

const miniGrid = document.querySelector('#mini-grid');
let miniSquares = Array.from(miniGrid.querySelectorAll('div'));

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('#tetrisBoard');
    for (let i = 0; i < 200; i++) {
        const div = document.createElement('div');
        grid.appendChild(div);
    }
    const scoreDisplay = document.getElementById('score');
    squares = Array.from(grid.querySelectorAll('div'));

    // スタートボタンにイベントリスナーを設定
    const startBtn = document.querySelector('#startButton');
    startBtn.addEventListener('click', () => startGame(squares, grid, scoreDisplay));

    // リスタートボタンにイベントリスナーを設定
    const restartBtn = document.querySelector('#restartButton');
    restartBtn.addEventListener('click', () => restartGame(squares, grid, scoreDisplay));

    current = theTetrominoes[random][currentRotation]
});

function displayNextTetromino() {
    // プレビューエリアをクリア
    miniSquares.forEach(square => {
        square.classList.remove('tetromino');
        square.style.backgroundColor = '';
    });

    // 次のテトリミノをプレビューエリアに表示
    theTetrominoes[nextRandom][0].forEach(index => {
        miniSquares[index].classList.add('tetromino');
        miniSquares[index].style.backgroundColor = colors[nextRandom];
    });
}

function startGame(squares, grid, scoreDisplay) {
    // ゲームボードの初期化
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }

    squares.forEach(square => {
        square.classList.remove('tetromino', 'taken');
        square.style.backgroundColor = '';
    });
    score = 0;
    scoreDisplay.innerText = score;

    // ランダムにテトリミノを選択し、最初のローテーションを取得
    random = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];
    currentPosition = 4;

    draw();
    timerId = setInterval(() => moveDown(squares), 1000);
}

// テトリミノを描画
function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
        squares[currentPosition + index].style.backgroundColor = colors[random];
    });
}

// テトリミノを消去
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino');
        squares[currentPosition + index].style.backgroundColor = '';
    });
}

// テトリミノを下に移動
function moveDown() {
    freeze();
    undraw();
    currentPosition += width;
    draw();
}

// テトリミノが底に着いたかチェック
function freeze() {
    if (current.some(index => {
        const nextIndex = currentPosition + index + width;
        return nextIndex >= squares.length || squares[nextIndex].classList.contains('taken');
    })) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        // 新しいテトリミノを開始
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;
        draw();
    }
}

document.addEventListener('keydown', control);

// キーボード操作
function control(e) {
    if (e.keyCode === 37) {
        moveLeft();
    } else if (e.keyCode === 39) {
        moveRight();
    } else if (e.keyCode === 40) {
        moveDown();
    } else if (e.keyCode === 32) {
        rotate();
    }
}

// 左に移動
function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if (!isAtLeftEdge) currentPosition -= 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1;
    }
    draw();
}

// 右に移動
function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    if (!isAtRightEdge) currentPosition += 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1;
    }
    draw();
}

// ローテーション
function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) { // 最後のローテーションに達した場合、最初に戻る
        currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
}

// スコアの追加
function addScore() {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].style.backgroundColor = '';
            });
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}

// ゲームオーバーのチェック
function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerText = 'Game Over';
        clearInterval(timerId);
    }
}

