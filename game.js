const game = {
    canvas: false,
    ctx: false,
    init: function () {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        console.log('fuck')
      
        setInterval(game.update, 1000/30);
        
        window.requestAnimationFrame(game.draw);
    },
    update: function () {
        
    },
    draw: function () {
        heroImage = new Image();
        heroImage.src = "assets/ gothicvania patreon collection/Fire-Skull-Files/GIF/fire-skull-no-fire.gif";
       
        game.drawEnemy(heroImage, 100, 100); 
        
        window.requestAnimationFrame(game.draw);
    },

    drawEnemy: function(image, x, y)
    {   
        let image2 = new Image();
        image2.src = "assets/ gothicvania patreon collection/Gothic-hero-Files/PNG/gothic-hero-jump.png";
        game.ctx.beginPath();
        game.ctx.drawImage(image, x, y);


    },
};