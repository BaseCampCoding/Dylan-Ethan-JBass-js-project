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
        var myGif = GIF();
        myGIF.load("assets/ gothicvania patreon collection/Gothic-hero-Files/GIFS/gothic-hero-run.gif")
        heroImage = new Image();
        heroImage.src = "assets/ gothicvania patreon collection/Gothic-hero-Files/GIFS/gothic-hero-run.gif";
       
        game.drawEnemy(100,100,5, myGif.image); 
        
        window.requestAnimationFrame(game.draw);
    },

    drawEnemy: function(x, y, r, image)
    {   
        let image2 = new Image();
        image2.src = "assets/ gothicvania patreon collection/Gothic-hero-Files/PNG/gothic-hero-jump.png";
        game.ctx.beginPath();
        game.ctx.arc(x,y,r,0,2*Math.PI);
        game.ctx.fillStyle = image;
        game.ctx.fill();


    },
};