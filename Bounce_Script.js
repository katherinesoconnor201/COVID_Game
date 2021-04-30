const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");
ctx.canvas.width = window.innerWidth - 100;
ctx.canvas.height = window.innerHeight - 50;

var box = cvs.height / 10;
cvs.style.marginLeft = window.innerWidth * 0.04 + 'px'

var step = box / 4;
let score = 0;
let t = 0; // increases every 0.1 seconds
var nf = -100; // when t == nf, a new food is genrated, starts negative because no foods should be ggenerated before loading game
const rx_max = Math.floor(cvs.width / box) - 1;
const ry_max = Math.floor(cvs.height / box) - 3;


const intro = document.getElementById("intro");
const Single_Player = document.getElementById("Single_Player");
const Two_Player = document.getElementById("Two_Player");
const vs_Computer = document.getElementById("vs_Computer");

Single_Player.style.top = 1 * box + "px";
Two_Player.style.top = 1.5 * box + "px";
vs_Computer.style.top = 2 * box + "px";


const f = new Image();
f.src = "images/cookie.png";
f.width = 0.5 * box;
f.height = 0.5 * box;

const b = new Image();
b.src = "images/covid.png";
b.width = 0.5 * box;
b.height = 0.5 * box;

let player = [];
let food = [];

let coordinates = [];

var p1 = new Image()
p1.src = "images/Pinky_Lamb1.png";
p1.width = box;
p1.height = 1.2 * box;
var src1 = ["images/Pinky_Lamb4.png", "images/Pinky_Lamb3.png", "images/Pinky_Lamb2.png", "images/Pinky_Lamb1.png"];

var p2 = new Image();
p2.src = "images/Bear1.png";
p2.width = box;
p2.height = 1.2 * box;
var src2 = ["images/Bear4.png", "images/Bear3.png", "images/Bear2.png", "images/Bear1.png"];

function Start_Game(str) {
    score = 0;
    nf = 1000;
    health = 12;
    food_speed = 1;
    Single_Player.style.display = "none";
    Two_Player.style.display = "none";
    vs_Computer.style.display = "none";
    player[0] = {
        x: cvs.width / 2,
        y: cvs.height / 2,
        height: p2.height,
        width: p1.width,
        health: health,
        image: p1,
        pics: src1,
        computer: false,
        name: "Pinky Lamb"
    }
    var comp = (str == "vs_Computer");
    if (str != "Single_Player") {
        player[1] = {
            x: 3 * box + cvs.width / 2,
            y: cvs.height / 2,
            height: p2.height,
            width: p2.width,
            health: health,
            image: p2,
            pics: src2,
            computer: comp,
            name: "Bear"
        }

        player[2] = {
            x: -3 * box + cvs.width / 2,
            y: -2 * box + cvs.height / 2,
            height: p2.height,
            width: p2.width,
            health: health,
            image: p2,
            pics: src2,
            computer: true,
            name: "Bear"
        }

        player[3] = {
            x: -3 * box + cvs.width / 2,
            y: 2 * box + cvs.height / 2,
            height: p2.height,
            width: p2.width,
            health: health,
            image: p2,
            pics: src2,
            computer: true,
            name: "Bear"
        }
    }

    food[0] = {
        x: 0,
        y: cvs.height / 2 - f.height,
        X_step: (1 + Math.random() / 2) * step,
        Y_step: (-1 + Math.random() * 2) * step,
        good: false,
        width: f.width,
        height: f.height

    }
}


function drawPlayer(rect1) {
    rect1.image.src = rect1.pics[Math.ceil(rect1.health / 4)];
    ctx.drawImage(rect1.image, rect1.x, rect1.y, rect1.width, rect1.height);
    ctx.fillStyle = "black";
    //ctx.fillText(rect1.x + ", " + rect1.y, rect1.x, rect1.y, 400);
}

function getRandomSpeed(fs = 1) {
    return Math.floor(Math.random() * fs * step + 2)
}

function NewFood(x = 0, y = cvs.height / 2 - f.height, x_step = (1 + Math.random()) * step, y_step = (-1 + Math.random() * 2) * step) {
    var isGood = 1 == 2 //(Math.floor(Math.random() * 2) == 1);
    var newFood = {
        x: x,
        y: y,
        X_step: x_step,
        Y_step: x_step,
        width: f.width,
        height: f.height,
        good: isGood
    }
    food.push(newFood);
}
colors = [
    ["#e1aaff", "#c1ffaa"],
    ["#363457", "#CDE5D7"],
    ["#502F4C", "#EDFFAB"],
    ["#090446", "#F8E8C9"]
]
color_index = Math.floor(Math.random() * colors.length)

function drawBackground() {

    ctx.fillStyle = colors[color_index][0];
    ctx.fillRect(0, 0, cvs.width, box);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, cvs.width, box);
    ctx.fillStyle = colors[color_index][1];
    ctx.fillRect(0, box, cvs.width, cvs.height - box);
    ctx.strokeRect(0, box, cvs.width, cvs.height - box);
}

function inCompBounds(rect1) {
    if (rect1.y < 3 * box) {
        rect1.y = 3 * box;
    } else if (rect1.y + rect1.height + box > cvs.height) {
        rect1.y = cvs.height - rect1.height - box;
    } else if (rect1.x < box) {
        rect1.x = box;
    } else if (rect1.x + rect1.width + box > cvs.width) {
        rect1.x = cvs.width - rect1.width - box;
    }
}

function inBounds(rect1) {
    if (rect1.y < box) {
        rect1.y = box + 1;
    } else if (rect1.y + rect1.height > cvs.height) {
        rect1.y = cvs.height - rect1.height - 1;
    } else if (rect1.x < 0) {
        rect1.x = 1;
    } else if (rect1.x + rect1.width > cvs.width) {
        rect1.x = cvs.width - rect1.width - 1;
    }
}

function check_game_over() {
    var allDead = true;
    for (var i = 0; i < player.length; i++) {
        if (player[i].health >= 1) {
            allDead = false;
        }
    }
    if (allDead) {
        ctx.fillStyle = "white";
        ctx.font = "bold 100px Courier"
        ctx.fillText("GAMEOVER", cvs.width / 2 - cvs.width / 6, cvs.height / 2);
        ctx.strokeStyle = "black";
        ctx.strokeText("GAMEOVER", cvs.width / 2 - cvs.width / 6, cvs.height / 2);
        clearInterval(game);
    }
}

document.addEventListener("touchmove", clearIntro);
document.addEventListener("keydown", clearIntro);

function clearIntro() {
    intro.style.display = "none";
}

//User Controls
let d = [];
window.addEventListener("touchstart", t_move);
window.addEventListener("touchmove", t_move);
window.addEventListener("touchend", t_move);
document.addEventListener("keydown", k_down);
document.addEventListener("keyup", k_up);

//Stop scrolling on ios...hopefully
window.addEventListener("touchmove", function(event) { event.preventDefault() });

//touchscreen movement?
function t_move(event) {
    //player[0].x = event.touches[0].screenX - cvs.offsetLeft - player[0].width / 2;
    //player[0].y = event.touches[0].screenY - cvs.offsetTop - player[0].height / 2;
    player[0].x = event.touches[0].clientX - cvs.offsetLeft - player[0].width / 2;
    player[0].y = event.touches[0].clientY - player[0].height / 2;
    inBounds(player[0]);

    console.log("Player: (" + player[0].x + ", " + player[0].y + " )");
    console.log("Touch: (" + event.touches[0].screenX + ", " + event.touches[0].screenY + " )");
    console.log("cvs.offSet: " + cvs.offsetTop + ", " + cvs.offsetLeft);
    //console.log("window.offSet: " + player[0].offsetLeft + ", " + window.offsetLeft);
    console.log("window.page: " + window.pageXOffset + ", " + window.pageYOffset);

    var newCoord = {
        x: Math.round(player[0].x),
        y: Math.round(player[0].y),
        text: "(" + player[0].x + ", " + player[0].y + ")"
    }
    coordinates.push(newCoord);
}

function k_down(event) {
    let k = event.keyCode;
    if (k == 37) d[0] = true;
    if (k == 38) d[1] = true;
    if (k == 39) d[2] = true;
    if (k == 40) d[3] = true;
    if (k == 65) d[4] = true;
    if (k == 87) d[5] = true;
    if (k == 68) d[6] = true;
    if (k == 83) d[7] = true;
}

function k_up(event) {
    let k = event.keyCode;
    if (k == 37) d[0] = false;
    if (k == 38) d[1] = false;
    if (k == 39) d[2] = false;
    if (k == 40) d[3] = false;
    if (k == 65) d[4] = false;
    if (k == 87) d[5] = false;
    if (k == 68) d[6] = false;
    if (k == 83) d[7] = false;
}

function collision(rect1, rect2, buffer) {
    if (rect1.x + buffer < rect2.x + rect2.width && //food is left
        rect1.x + rect1.width - buffer > rect2.x && //fod is right
        rect1.y + buffer < rect2.y + rect2.height && //food is above
        rect1.y + rect1.height - buffer > rect2.y) { //food is below
        // collision detected!
        return true;
    } else {
        return false;
    }
}

function CompMove(rect1, rect2) {
    var b = box;

    var isLeft = Math.abs(rect2.x + rect2.width - rect1.x) <= b;
    var isRight = Math.abs(rect1.x + rect1.width - rect2.x) <= b;
    var isAbove = Math.abs(rect2.y + rect2.height - rect1.y) <= b;
    var isBelow = Math.abs(rect1.y + rect1.height - rect2.y) <= b;

    /*if (isLeft) { player.x += step };
    if (isRight) { player.x -= step };
    if (isAbove) { player.y += step };
    if (isBelow) { player.y -= step };*/
    if (isLeft && isAbove) { //food is left & abpve
        rect1.x += step; // move right
        rect1.y += step; //move down
    } else if (isRight && isAbove) { //food is right & above
        rect1.x -= step; // move left
        rect1.y += step; //move down
    } else if (isRight && isBelow) { //food is right & below
        rect1.x -= step; // move left
        rect1.y -= step; //move up
    } else if (isLeft && isBelow) { //food is left & below
        rect1.x += step; // move right
        rect1.y -= step; //move up
    }
    /* else if (isLeft) {
        rect1.x += step;
      } else if (isRight) {
        rect1.x -= step;
      } else if (isAbove) {
        rect1.y += step;
      } else if (isBelow) {
        rect1.y -= step;
      }*/
    inCompBounds(rect1);
};

function movePlayers() {
    if (d[0]) player[0].x -= step; //left
    if (d[1]) player[0].y -= step; //up
    if (d[2]) player[0].x += step; //right
    if (d[3]) player[0].y += step; //down
    inBounds(player[0]);
    if (player.length > 1) {
        if (d[4]) player[1].x -= step; //left
        if (d[5]) player[1].y -= step; //up
        if (d[6]) player[1].x += step; //right
        if (d[7]) player[1].y += step; //down
        inBounds(player[1]);
    }

}

function draw() {
    ctx.canvas.width = window.innerWidth - 100;
    ctx.canvas.height = window.innerHeight - 50;
    box = cvs.height / 12;
    step = box / 5;
    drawBackground();

    for (var k = 0; k < player.length; k++) {
        drawPlayer(player[k]);
    }

    //tiles of food
    for (var i = 0; i < food.length; i++) {
        if (food[i].good == false) {
            ctx.drawImage(b, food[i].x, food[i].y, b.width, b.height);
        } else {
            ctx.drawImage(f, food[i].x, food[i].y, f.width, f.height);
        }

        //moves food
        food[i].x += food[i].X_step;
        food[i].y += food[i].Y_step;

        //keeps food in bounds
        if (food[i].x > (cvs.width - food[i].width)) {
            food[i].X_step = -1 * food[i].X_step;
            food[i].x = cvs.width - food[i].width + 1
        }

        if (food[i].x < 0) {
            food[i].X_step = -1 * food[i].X_step;
            food[i].x = 1
        }

        if (food[i].y > (cvs.height - food[i].height)) {
            food[i].Y_step = -1 * food[i].Y_step;
            food[i].y = cvs.height - food[i].height - 1
        }

        if (food[i].y < 100) {
            food[i].Y_step = -1 * food[i].Y_step;
            food[i].y = 101
        }


        for (var k = 0; k < player.length; k++) {
            //moves computer if bad food is close to the computer
            if (food[i].good == false && player[k].computer) {
                CompMove(player[k], food[i]);
            }
            //Checks if you have eaten food
            if (collision(player[k], food[i], box / 8)) {
                if (food[i].good == false && player[k].health > 0) {
                    player[k].health--;
                    check_game_over(player[k]);

                    food_speed = food_speed * 0.9
                    score++;
                    console.log(food.length)

                    NewFood(food[i].x - box, food[i].y + box, -0.8 * food[i].X_step, -0.8 * food[i].Y_step)
                    NewFood(food[i].x - box, food[i].y - box, -0.8 * food[i].X_step, 0.8 * food[i].Y_step)
                    console.log(food.length)
                    food.splice(i, 1);
                    break;
                }

            }
        }
    }
    //done going through tiles of food
    if (player.length > 0)
        movePlayers();

    t++;
    if (t == nf) {
        t = 0;
        nf--;
        NewFood();
    }

    /*for (let i = 0; i < coordinates.length; i++) {
        ctx.fillText(coordinates[i].text, coordinates[i].x, coordinates[i].y);
    }*/
    //GAMEOVER
    /* if (foodX < 0 || foodX >= cvs.width || foodY < 2 * box || foodY >= cvs.height || collision(newHead, food)){
       clearInterval(game);
     }*/

    ctx.fillStyle = "white";
    ctx.font = "bold 45px Courier"
    ctx.fillText("Score: " + (food.length + score), box, 0.6 * box);
    //ctx.fillText("Lives: " + player[0].health, box * 7, 1.2 * box);
};

//window.requestAnimationFrame(draw);
let game = setInterval(draw, 20);