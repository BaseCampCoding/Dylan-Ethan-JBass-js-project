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
