let canvas = document.getElementById("canvas"),ctx = canvas.getContext("2d");
let state = {
    rectPosX: 10, rectPosY: canvas.height / 2 - 10,
    rectVelocity: { x: 0, y: 0 },
    speed: 0.5,
    enemyTimeout: 60,
    enemyTimeoutInit: 60,
    enemySpeed: 1,
    enemies: [],
    friends: [],
    friendAdded: false,
    score: 0,
};

function random(n) {
    return Math.floor(Math.random() * n);
}
class RectCollider {
    constructor(x, y, width, height) {
        this.x = x; this.y = y;  this.width = width; this.height = height;
    }
    isColliding(rectCollider) {
        if (
            this.x < rectCollider.x + rectCollider.width && this.x + this.width > rectCollider.x &&
            this.y < rectCollider.y + rectCollider.height && this.height + this.y > rectCollider.y) {
            return true;
        }
        return false;
    }
}

function checkCollision(state) {
    let playerCollider = new RectCollider(
        state.rectPosX, state.rectPosY,
        10, 10
    );
    for (let i = 0; i < state.enemies.length; ++i) {
        let enemyCollider = new RectCollider(
            state.enemies[i].x, state.enemies[i].y,
            10, 10
        );
        if (playerCollider.isColliding(enemyCollider)) {return true;}
    }
    for (let i = 0; i < state.friends.length; ++i) {
        let friendCollider = new RectCollider(
            state.friends[i].x, state.friends[i].y,
            5, 5
        );
        if (playerCollider.isColliding(friendCollider)) {
            state.speed *= 1.05; state.score = state.score + 100; state.friends.splice(i, 1);
        }
        if (playerCollider.isColliding(friendCollider) & state.score == 0) {
            state.score = 100;
        }
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    state.enemyTimeout -= 1;
    if (state.enemyTimeout == 0) {
        state.enemyTimeout = Math.floor(state.enemyTimeoutInit);
        state.enemies.push({x: canvas.width, y: random(canvas.height), velocity: state.enemySpeed});
        state.enemySpeed *= 1.002; state.enemyTimeoutInit = state.enemyTimeoutInit * 0.999;
    }
    ctx.fillStyle = "yellow";
    state.rectPosX += state.rectVelocity.x; state.rectPosY += state.rectVelocity.y;

    if (state.rectPosX > canvas.width - 10) {state.rectPosX = canvas.width - 10;state.rectVelocity.x = 0;}
    if (state.rectPosX < 0) {state.rectPosX = 0; state.rectVelocity.x = 0;}
    if (state.rectPosY < 0) {state.rectPosY = 0; state.rectVelocity.y = 0;}
    if (state.rectPosY > canvas.height - 10) {state.rectPosY = canvas.height - 10;state.rectVelocity.y = 0;}

    ctx.fillRect(state.rectPosX, state.rectPosY, 10, 10);
    ctx.fillStyle = "#0000FF";

    for (let i = 0; i < state.enemies.length; ++i) {
        state.enemies[i].x -= state.enemies[i].velocity;
        ctx.fillRect(state.enemies[i].x, state.enemies[i].y, 10, 10);
    }
    for (let i = 0; i < state.enemies.length; ++i) {
        if (state.enemies[i].x < -10) {state.enemies.splice(i, 1); state.score++;}
    }
    document.getElementById("score").innerHTML = "score: " + state.score;
    if (state.score % 10 == 0 && state.friendAdded == false) {
        state.friends.push({
            x: random(canvas.width - 20),
            y: random(canvas.height - 20),
        });
        state.friendAdded = true;
    }
    if (state.score % 10 == 1 && state.friendAdded == true) { state.friendAdded = false;}
    for (let i = 0; i < state.friends.length; ++i) {
        ctx.fillStyle = "#FF0000"; ctx.fillRect(state.friends[i].x, state.friends[i].y, 5, 5);
    }
    if (checkCollision(state) == true) {
        state = {
            rectPosX: 10,
            rectPosY: canvas.height / 2 - 10,
            rectVelocity: { x: 0, y: 0 },
            speed: 0.5,
            enemyTimeout: 60,
            enemyTimeoutInit: 60,
            enemySpeed: 1,
            enemies: [],
            friends: [],
            friendAdded: false,
            score: 0
        };
    }
}
setInterval(update, 20);
document.addEventListener("keydown", function(event) {
    if (event.keyCode == 39) { state.rectVelocity.x = state.speed; }
    if (event.keyCode == 37) { state.rectVelocity.x = -state.speed; }
    if (event.keyCode == 40) { state.rectVelocity.y = state.speed; }
    if (event.keyCode == 38) { state.rectVelocity.y = -state.speed; }
});