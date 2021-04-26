
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
