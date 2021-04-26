const mainScreen = document.getElementById("main-screen");
const easyBtn = document.getElementById("easy")
const medBtn = document.getElementById("medium")
const hardBtn = document.getElementById("hard")

easyBtn.addEventListener("click", function(){
    mainScreen.classList.add("hideMain")
    easyMode()
});

medBtn.addEventListener("click", function(){
    mainScreen.classList.add("hideMain")
    mediumMode()
});

hardBtn.addEventListener("click", function(){
    mainScreen.classList.add("hideMain")
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

        Window.requestAnimationFrame(game.draw);
    },
};

// EASY MODE
function easyMode(){
    console.log("Easy Mode")
};

// MEDIUM MODE
function mediumMode(){
    console.log("Medium Mode")
};

// HARD MODE
function hardMode(){
    console.log("Hard Mode")
};
