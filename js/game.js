const game = {
    canvas: false,
    ctx: false,
    init: function () {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        heroImage = new Image();
        heroImage.src = "assets/ gothicvania patreon collection/Fire-Skull-Files/GIF/fire-skull-no-fire.gif";
      
        setInterval(game.update, 1000/30);

        game.mapEntities.create(heroImage, 10, 10, 50, 50);
        game.mapEntities.create(heroImage, 30, 30, 50, 50);
        
        window.requestAnimationFrame(game.draw);
    },
    update: function () {
        
        game.mapEntities.update();
        
    },
    draw: function () {
        // heroImage = new Image();
        // heroImage.src = "assets/ gothicvania patreon collection/Fire-Skull-Files/GIF/fire-skull-no-fire.gif";
       
        // game.drawEnemy(heroImage, 100, 100); 
        game.ctx.clearRect(0, 0,game.canvas.width, game.canvas.height)
        game.mapEntities.draw();
        
        window.requestAnimationFrame(game.draw);
    },

    drawEnemy: function(image, x, y, w, h)
    {   
        let image2 = new Image();
        image2.src = "assets/ gothicvania patreon collection/Gothic-hero-Files/PNG/gothic-hero-jump.png";
        game.ctx.beginPath();
        game.ctx.drawImage(image, x, y, w, h);


    },
};

game.mapEntities =
{
    list: {},
    idCounter: 0,
    init: function(){},
    create: function(image, x, y, w, h)
    {
        var entity = 
        {
            id: ++this.idCounter,
            image:image,
            x:x,
            y:y,
            w:w,
            h:h,
            update: function()
            {
                this.x++;
                this.y++;
                this.w;
                this.h;
            },
            draw: function()
            {
                game.drawEnemy(this.image, this.x, this.y, this.w, this.h);
            },
        };
        this.list[entity.id] = entity;
        return entity;
    },
    update: function()
    {
        for(i in this.list) this.list[i].update();
    },
    draw: function()
    {
        for(i in this.list) this.list[i].draw();
    },
}