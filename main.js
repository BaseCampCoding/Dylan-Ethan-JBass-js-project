const body = document.getElementById("body");
const mainScreen = document.getElementById("main-screen");
const easyBtn = document.getElementById("easy");
const medBtn = document.getElementById("medium");
const hardBtn = document.getElementById("hard");

function onLoad(){
    mainScreen.style.display = "block";
};

easyBtn.addEventListener("click", function(){
    mainScreen.style.display = "none";
    body.style.overflow = "scroll";
    easyMode()
});

medBtn.addEventListener("click", function(){
    mainScreen.style.display = "none";
    body.style.overflow = "scroll";
    mediumMode()
});

hardBtn.addEventListener("click", function(){
    mainScreen.style.display = "none";
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
        let image2 = new Image();
        image2.src = "assets/ gothicvania patreon collection/Gothic-hero-Files/GIFS/gothic-hero-run.gif";

        game.drawEnemy();

        Window.requestAnimationFrame(game.draw);
    },

    drawEnemy: function()
    {
        game.ctx.beginPath();
        let image2 = new Image();
        image2.src = "assets/ gothicvania patreon collection/Ghost-Files/GIFS/ghost-vanish.gif";
        ctx.drawImage(image2, 100, 100, 5);

        

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
