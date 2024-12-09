document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Game objects
    const ball = {
        x: canvas.width / 2,
        y: canvas.height - 30,
        dx: 5,
        dy: -5,
        radius: 8,
        speed: 7
    };

    const paddle = {
        width: 100,
        height: 10,
        x: canvas.width / 2 - 50,
        speed: 7
    };

    const brickRowCount = 5;
    const brickColumnCount = 8;
    const brickWidth = 80;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 60;
    const brickOffsetLeft = 60;

    let score = 0;
    let rightPressed = false;
    let leftPressed = false;
    let gameStarted = false;

    // Create bricks
    const bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    // Event listeners
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    canvas.addEventListener('mousemove', mouseMoveHandler);
    canvas.addEventListener('click', () => {
        if (!gameStarted) {
            gameStarted = true;
            ball.dx = ball.speed * (Math.random() > 0.5 ? 1 : -1);
            ball.dy = -ball.speed;
        }
    });

    function keyDownHandler(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = true;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = false;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        const relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddle.x = relativeX - paddle.width / 2;
        }
    }

    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                const b = bricks[c][r];
                if (b.status === 1) {
                    if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
                        ball.dy = -ball.dy;
                        b.status = 0;
                        score++;
                        scoreElement.textContent = score;

                        if (score === brickRowCount * brickColumnCount) {
                            alert('Congratulations! You win!');
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#3ba9ee';
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.roundRect(paddle.x, canvas.height - paddle.height - 10, paddle.width, paddle.height, 5);
        ctx.fillStyle = '#2c3e50';
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    
                    ctx.beginPath();
                    ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 5);
                    ctx.fillStyle = `hsl(${c * 30 + r * 20}, 70%, 60%)`;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();

        if (!gameStarted) {
            ball.x = paddle.x + paddle.width / 2;
            ball.y = canvas.height - paddle.height - 20;
            ctx.fillStyle = '#666';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Click to Start', canvas.width / 2, canvas.height / 2);
            requestAnimationFrame(draw);
            return;
        }

        // Bounce off walls
        if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
            ball.dx = -ball.dx;
        }
        if (ball.y + ball.dy < ball.radius) {
            ball.dy = -ball.dy;
        } else if (ball.y + ball.dy > canvas.height - ball.radius - paddle.height - 10) {
            if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                // Calculate bounce angle based on where ball hits paddle
                const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
                ball.dx = hitPos * ball.speed;
                ball.dy = -ball.speed;
            } else if (ball.y + ball.dy > canvas.height - ball.radius) {
                alert('Game Over');
                document.location.reload();
            }
        }

        // Move paddle
        if (rightPressed && paddle.x < canvas.width - paddle.width) {
            paddle.x += paddle.speed;
        } else if (leftPressed && paddle.x > 0) {
            paddle.x -= paddle.speed;
        }

        // Keep paddle in bounds
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

        ball.x += ball.dx;
        ball.y += ball.dy;

        requestAnimationFrame(draw);
    }

    draw();
});
