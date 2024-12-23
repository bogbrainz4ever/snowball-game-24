// Snowball Game: Hit the Target
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Game variables
let snowballs = [];
let targets = [];
const targetRadius = 30;
let score = 0;
let gameRunning = true;

// Create a snowball object
class Snowball {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = 10;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }
}

// Create a target object
class Target {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = targetRadius;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
}

// Spawn a random target
function spawnTarget() {
    const x = Math.random() * (canvas.width - 2 * targetRadius) + targetRadius;
    const y = Math.random() * (canvas.height - 2 * targetRadius) + targetRadius;
    targets.push(new Target(x, y));
}

// Detect collision between a snowball and a target
function detectCollision(snowball, target) {
    const dx = snowball.x - target.x;
    const dy = snowball.y - target.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < snowball.radius + target.radius;
}

// Update the game
function updateGame() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw and update snowballs
    snowballs.forEach((snowball, index) => {
        snowball.update();
        snowball.draw();

        // Remove snowballs that leave the canvas
        if (
            snowball.x < 0 ||
            snowball.x > canvas.width ||
            snowball.y < 0 ||
            snowball.y > canvas.height
        ) {
            snowballs.splice(index, 1);
        }
    });

    // Draw targets
    targets.forEach((target, tIndex) => {
        target.draw();

        // Check for collisions
        snowballs.forEach((snowball, sIndex) => {
            if (detectCollision(snowball, target)) {
                targets.splice(tIndex, 1);
                snowballs.splice(sIndex, 1);
                score++;
                spawnTarget();
            }
        });
    });

    // Display score
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 10, 30);

    requestAnimationFrame(updateGame);
}

// Shoot a snowball
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calculate direction for snowball
    const dx = (mouseX - canvas.width / 2) * 0.05;
    const dy = (mouseY - canvas.height) * 0.05;

    snowballs.push(new Snowball(canvas.width / 2, canvas.height - 20, dx, dy));
});

// Start the game
spawnTarget();
updateGame();
