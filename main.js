const mainScreen = document.getElementById("main-screen");
function hideMainScreen(){
    mainScreen.classList.add("hideMain")
    
}
const easyBtn = document.getElementById("easy").addEventListener('click', hideMainScreen)
const medBtn = document.getElementById("medium").addEventListener('click', hideMainScreen)
const hardBtn = document.getElementById("hard").addEventListener('click', hideMainScreen)

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
