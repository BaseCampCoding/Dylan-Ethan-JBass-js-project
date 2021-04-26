const body = document.getElementById("body");
const gameContainer = document.getElementById("game-container")
const mainScreen = document.getElementById("main-screen");
const easyBtn = document.getElementById("easy");
const medBtn = document.getElementById("medium");
const hardBtn = document.getElementById("hard");


window.onload = function (){
    mainScreen.style.display = "block";
    gameContainer.style.display = "none";
}

easyBtn.addEventListener("click", function(){
    mainScreen.style.display = "none";
    gameContainer.style.display = "block";
    body.style.overflow = "scroll";
    easyMode()
});

medBtn.addEventListener("click", function(){
    mainScreen.style.display = "none";
    gameContainer.style.display = "block";
    body.style.overflow = "scroll";
    mediumMode()
});

hardBtn.addEventListener("click", function(){
    mainScreen.style.display = "none";
    gameContainer.style.display = "block";
    body.style.overflow = "scroll";
    hardMode()
});

const game = {
    canvas: false,
    ctx: false,
    init: function () {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
      
        setInterval(game.update, 1000/30);
        
        window.requestAnimationFrame(game.draw);
    },
    update: function () {
        
    },
    draw: function () {
       


        game.drawEnemy(100, 100, 5, 'red'); 
        
        Window.requestAnimationFrame(game.draw);
    },

    drawEnemy: function(x, y, r, color)
    {   
        let image2 = new Image();
        image2.src = "assets/ gothicvania patreon collection/Gothic-hero-Files/PNG/gothic-hero-jump.png";
        game.ctx.beginPath();
        game.ctx.arc(x,y,r,0,2*Math.PI);
        game.ctx.fillStyle = color;
        game.ctx.fill();


    },
};

// EASY MODE
function easyMode(){
    console.log("Easy Mode");
    
};

// MEDIUM MODE
function mediumMode(){
    console.log("Medium Mode");
    
};

// HARD MODE
function hardMode(){
    console.log("Hard Mode");
    
};
