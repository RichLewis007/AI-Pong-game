const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game variables
const paddleWidth = 15, paddleHeight = 100, ballSize = 16;
let leftPaddleY = canvas.height/2 - paddleHeight/2;
let rightPaddleY = canvas.height/2 - paddleHeight/2;
let ballX = canvas.width/2 - ballSize/2;
let ballY = canvas.height/2 - ballSize/2;
let ballSpeedX = 5, ballSpeedY = 4;
const paddleSpeed = 5;
let leftScore = 0, rightScore = 0;

// Mouse control for left paddle
canvas.addEventListener('mousemove', (evt) => {
  const rect = canvas.getBoundingClientRect();
  let mouseY = evt.clientY - rect.top;
  leftPaddleY = mouseY - paddleHeight/2;
  if (leftPaddleY < 0) leftPaddleY = 0;
  if (leftPaddleY + paddleHeight > canvas.height) leftPaddleY = canvas.height - paddleHeight;
});

// Draw everything
function draw() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Middle line
  ctx.fillStyle = "#444";
  for (let i = 0; i < canvas.height; i += 30) {
    ctx.fillRect(canvas.width/2 - 1, i, 2, 16);
  }

  // Paddles
  ctx.fillStyle = "#fff";
  ctx.fillRect(10, leftPaddleY, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - 10 - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

  // Ball
  ctx.fillRect(ballX, ballY, ballSize, ballSize);

  // Scores
  ctx.font = "36px Arial";
  ctx.fillText(leftScore, canvas.width/4, 50);
  ctx.fillText(rightScore, 3*canvas.width/4, 50);
}

// Ball movement and collision
function update() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball collision with top/bottom
  if (ballY < 0) {
    ballY = 0;
    ballSpeedY *= -1;
  } else if (ballY + ballSize > canvas.height) {
    ballY = canvas.height - ballSize;
    ballSpeedY *= -1;
  }

  // Ball collision with left paddle
  if (
    ballX <= 10 + paddleWidth &&
    ballY + ballSize >= leftPaddleY &&
    ballY <= leftPaddleY + paddleHeight
  ) {
    ballX = 10 + paddleWidth;
    ballSpeedX *= -1.1; // speed up ball
    // Add a bit of variation based on hit position
    let deltaY = ballY + ballSize/2 - (leftPaddleY + paddleHeight/2);
    ballSpeedY = deltaY * 0.25;
  }

  // Ball collision with right paddle
  if (
    ballX + ballSize >= canvas.width - 10 - paddleWidth &&
    ballY + ballSize >= rightPaddleY &&
    ballY <= rightPaddleY + paddleHeight
  ) {
    ballX = canvas.width - 10 - paddleWidth - ballSize;
    ballSpeedX *= -1.1;
    let deltaY = ballY + ballSize/2 - (rightPaddleY + paddleHeight/2);
    ballSpeedY = deltaY * 0.25;
  }

  // Score and reset
  if (ballX < 0) {
    rightScore++;
    reset();
  }
  if (ballX + ballSize > canvas.width) {
    leftScore++;
    reset();
  }

  // AI for right paddle
  let target = ballY - (paddleHeight/2 - ballSize/2);
  if (rightPaddleY + paddleHeight/2 < target) {
    rightPaddleY += paddleSpeed;
  } else if (rightPaddleY + paddleHeight/2 > target) {
    rightPaddleY -= paddleSpeed;
  }
  // Clamp right paddle
  if (rightPaddleY < 0) rightPaddleY = 0;
  if (rightPaddleY + paddleHeight > canvas.height) rightPaddleY = canvas.height - paddleHeight;
}

function reset() {
  ballX = canvas.width/2 - ballSize/2;
  ballY = canvas.height/2 - ballSize/2;
  ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
