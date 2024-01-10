import Phaser from 'phaser';
import Enemy from './Enemy';
import Player from './Player';
import Bullet from './Bullet';
import Collectable from './Collectable';


export default class GameScene extends Phaser.Scene {

    constructor() {
        super("GameScene");
        this.player = null;
        this.cursors = null;
        this.playerHearts = null;
        this.score = 0;
        this.scoreText = null;
        this.emitter = null;
        this.damageBooster = false;
        this.damageBoosterTimer = 5;
        this.increaserOfScore = false;
        this.shieldBoosterImage = null;
        this.damageBoosterImage = null;
        this.scoreBoosterImage = null;
        this.speedBoosterImage = null;
    }

    preload() {
        this.load.image('background', 'public/assets/background/background1.png')
        //player
        this.load.spritesheet('player', 'public/assets/player/Soldier SpriteSheet.png', { frameWidth: 32, frameHeight: 32 })
        //enemies
        this.load.spritesheet('slimeType1', 'public/assets/enemies/slimeType1.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('slimeType2', 'public/assets/enemies/slimeType2.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('slimeType3', 'public/assets/enemies/slimeType3.png', { frameWidth: 32, frameHeight: 32 })
        //hearts
        this.load.image('heartsFull', 'public/assets/Hearts/full hearts.png')
        this.load.image('heartsEmpty', 'public/assets/Hearts/0 hearts.png')
        this.load.image('heartsTwo', 'public/assets/Hearts/2 hearts.png')
        this.load.image('heartsOne', 'public/assets/Hearts/1 hearts.png')
        //bullet
        this.load.image('bullet', 'public/assets/Misc/Bulet.png')
        //slime particles
        this.load.image('slimeGreen', 'public/assets/Misc/slimeusParticle.png')
        this.load.image('slimeRed', 'public/assets/Misc/slimeusParticlered.png')
        this.load.image('slimeBlue', 'public/assets/Misc/slimeusParticleredBlue.png')
        //collectables
        this.load.image('damageBooster','public/assets/collectables/DamageBooster.png')
        this.load.image('heart', 'public/assets/Hearts/heart.png')
        this.load.image('speedBooster', 'public/assets/collectables/Speed Boost.png')
        this.load.image('scoreBooster', 'public/assets/collectables/X2score.png')
        this.load.image('dragonFruit', 'public/assets/collectables/Dragon Fruit.png')
        this.load.image('goldenApple', 'public/assets/collectables/Golden Apple.png')
        this.load.image('jam', 'public/assets/collectables/Jam.png')
        this.load.image('mici', 'public/assets/collectables/Mici.png')
        this.load.image('pumpkin', 'public/assets/collectables/pumpkin.png')
        this.load.image('shield', 'public/assets/collectables/Shield.png')
        this.load.image('tomato', 'public/assets/collectables/Tomato.png')
        this.load.image('turkeyLeg', 'public/assets/collectables/Turkey part idk.png')
        //music
        this.load.audio('musicBackgoundInGame', 'public/assets/Music/background in game music.mp3')
        this.load.audio('musicStartMenu', 'public/assets/Music/start game music.mp3')
        this.load.audio('musicEndMenu', 'public/assets/Music/end game music.mp3')
        //sound effects
        this.load.audio('slimeDeath', 'public/assets/Sounds/slime sound effect.mp3')
        this.load.audio('playerDeath', 'public/assets/Sounds/soldier scream effect.mp3')
        this.load.audio('bulletSound', 'public/assets/Sounds/shoot effect.mp3')
        this.load.audio('collectableSoundBooster', 'public/assets/Sounds/item collect effect.mp3')
        this.load.audio('collectableSoundFood', 'public/assets/Sounds/food effect.mp3')
        this.load.audio('playerDamage', 'public/assets/Sounds/tomp3.cc - Roblox Death Sound  OOF  Sound Effect HD  HomeMadeSoundEffects_256kbps.mp3')
    }

    create() {
        // add backgound
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.physics.world.setBounds(32, 32, 640, 416);  // 640 = usable width , 416 = usable height for player

        // add player
        this.player = new Player(this);
        this.player.spawn(250, 250);

        // add music
        this.playMusicLoop();

        // add hearts image
        this.playerHearts = this.add.image(32, 32, 'heartsFull').setOrigin(0, 0);

        this.boosterImagesCreation();

        // add score
        this.createScore();
        
        this.cursors = this.input.keyboard.createCursorKeys()

        this.enemiesArrayCreation();

        this.collectablesArrayCreation();
       
    }

    update() {
        this.player.keyboardMovement(this.cursors);
        this.moveEnemies();   

        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.fireBullet();
        }
    }


    // ----------------------------- Methods ----------------------------

    playMusicLoop() {
        this.music = this.sound.add('musicBackgoundInGame'); 
    
        // Play the music in a loop
        this.music.play({
            loop: true,
            volume: 0.5
        });
    }

    enemiesArrayCreation()
    {
        // add enemies
        this.enemies = [];
        this.enemies.push(new Enemy(this, 'slimeType1', 1, 10, 0.2));  // s 0.8
        this.enemies.push(new Enemy(this, 'slimeType2', 2, 20, 0.2));    // s 1
        this.enemies.push(new Enemy(this, 'slimeType3', 3, 30, 0.2));  // s 1.2
        this.spawnEnemiesAtInterval();  // creates them ones in the array, and then spawns copies at interval
    }

    collectablesArrayCreation()
    {
         // add collectables
         this.collectables = [];
         this.collectables.push(new Collectable(this, 'heart'));  // chance: 4%
         this.collectables.push(new Collectable(this, 'speedBooster')); // chance: 6%
         this.collectables.push(new Collectable(this, 'damageBooster')); // chance: 6%
         this.collectables.push(new Collectable(this, 'scoreBooster')); // chance: 9%
         this.collectables.push(new Collectable(this, 'shield')); // chance: 4%
         this.collectables.push(new Collectable(this, 'dragonFruit')); // chance: 8%
         this.collectables.push(new Collectable(this, 'goldenApple')); // chance: 10%
         this.collectables.push(new Collectable(this, 'jam')); // chance: 12%
         this.collectables.push(new Collectable(this, 'mici')); // chance: 5%
         this.collectables.push(new Collectable(this, 'pumpkin')); // chance: 13%
         this.collectables.push(new Collectable(this, 'tomato')); // chance: 16%
         this.collectables.push(new Collectable(this, 'turkeyLeg')); // chance: 7%
         this.spawnCollectablesAtInterval();
 
    }

    boosterImagesCreation()
    {
        this.shieldBoosterImage = this.add.image(32, 64, 'shield').setOrigin(0, 0);
        this.shieldBoosterImage.setAlpha(0.5);
        this.damageBoosterImage = this.add.image(32, 96, 'damageBooster').setOrigin(0, 0);
        this.damageBoosterImage.setAlpha(0.5);
        this.scoreBoosterImage = this.add.image(32, 128, 'scoreBooster').setOrigin(0, 0);
        this.scoreBoosterImage.setAlpha(0.5);
        this.speedBoosterImage = this.add.image(32, 160, 'speedBooster').setOrigin(0, 0);
        this.speedBoosterImage.setAlpha(0.5);
    }

    createParticles(x,y,typeOfSlime) {
        this.emitter = this.add.particles(x,y,`${typeOfSlime}`,
        {
            speed: 25,
            gravityY: 0,
            scale: 1,
            duration: 300,
            emitting: true
        });
    }

    createScore()
    {
        const textStyle = {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
        };
        this.scoreText = this.add.text(32, 5, 'Score: 0', textStyle);
    }

    updateScore(points) { // add points to the score
        this.score += points; 
        this.scoreText.setText(`Score: ${this.score}`); 
    }

    createCollectable() {
        const randomNumber = Phaser.Math.Between(0, 100);
        let spawnX = Phaser.Math.Between(32, 640);
        let spawnY = Phaser.Math.Between(32, 416);
    
        let collectableType = null;

        if (randomNumber <= 4) {
            collectableType = 'heart'; // 4% chance
        } else if (randomNumber <= 10) {
            collectableType = 'speedBooster'; // 6% chance
        } else if (randomNumber <= 16) {
            collectableType = 'damageBooster'; // 6% chance
        } else if (randomNumber <= 25) {
            collectableType = 'scoreBooster'; // 9% chance
        } else if (randomNumber <= 29) {
            collectableType = 'shield'; // 4% chance
        } else if (randomNumber <= 37) {
            collectableType = 'dragonFruit'; // 8% chance
        } else if (randomNumber <= 41) {
            collectableType = 'goldenApple'; // 10% chance
        } else if (randomNumber <= 53) {
            collectableType = 'jam'; // 12% chance
        } else if (randomNumber <= 58) {
            collectableType = 'mici'; // 5% chance
        } else if (randomNumber <= 71) {
            collectableType = 'pumpkin'; // 13% chance
        } else if (randomNumber <= 87) {
            collectableType = 'tomato'; // 16% chance
        } else if (randomNumber <= 100) {
            collectableType = 'turkeyLeg'; // 7% chance
        }
    
        if (collectableType) {
            const collectable = new Collectable(this, collectableType);
            collectable.spawn(spawnX, spawnY, collectableType);
        }
    }
    
    spawnCollectablesAtInterval() {
        this.time.addEvent({
            delay: 5000, // 5 seconds
            loop: true,
            callback: this.createCollectable,
            callbackScope: this
        });
    }

    checkScoreBoosterActivation()
    {
        return this.increaserOfScore;
    }

    scoreBoosterIncreaser() {
        this.increaserOfScore = true;
        this.scoreBoosterImage.setAlpha(1);
        // timer
        this.time.addEvent({
            delay: this.damageBoosterTimer * 1000, 
            callback: () => {
                this.increaserOfScore = false;
                this.scoreBoosterImage.setAlpha(0.5);
            },
            callbackScope: this 
        });
    }
    
    damageBoosterIncreaser() {
        this.damageBooster = true;
        this.damageBoosterImage.setAlpha(1);
        // timer
        this.time.addEvent({
            delay: this.damageBoosterTimer * 1000, 
            callback: () => {
                this.damageBooster = false;
                this.damageBoosterImage.setAlpha(0.5);
            },
            callbackScope: this
        });
    }

    playSoundEffect(volume, soundEffectKey)
    {
        const sound = this.sound.add(`${soundEffectKey}`);
    
        sound.setVolume(volume);
        
        sound.play();
    }

    fireBullet() {
        const bullet = new Bullet(this);
        this.playSoundEffect(0.07,'bulletSound');


        if (this.damageBooster) {
            bullet.changeDamage(5);
        }
        else if (this.damageBooster == false) {
            bullet.changeDamage(1);
        }

        // calculate the bullet's initial position based on the player's position
        const offsetX = 20;
        const offsetY = 20;
        const x = this.player.player.x + offsetX;
        const y = this.player.player.y + offsetY;

        bullet.spawn(x, y);

        // determine the direction based on the player's current animation or facing direction
        let directionX = 0;
        let directionY = 0;

        if (this.cursors.left.isDown) {
            directionX = -1;
            this.player.directionCounter = 1;
        } else if (this.cursors.right.isDown) {
            directionX = 1;
            this.player.directionCounter = 2;
        } else if (this.cursors.up.isDown) {
            directionY = -1;
            this.player.directionCounter = 3;
        } else if (this.cursors.down.isDown) {
            directionY = 1;
            this.player.directionCounter = 4;
        } else {
            switch (this.player.directionCounter) {
                case 1:
                    directionX = -1;
                    break;
                case 2:
                    directionX = 1;
                    break;
                case 3:
                    directionY = -1;
                    break;
                case 4:
                    directionY = 1;
                    break;
                default:
                    break;
            }
        }

        // normalize the direction vector
        const length = Math.sqrt(directionX * directionX + directionY * directionY);
        const velocityX = (directionX / length) * bullet.speed;
        const velocityY = (directionY / length) * bullet.speed;

        bullet.bullet.setVelocity(velocityX, velocityY);

        // destroy the bullet when it hits the wall
        bullet.bullet.setCollideWorldBounds(true);
        bullet.bullet.onWorldBounds = true;

        bullet.bullet.body.onWorldBounds = true;
        bullet.bullet.body.world.on('worldbounds', (body) => {
            if (body.gameObject === bullet.bullet) {
                bullet.bullet.destroy();
            }
        });
    }

    handleCollision(player, enemy) {
        player.takeDamage(1);
        enemy.destroy();
        this.changeHeartsImage(); 
    }

    changeHeartsImage()
    {
        if (this.player.health === 3) {
            this.playerHearts = this.add.image(32, 32, 'heartsFull').setOrigin(0, 0)
        }
        else if (this.player.health === 2) {
            this.playerHearts = this.add.image(32, 32, 'heartsTwo').setOrigin(0, 0)
        }
        else if (this.player.health === 1) {
            this.playerHearts = this.add.image(32, 32, 'heartsOne').setOrigin(0, 0)
        }
        else if (this.player.health === 0) {
            this.playerHearts = this.add.image(32, 32, 'heartsEmpty').setOrigin(0, 0)
        }
    }

    moveEnemies() {
        this.enemies.forEach(enemy => {
            if (enemy.sprite && enemy.sprite.active) {
                const directionX = this.player.player.x - enemy.sprite.x;
                const directionY = this.player.player.y - enemy.sprite.y;

                // Determine the axis with the greater distance
                if (Math.abs(directionX) > Math.abs(directionY)) {
                    // Move along the X axis
                    enemy.sprite.x += (directionX > 0 ? 1 : -1) * enemy.getSpeed();
                } else {
                    // Move along the Y axis
                    enemy.sprite.y += (directionY > 0 ? 1 : -1) * enemy.getSpeed();
                }

                enemy.playMovementAnimation(directionX, directionY);
            }
        });


    }

    spawnEnemiesAtInterval() {
        this.time.addEvent({
            delay: 3000,
            loop: true,
            callback: () => {
                const enemy = Phaser.Math.RND.pick(this.enemies);

                // Determine whether to spawn along X or Y axis
                const spawnOnXAxis = Phaser.Math.Between(0, 1) === 0;

                let x, y;
                if (spawnOnXAxis) {
                    x = Phaser.Math.Between(0, 1) === 0 ? 0 : 640; // Spawn at left or right edge
                    y = Phaser.Math.Between(0, 416);
                } else {
                    x = Phaser.Math.Between(0, 640);
                    y = Phaser.Math.Between(0, 1) === 0 ? 0 : 416; // Spawn at top or bottom edge
                }

                const newEnemy = new Enemy(this, enemy.type, enemy.health, enemy.score, enemy.speed);
                newEnemy.spawn(x, y);
                this.physics.add.overlap(this.player.player, newEnemy.sprite, () => this.handleCollision(this.player, newEnemy), null, this);
                this.enemies.push(newEnemy);

            },
            callbackScope: this
        });

    }






}
