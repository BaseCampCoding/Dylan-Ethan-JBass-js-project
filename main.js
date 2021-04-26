const mainScreen = document.getElementById("main-screen");
console.log(mainScreen)
function hideMainScreen(){
    mainScreen.classList.add("hideMain")
    
}
const easyBtn = document.getElementById("easy").addEventListener('click', hideMainScreen)
const medBtn = document.getElementById("medium").addEventListener('click', hideMainScreen)
const hardBtn = document.getElementById("hard").addEventListener('click', hideMainScreen)





// Global Vars


// Game board

// Enemies

// Projectiles

