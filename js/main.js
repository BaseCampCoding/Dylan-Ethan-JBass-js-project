const body = document.getElementById("body");
const gameContainer = document.getElementById("game-container")
const mainScreen = document.getElementById("main-screen");
const easyBtn = document.getElementById("easy");
const medBtn = document.getElementById("medium");
const hardBtn = document.getElementById("hard");
const moneyCounter = document.getElementById("money")
const scoreCounter = document.getElementById("score")
const playerHealth = document.getElementById("health")

// WINDOW ONLOAD 
window.onload = function (){
    mainScreen.style.display = "block";
    gameContainer.style.display = "none";
    // gameOver.style.display = "block"
}

// EASY BUTTON EVENT
easyBtn.addEventListener("click", function(){
    mainScreen.style.display = "none";
    gameContainer.style.display = "block";
    easyMode()
});

// MEDIUM BUTTON EVENT
medBtn.addEventListener("click", function(){
    mainScreen.style.display = "none";
    gameContainer.style.display = "block";
    mediumMode()
});

// HARD BUTTON EVENT
hardBtn.addEventListener("click", function(){
    mainScreen.style.display = "none";
    gameContainer.style.display = "block";
    hardMode()
});


// EASY MODE
function easyMode(){
    body.style.overflow = "scroll";
    let config = {
        type: Phaser.AUTO,
        parent: 'content',
        width: 1280,
        height: 512,
        physics: {
            default: 'arcade'
        },
        scene: {
            key: 'main',
            preload: preload,
            create: create,
            update: update
        }
    };
    
    let game = new Phaser.Game(config);
    
    let path;
    let turrets;
    let enemies;
    let money = 5;
    moneyCounter.innerText = money
    let score = 0;
    
    let ENEMY_SPEED = .7/10000;
    
    let BULLET_DAMAGE = 50;
    
    let map =  [[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [-1,-1,-1,-1,-1,-1,-1,-1, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                [ 0, 0, 0, 0, 0, 0, 0, 0,-1,-1, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
    
    function preload() {    
        this.load.image("background", "assets/ gothicvania patreon collection/Old-dark-Castle-tileset-Files/PNG/preview-old-dark-castle-interior-tileset.png");
        this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/spritesheet.json');
        this.load.spritesheet('enemy', 'assets/ gothicvania patreon collection/Gothic-hero-Files/PNG/gothic-hero-run.png', {
            frameWidth: 60,
            frameHeight: 48
        });
        this.load.spritesheet('turret', 'assets/ gothicvania patreon collection/Hell-Beast-Files/PNG/with-stroke/hell-beast-idle.png', {
            frameWidth: 55,
            frameHeight: 67
        });
        this.load.spritesheet('bullet', 'assets/ gothicvania patreon collection/Hell-Beast-Files/PNG/fire-ball.png', {
            frameWidth: 16,
            frameHeight: 16
        });
    }
    
    let Enemy = new Phaser.Class({
    
            Extends: Phaser.GameObjects.Sprite,
    
            initialize:
    
            function Enemy (scene)
            {
                Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'enemy');
    
                this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
                this.hp = 0;
            },
            
    
            startOnPath: function ()
            {
                this.follower.t = 0;
                this.hp = Math.floor(Math.random()* 200);
                
                path.getPoint(this.follower.t, this.follower.vec);
                
                this.setPosition(this.follower.vec.x, this.follower.vec.y);            
            },
            receiveDamage: function(damage) {
                this.hp -= damage;           
                
                // if hp drops below 0 we deactivate this enemy
                if(this.hp <= 0) {
                    this.setActive(false);
                    this.setVisible(false);  
                    money += 2;
                    moneyCounter.innerText = money
                    score += 100
                    scoreCounter.innerText = score
                }
            },
            update: function (time, delta)
            {
                this.follower.t += ENEMY_SPEED * delta;
                path.getPoint(this.follower.t, this.follower.vec);
                
                this.setPosition(this.follower.vec.x, this.follower.vec.y);
    
                if (this.follower.t >= 1)
                {
                    this.setActive(false);
                    this.setVisible(false);
                    playerHealth.value -= 10;
                    if (playerHealth.value <= 0) {
                        alert("BOO! - this is the scariest thing nate would let me put");
                        document.location.reload();
                    }
                }
            }
    
    });
    
    function getEnemy(x, y, distance) {
        let enemyUnits = enemies.getChildren();
        for(let i = 0; i < enemyUnits.length; i++) {       
            if(enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) < distance)
                return enemyUnits[i];
        }
        return false;
    } 
    
    let Turret = new Phaser.Class({
    
            Extends: Phaser.GameObjects.Sprite,
    
            initialize:
    
            function Turret (scene)
            {
                Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'turret');
                this.nextTic = 0;
            },
            place: function(i, j) {  
                if (money >= 5){
                    money -= 5;
                    moneyCounter.innerText = money
                    this.y = i * 64 + 64/2;
                    this.x = j * 64 + 64/2;
                    map[i][j] = 1; 
                    
                } else{
                    this.y = i * -500
                    this.x = i * -500
                }         
            },
            fire: function() {
                let enemy = getEnemy(this.x, this.y, 200);
                if(enemy) {
                    let angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
                    addBullet(this.x, this.y, angle);
                    this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
                }
            },
            update: function (time, delta)
            {
                if(time > this.nextTic) {
                    this.fire();
                    this.nextTic = time + 1000;
                }
            }
    });
        
    let Bullet = new Phaser.Class({
    
            Extends: Phaser.GameObjects.Sprite,
    
            initialize:
    
            function Bullet (scene)
            {
                Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'bullet');

                this.incX = 0;
                this.incY = 0;
                this.lifespan = 0;

                this.speed = Phaser.Math.GetSpeed(600, 1);
            },
    
            fire: function (x, y, angle)
            {
                this.setActive(true);
                this.setVisible(true);
                //  Bullets fire from the middle of the screen to the given x/y
                this.setPosition(x, y);
                
            //  we don't need to rotate the bullets as they are round
            //    this.setRotation(angle);
    
                this.dx = Math.cos(angle);
                this.dy = Math.sin(angle);
    
                this.lifespan = 1000;
            },
    
            update: function (time, delta)
            {
                this.lifespan -= delta;
    
                this.x += this.dx * (this.speed * delta);
                this.y += this.dy * (this.speed * delta);
    
                if (this.lifespan <= 0)
                {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }
    
        });
     
    function create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background')
        this.background.setOrigin(0,0)
        let graphics = this.add.graphics();    
        drawLines(graphics)
        path = this.add.path(0, 230);
        path.lineTo(200, 230);
        path.lineTo(510, 225);
        path.lineTo(510, 270)
        path.lineTo(600, 270)
        path.lineTo(630, 210)
        path.lineTo(700, 210)
        path.lineTo(710, 270)
        path.lineTo(800, 270)
        path.lineTo(900, 210)
        path.lineTo(970, 210)
        path.lineTo(970, 250)
        path.lineTo(1200, 250)
        path.lineTo(1250, 220)
        path.lineTo(1300, 220)
        

        graphics.lineStyle(1, 0xffffff, 1);
        path.draw(graphics).setVisible(false);
        
        enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        
        turrets = this.add.group({ classType: Turret, runChildUpdate: true });
        
        bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        
        this.nextEnemy = 0;
        
        this.physics.add.overlap(enemies, bullets, damageEnemy);
        
        this.input.on('pointerdown', placeTurret);

        this.anims.create({ 
            key: "fire", 
            frames: this.anims.generateFrameNumbers("bullet"),
            frameRate: 20, 
            repeat: -1,
          });
    }
    
    function damageEnemy(enemy, bullet) {  
        // only if both enemy and bullet are alive
        if (enemy.active === true && bullet.active === true) {
            // we remove the bullet right away
            bullet.setActive(false);
            bullet.setVisible(false);    
            
            // decrease the enemy hp with BULLET_DAMAGE
            enemy.receiveDamage(BULLET_DAMAGE);
        }
    }
    
    function drawLines(graphics) {
        graphics.lineStyle(1, 0x0000ff, 0.8);
        for(let i = 0; i < 8; i++) {
            graphics.moveTo(0, i * 64);
            graphics.lineTo(1300, i * 64);
        }
        for(let j = 0; j < 21; j++) {
            graphics.moveTo(j * 64, 0);
            graphics.lineTo(j * 64, 512);
        }
        graphics.strokePath();
    }
    
    function update(time, delta) {  
    
        if (time > this.nextEnemy)
        {
            let enemy = enemies.get();
            if (enemy)
            {
                enemy.setActive(true);
                enemy.setVisible(true);
                enemy.startOnPath();
    
                this.nextEnemy = time + 2000;
            }      
        }
    }
    
    function canPlaceTurret(i, j) {
        return map[i][j] === 0;
    }
    
    function placeTurret(pointer) {
        let i = Math.floor(pointer.y/64);
        let j = Math.floor(pointer.x/64);
        if(canPlaceTurret(i, j)) {
            let turret = turrets.get();
            if (turret)
            {
                turret.setActive(true);
                turret.setVisible(true);
                turret.place(i, j);
            }   
        }
    }
    
    function addBullet(x, y, angle) {
        let bullet = bullets.get();
        if (bullet){;
            {
                bullet.fire(x, y, angle);
                bullet.play('fire');
            }
        }
        
        
    }
    
    
};

// MEDIUM MODE
function mediumMode(){
    body.style.overflow = "scroll";
    let config = {
        type: Phaser.AUTO,
        parent: 'content',
        width: 1280,
        height: 512,
        physics: {
            default: 'arcade'
        },
        scene: {
            key: 'main',
            preload: preload,
            create: create,
            update: update
        }
    };
    
    let game = new Phaser.Game(config);
    
    let path;
    let turrets;
    let enemies;
    let money = 10;
    let score = 0;
    moneyCounter.innerText = money
    
    let ENEMY_SPEED = .6/10000;
    
    let BULLET_DAMAGE = 100;
    
    let map =  [[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1,-1,-1, 0,-1,-1,-1],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 0,-1,-1,-1,-1,-1,-1,-1],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0,-1,-1,-1,-1,-1,-1,-1,-1, 0, 0, 0, 0],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, -1, 0,-1,-1,-1,-1,-1,-1,-1],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 , 0, 0, 0,0,0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [-1,-1,-1,-1,-1,-1,-1,-1,0,-1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0]];
                
    function preload() {    
        this.load.image("background", "assets/ gothicvania patreon collection/Gothic-Horror-Files/PNG/PREVIEW-gothic-horror.png")
        this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/spritesheet.json');
        this.load.spritesheet('enemy', 'assets/ gothicvania patreon collection/Gothic-hero-Files/PNG/gothic-hero-run.png', {
            frameWidth: 60,
            frameHeight: 48
        });
        this.load.spritesheet('turret', 'assets/ gothicvania patreon collection/Hell-Beast-Files/PNG/with-stroke/hell-beast-idle.png', {
            frameWidth: 55,
            frameHeight: 67
        });
        this.load.spritesheet('bullet', 'assets/ gothicvania patreon collection/Hell-Beast-Files/PNG/fire-ball.png', {
            frameWidth: 16,
            frameHeight: 16
        });
    }
    
    let Enemy = new Phaser.Class({
    
            Extends: Phaser.GameObjects.Sprite,
    
            initialize:
    
            function Enemy (scene)
            {
                Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'enemy');
    
                this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
                this.hp = 0;
            },
    
            startOnPath: function ()
            {
                this.follower.t = 0;
                this.hp = Math.floor(Math.random()* 901);
                console.log(this.hp)
                
                path.getPoint(this.follower.t, this.follower.vec);
                
                this.setPosition(this.follower.vec.x, this.follower.vec.y);            
            },
            receiveDamage: function(damage) {
                this.hp -= damage;           
                
                // if hp drops below 0 we deactivate this enemy
                if(this.hp <= 0) {
                    this.setActive(false);
                    this.setVisible(false);  
                    money += 3; 
                    moneyCounter.innerText = money 
                    score += 100
                    scoreCounter.innerText = score
                }
            },
            update: function (time, delta)
            {
                this.follower.t += ENEMY_SPEED * delta;
                path.getPoint(this.follower.t, this.follower.vec);
                
                this.setPosition(this.follower.vec.x, this.follower.vec.y);
    
                if (this.follower.t >= 1)
                {
                    this.setActive(false);
                    this.setVisible(false);
                    playerHealth.value -= 10;
                    if (playerHealth.value <= 0) {
                        alert("BOO! - this is the scariest thing nate would let me put");
                        document.location.reload();
                    }
                }
            }
    
    });
    
    function getEnemy(x, y, distance) {
        let enemyUnits = enemies.getChildren();
        for(let i = 0; i < enemyUnits.length; i++) {       
            if(enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) < distance)
                return enemyUnits[i];
        }
        return false;
    } 
    
    let Turret = new Phaser.Class({
    
            Extends: Phaser.GameObjects.Sprite,
    
            initialize:
    
            function Turret (scene)
            {
                Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'turret');
                this.nextTic = 0;
            },
            place: function(i, j) {  
                if (money >= 7){
                    money -= 7;
                    moneyCounter.innerText = money
                    this.y = i * 64 + 64/2;
                    this.x = j * 64 + 64/2;
                    map[i][j] = 1; 
                    
                } else{
                    this.y = i * -500
                    this.x = i * -500
                }                   
            },
            fire: function() {
                let enemy = getEnemy(this.x, this.y, 200);
                if(enemy) {
                    let angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
                    addBullet(this.x, this.y, angle);
                    this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
                }
            },
            update: function (time, delta)
            {
                if(time > this.nextTic) {
                    this.fire();
                    this.nextTic = time + 400;
                }
            }
    });
        
    let Bullet = new Phaser.Class({
    
            Extends: Phaser.GameObjects.Sprite,
    
            initialize:
    
            function Bullet (scene)
            {
                Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'bullet');
    
                this.incX = 0;
                this.incY = 0;
                this.lifespan = 0;
    
                this.speed = Phaser.Math.GetSpeed(1000, 1);
            },
    
            fire: function (x, y, angle)
            {
                this.setActive(true);
                this.setVisible(true);
                //  Bullets fire from the middle of the screen to the given x/y
                this.setPosition(x, y);
                
            //  we don't need to rotate the bullets as they are round
            //    this.setRotation(angle);
    
                this.dx = Math.cos(angle);
                this.dy = Math.sin(angle);
    
                this.lifespan = 1000;
            },
    
            update: function (time, delta)
            {
                this.lifespan -= delta;
    
                this.x += this.dx * (this.speed * delta);
                this.y += this.dy * (this.speed * delta);
    
                if (this.lifespan <= 0)
                {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }
    
        });
     
    function create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background')
        this.background.setOrigin(0,0)
        let graphics = this.add.graphics();    
        drawLines(graphics);
        path = this.add.path(0, 100);
        path.lineTo(200, 130);
        path.lineTo(250, 125)
        path.lineTo(425, 125)
        path.lineTo(500, 100)
        path.lineTo(600, 100)
        path.lineTo(650, 120)
        path.lineTo(700, 135)
        path.lineTo(800, 50)
        path.lineTo(900, 110)
        path.lineTo(1270, 120)
        path.lineTo(1270, 300)
        path.lineTo(1040, 300)
        path.lineTo(1020, 290)
        path.lineTo(900, 290)
        path.lineTo(800, 230)
        path.lineTo(720, 320)
        path.lineTo(600, 300)
        path.lineTo(550, 250)
        path.lineTo(400, 300)
        path.lineTo(300, 300)
        path.lineTo(200, 310)
        path.lineTo(150, 300)
        path.lineTo(0, 300)
        path.lineTo(0, 500)
        path.lineTo(250, 500)
        path.lineTo(300, 470)
        path.lineTo(425, 470)
        path.lineTo(500, 440)
        path.lineTo(560, 440)
        path.lineTo(630, 480)
        path.lineTo(700, 490)
        path.lineTo(790, 400)
        path.lineTo(860, 460)
        path.lineTo(1300, 460)

        
        
        graphics.lineStyle(1, 0xffffff, 0.5);
        path.draw(graphics).setVisible(false);
        
        enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        
        turrets = this.add.group({ classType: Turret, runChildUpdate: true });
        
        bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        
        this.nextEnemy = 0;
        
        this.physics.add.overlap(enemies, bullets, damageEnemy);
        
        this.input.on('pointerdown', placeTurret);

        this.anims.create({ 
            key: "fire", 
            frames: this.anims.generateFrameNumbers("bullet"),
            frameRate: 20, 
            repeat: -1,
          });

    }
    
    function damageEnemy(enemy, bullet) {  
        // only if both enemy and bullet are alive
        if (enemy.active === true && bullet.active === true) {
            // we remove the bullet right away
            bullet.setActive(false);
            bullet.setVisible(false);    
            
            // decrease the enemy hp with BULLET_DAMAGE
            enemy.receiveDamage(BULLET_DAMAGE);
        }
    }
    
    function drawLines(graphics) {
        graphics.lineStyle(1, 0x0000ff, 0.8);
        for(let i = 0; i < 8; i++) {
            graphics.moveTo(0, i * 64);
            graphics.lineTo(1300, i * 64);
        }
        for(let j = 0; j < 21; j++) {
            graphics.moveTo(j * 64, 0);
            graphics.lineTo(j * 64, 512);
        }
        graphics.strokePath();
    }
    
    function update(time, delta) {  
    
        if (time > this.nextEnemy)
        {
            let enemy = enemies.get();
            if (enemy)
            {
                enemy.setActive(true);
                enemy.setVisible(true);
                enemy.startOnPath();
    
                this.nextEnemy = time + 1100;
            }       
        }
    }
    
    function canPlaceTurret(i, j) {
        return map[i][j] === 0;
    }
    
    function placeTurret(pointer) {
        let i = Math.floor(pointer.y/64);
        let j = Math.floor(pointer.x/64);
        if(canPlaceTurret(i, j)) {
            let turret = turrets.get();
            if (turret)
            {
                turret.setActive(true);
                turret.setVisible(true);
                turret.place(i, j);
            }   
        }
    }
    
    function addBullet(x, y, angle) {
        let bullet = bullets.get();
        if (bullet)
        {
            bullet.fire(x, y, angle);
            bullet.play('fire');
        }
    }
    
};

// HARD MODE
function hardMode(){
    body.style.overflow = "scroll";
    let config = {
        type: Phaser.AUTO,
        parent: 'content',
        width: 1280,
        height: 512,
        physics: {
            default: 'arcade'
        },
        scene: {
            key: 'main',
            preload: preload,
            create: create,
            update: update
        }
    };
    
    let game = new Phaser.Game(config);
    
    let path;
    let turrets;
    let enemies;
    let money = 10
    moneyCounter.innerText = money
    let score = 0;
    
    let ENEMY_SPEED = 5/10000;
    
    let BULLET_DAMAGE = 100;
    
    let map =  [[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [-1,-1,-1,-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [-1,-1,-1,-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0,-1,-1, -1,-1,-1,-1,-1,-1,-1,-1, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]

    function preload() {    
        this.load.image("background", "hard_platform.jpg")
        this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/spritesheet.json');
        this.load.spritesheet('enemy', 'assets/ gothicvania patreon collection/Gothic-hero-Files/PNG/gothic-hero-run.png', {
            frameWidth: 60,
            frameHeight: 48
        });
        this.load.spritesheet('turret', 'assets/ gothicvania patreon collection/Hell-Beast-Files/PNG/with-stroke/hell-beast-idle.png', {
            frameWidth: 55,
            frameHeight: 67
        });
        this.load.spritesheet('bullet', 'assets/ gothicvania patreon collection/Hell-Beast-Files/PNG/fire-ball.png', {
            frameWidth: 16,
            frameHeight: 16
        });
    }
    
    let Enemy = new Phaser.Class({
    
            Extends: Phaser.GameObjects.Sprite,
    
            initialize:
    
            function Enemy (scene)
            {
                Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'enemy');
    
                this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
                this.hp = 0;
            },
    
            startOnPath: function ()
            {
                this.follower.t = 0;
                this.hp = Math.floor(Math.random()* 800);
                
                path.getPoint(this.follower.t, this.follower.vec);
                
                this.setPosition(this.follower.vec.x, this.follower.vec.y);            
            },
            receiveDamage: function(damage) {
                this.hp -= damage;           
                
                // if hp drops below 0 we deactivate this enemy
                if(this.hp <= 0) {
                    this.setActive(false);
                    this.setVisible(false);   
                    score += 100
                    scoreCounter.innerText = score 
                    money += 1;
                    moneyCounter.innerText = money  
                }
            },
            update: function (time, delta)
            {
                this.follower.t += ENEMY_SPEED * delta;
                path.getPoint(this.follower.t, this.follower.vec);
                
                this.setPosition(this.follower.vec.x, this.follower.vec.y);
    
                if (this.follower.t >= 1)
                {
                    this.setActive(false);
                    this.setVisible(false);
                    playerHealth.value -= 10;
                    if (playerHealth.value <= 0) {
                        alert("BOO! - this is the scariest thing nate would let me put");
                        document.location.reload();
                    }
                }
            }
    
    });
    
    function getEnemy(x, y, distance) {
        let enemyUnits = enemies.getChildren();
        for(let i = 0; i < enemyUnits.length; i++) {       
            if(enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) < distance)
                return enemyUnits[i];
        }
        return false;
    } 
    
    let Turret = new Phaser.Class({
    
            Extends: Phaser.GameObjects.Sprite,
    
            initialize:
    
            function Turret (scene)
            {
                Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'turret');
                this.nextTic = 0;
            },
            place: function(i, j) {            
                if (money >= 10){
                    money -= 10;
                    moneyCounter.innerText = money
                    this.y = i * 64 + 64/2;
                    this.x = j * 64 + 64/2;
                    map[i][j] = 1; 
                    
                } else{
                    this.y = i * -500
                    this.x = i * -500
                }                 
            },
            fire: function() {
                let enemy = getEnemy(this.x, this.y, 200);
                if(enemy) {
                    let angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
                    addBullet(this.x, this.y, angle);
                    this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
                }
            },
            update: function (time, delta)
            {
                if(time > this.nextTic) {
                    this.fire();
                    this.nextTic = time + 60;
                }
            }
    });
        
    let Bullet = new Phaser.Class({
    
            Extends: Phaser.GameObjects.Sprite,
    
            initialize:
    
            function Bullet (scene)
            {
                Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'bullet');
    
                this.incX = 0;
                this.incY = 0;
                this.lifespan = 0;
    
                this.speed = Phaser.Math.GetSpeed(600, 1);
            },
    
            fire: function (x, y, angle)
            {
                this.setActive(true);
                this.setVisible(true);
                //  Bullets fire from the middle of the screen to the given x/y
                this.setPosition(x, y);
                
            //  we don't need to rotate the bullets as they are round
            //    this.setRotation(angle);
    
                this.dx = Math.cos(angle);
                this.dy = Math.sin(angle);
    
                this.lifespan = 1000;
            },
    
            update: function (time, delta)
            {
                this.lifespan -= delta;
    
                this.x += this.dx * (this.speed * delta);
                this.y += this.dy * (this.speed * delta);
    
                if (this.lifespan <= 0)
                {
                    this.setActive(false);
                    this.setVisible(false);
                    
                }
            }
    
        });
     
    function create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background')
        this.background.setOrigin(0,0)
        let graphics = this.add.graphics();
        path = this.add.path(0, 140);
        path.lineTo(330, 140);
        path.lineTo(500, 300);
        path.lineTo(950, 300);
        path.lineTo(1000, 260)
        path.lineTo(1300,260)
        
        
        
        drawLines(graphics);
        
        graphics.lineStyle(1, 0xffffff, 1);
        path.draw(graphics).setVisible(false);
        
        enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        
        turrets = this.add.group({ classType: Turret, runChildUpdate: true });
        
        bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        
        this.nextEnemy = 0;
        
        this.physics.add.overlap(enemies, bullets, damageEnemy);
        
        this.input.on('pointerdown', placeTurret);

        this.anims.create({ 
            key: "fire", 
            frames: this.anims.generateFrameNumbers("bullet"),
            frameRate: 20, 
            repeat: -1,
          });

    }
    
    function damageEnemy(enemy, bullet) {  
        // only if both enemy and bullet are alive
        if (enemy.active === true && bullet.active === true) {
            // we remove the bullet right away
            bullet.setActive(false);
            bullet.setVisible(false);    
            
            // decrease the enemy hp with BULLET_DAMAGE
            enemy.receiveDamage(BULLET_DAMAGE);
        }
    }
    
    function drawLines(graphics) {
        graphics.lineStyle(1, 0x0000ff, 0.8);
        for(let i = 0; i < 8; i++) {
            graphics.moveTo(0, i * 64);
            graphics.lineTo(1300, i * 64);
        }
        for(let j = 0; j < 21; j++) {
            graphics.moveTo(j * 64, 0);
            graphics.lineTo(j * 64, 512);
        }
        graphics.strokePath();
    }
    
    function update(time, delta) {  
    
        if (time > this.nextEnemy)
        {
            let enemy = enemies.get();
            if (enemy)
            {
                enemy.setActive(true);
                enemy.setVisible(true);
                enemy.startOnPath();
    
                this.nextEnemy = time + 2000;
            }       
        }
    }
    
    function canPlaceTurret(i, j) {
        return map[i][j] === 0;
    }
    
    function placeTurret(pointer) {
        let i = Math.floor(pointer.y/64);
        let j = Math.floor(pointer.x/64);
        if(canPlaceTurret(i, j)) {
            let turret = turrets.get();
            if (turret)
            {
                turret.setActive(true);
                turret.setVisible(true);
                turret.place(i, j);
            }   
        }
    }
    
    function addBullet(x, y, angle) {
        let bullet = bullets.get();
        if (bullet)
        {
            bullet.fire(x, y, angle);
            bullet.play('fire');
        }
    }
    
};
