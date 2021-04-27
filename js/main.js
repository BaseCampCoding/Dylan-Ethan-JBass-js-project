const body = document.getElementById("body");
const gameContainer = document.getElementById("game-container")
const mainScreen = document.getElementById("main-screen");
const easyBtn = document.getElementById("easy");
const medBtn = document.getElementById("medium");
const hardBtn = document.getElementById("hard");

// WINDOW ONLOAD 
window.onload = function (){
    mainScreen.style.display = "block";
    gameContainer.style.display = "none";
}

// EASY BUTTON EVENT
easyBtn.addEventListener("click", function(){
    mainScreen.style.display = "none";
    gameContainer.style.display = "block";
    body.style.overflow = "scroll";
    easyMode()
});

// MEDIUM BUTTON EVENT
medBtn.addEventListener("click", function(){
    mainScreen.style.display = "none";
    gameContainer.style.display = "block";
    body.style.overflow = "scroll";
    mediumMode()
});

// HARD BUTTON EVENT
hardBtn.addEventListener("click", function(){
    mainScreen.style.display = "none";
    gameContainer.style.display = "block";
    body.style.overflow = "scroll";
    hardMode()
});


// EASY MODE
function easyMode(){
    let config = {
        type: Phaser.AUTO,
        parent: 'content',
        width: 1300,
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
    
    let ENEMY_SPEED = .5/10000;
    
    let BULLET_DAMAGE = 50;
    
    let map =  [[ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0,-1,-1,-1,-1,-1,-1,-1, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
                [ 0, 0, 0, 0,-1,-1,-1,-1, 0, 0],
                [ 0, 0, 0, 0,-1, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0,-1, 0, 0, 0, 0, 0]];
    
    function preload() {    
        this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/spritesheet.json');
        this.load.image('bullet', 'assets/ gothicvania patreon collection/Hell-Beast-Files/PNG/fire-ball.png');
    }
    
    let Enemy = new Phaser.Class({
    
            Extends: Phaser.GameObjects.Image,
    
            initialize:
    
            function Enemy (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'enemy');
    
                this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
                this.hp = 0;
                this.money = 0;
            },
            
    
            startOnPath: function ()
            {
                this.follower.t = 0;
                this.hp = Math.floor(Math.random()* 300);
                
                path.getPoint(this.follower.t, this.follower.vec);
                
                this.setPosition(this.follower.vec.x, this.follower.vec.y);            
            },
            receiveDamage: function(damage) {
                this.hp -= damage;           
                
                // if hp drops below 0 we deactivate this enemy
                if(this.hp <= 0) {
                    this.setActive(false);
                    this.setVisible(false);  
                    this.money ++;
                    console.log(this.money)
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
    
            Extends: Phaser.GameObjects.Image,
    
            initialize:
    
            function Turret (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'turret');
                this.nextTic = 0;
            },
            place: function(i, j) {            
                this.y = i * 64 + 64/2;
                this.x = j * 64 + 64/2;
                map[i][j] = 1;            
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
    
            Extends: Phaser.GameObjects.Image,
    
            initialize:
    
            function Bullet (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
    
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
        let graphics = this.add.graphics();    
        drawLines(graphics);
        path = this.add.path(96, -32);
        path.lineTo(96, 164);
        path.lineTo(480, 164);
        path.lineTo(480, 350);
        path.lineTo(280, 350);
        path.lineTo(280, 550);
        
        graphics.lineStyle(2, 0xffffff, 1);
        path.draw(graphics);
        
        enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        
        turrets = this.add.group({ classType: Turret, runChildUpdate: true });
        
        bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        
        this.nextEnemy = 0;
        
        this.physics.add.overlap(enemies, bullets, damageEnemy);
        
        this.input.on('pointerdown', placeTurret);
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
            graphics.lineTo(640, i * 64);
        }
        for(let j = 0; j < 10; j++) {
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
            }
        }
        
        
    }
    
};

// MEDIUM MODE
function mediumMode(){
    let config = {
        type: Phaser.AUTO,
        parent: 'content',
        width: 640,
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
    
    let ENEMY_SPEED = 2/10000;
    
    let BULLET_DAMAGE = 70;
    
    let map = [[ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0,-1,-1,-1,-1,-1,-1,-1, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0]];
                
    function preload() {    
        this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/spritesheet.json');
        this.load.image('bullet', 'assets/bullet.png');
    }
    
    let Enemy = new Phaser.Class({
    
            Extends: Phaser.GameObjects.Image,
    
            initialize:
    
            function Enemy (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'enemy');
    
                this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
                this.hp = 0;
            },
    
            startOnPath: function ()
            {
                this.follower.t = 0;
                this.hp = Math.floor(Math.random()* 501);
                
                path.getPoint(this.follower.t, this.follower.vec);
                
                this.setPosition(this.follower.vec.x, this.follower.vec.y);            
            },
            receiveDamage: function(damage) {
                this.hp -= damage;           
                
                // if hp drops below 0 we deactivate this enemy
                if(this.hp <= 0) {
                    this.setActive(false);
                    this.setVisible(false);      
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
    
            Extends: Phaser.GameObjects.Image,
    
            initialize:
    
            function Turret (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'turret');
                this.nextTic = 0;
            },
            place: function(i, j) {            
                this.y = i * 64 + 64/2;
                this.x = j * 64 + 64/2;
                map[i][j] = 1;            
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
    
            Extends: Phaser.GameObjects.Image,
    
            initialize:
    
            function Bullet (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
    
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
        let graphics = this.add.graphics();    
        drawLines(graphics);
        path = this.add.path(96, -32);
        path.lineTo(96, 164);
        path.lineTo(480, 164);
        path.lineTo(480, 544);
        
        graphics.lineStyle(2, 0xffffff, 1);
        path.draw(graphics);
        
        enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        
        turrets = this.add.group({ classType: Turret, runChildUpdate: true });
        
        bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        
        this.nextEnemy = 0;
        
        this.physics.add.overlap(enemies, bullets, damageEnemy);
        
        this.input.on('pointerdown', placeTurret);
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
            graphics.lineTo(640, i * 64);
        }
        for(let j = 0; j < 10; j++) {
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
        }
    }
    
};

// HARD MODE
function hardMode(){
    let config = {
        type: Phaser.AUTO,
        parent: 'content',
        width: 640,
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
    
    let ENEMY_SPEED = 5/10000;
    
    let BULLET_DAMAGE = 60;
    
    let map =  [[ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0,-1,-1,-1,-1,-1,-1,-1, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0]];
    
    function preload() {    
        this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/spritesheet.json');
        this.load.image('bullet', 'assets/bullet.png');
    }
    
    let Enemy = new Phaser.Class({
    
            Extends: Phaser.GameObjects.Image,
    
            initialize:
    
            function Enemy (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'enemy');
    
                this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
                this.hp = 0;
            },
    
            startOnPath: function ()
            {
                this.follower.t = 0;
                this.hp = Math.floor(Math.random()* 1001);
                
                path.getPoint(this.follower.t, this.follower.vec);
                
                this.setPosition(this.follower.vec.x, this.follower.vec.y);            
            },
            receiveDamage: function(damage) {
                this.hp -= damage;           
                
                // if hp drops below 0 we deactivate this enemy
                if(this.hp <= 0) {
                    this.setActive(false);
                    this.setVisible(false);      
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
    
            Extends: Phaser.GameObjects.Image,
    
            initialize:
    
            function Turret (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'turret');
                this.nextTic = 0;
            },
            place: function(i, j) {            
                this.y = i * 64 + 64/2;
                this.x = j * 64 + 64/2;
                map[i][j] = 1;            
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
    
            Extends: Phaser.GameObjects.Image,
    
            initialize:
    
            function Bullet (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
    
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
        let graphics = this.add.graphics();    
        drawLines(graphics);
        path = this.add.path(96, -32);
        path.lineTo(96, 164);
        path.lineTo(480, 164);
        path.lineTo(480, 544);
        
        graphics.lineStyle(2, 0xffffff, 1);
        path.draw(graphics);
        
        enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        
        turrets = this.add.group({ classType: Turret, runChildUpdate: true });
        
        bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        
        this.nextEnemy = 0;
        
        this.physics.add.overlap(enemies, bullets, damageEnemy);
        
        this.input.on('pointerdown', placeTurret);
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
            graphics.lineTo(640, i * 64);
        }
        for(let j = 0; j < 10; j++) {
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
        }
    }
    
};
