const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20; // Size of each box
let snake;
let direction;
let food;
let score;
let gameInterval;

function initializeGame() {
    snake = [{ x: box * 5, y: box * 5 }];
    direction = 'RIGHT';
    food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
    score = 0;
    document.getElementById('score').innerText = 'Score: ' + score;
    document.getElementById('restartBtn').style.display = 'none';
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, 200); // Slower speed
}

document.addEventListener('keydown', changeDirection);
document.getElementById('restartBtn').addEventListener('click', initializeGame);
initializeGame(); // Start the game for the first time

function changeDirection(event) {
    if (event.keyCode == 37 && direction !== 'RIGHT') direction = 'LEFT';
    else if (event.keyCode == 38 && direction !== 'DOWN') direction = 'UP';
    else if (event.keyCode == 39 && direction !== 'LEFT') direction = 'RIGHT';
    else if (event.keyCode == 40 && direction !== 'UP') direction = 'DOWN';
}

function draw() {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'green' : 'white';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById('score').innerText = 'Score: ' + score;
        food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
    } else {
        snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(gameInterval);
        document.getElementById('restartBtn').style.display = 'block'; // Show restart button
        alert('Game Over! Your score: ' + score);
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Mobile controls
canvas.addEventListener('touchstart', function (event) {
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;

    const canvasRect = canvas.getBoundingClientRect();
    const x = touchX - canvasRect.left;
    const y = touchY - canvasRect.top;

    if (x < canvas.width / 2) {
        changeDirection({ keyCode: 37 }); // Left
    } else {
        changeDirection({ keyCode: 39 }); // Right
    }
});
