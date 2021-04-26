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

        game.drawEnemy(100, 100, 5, 'rgb(250, 0, 0)');

        Window.requestAnimationFrame(game.draw);
    },

    drawEnemy: function(x, y,r,)
    {
        game.ctx.beginPath();
        game.ctx.arc(x,y,r,0,2*Math.PI);
        game.ctx.fillStyle = color;
        game.ctx.fill();
        

    },
};