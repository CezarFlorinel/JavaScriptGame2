export default class Enemy{
    constructor(scene, type, health, score,speed) {
        this.scene = scene;
        this.type = type;
        this.health = health;
        this.score = score;
        this.sprite = null;
        this.speed = speed;
    }


    spawn(x, y) {
        this.sprite = this.scene.physics.add.sprite(x, y, this.type);
        if (this.sprite) {
            this.sprite.setCollideWorldBounds(true);
            this.sprite.setImmovable(true);
            this.sprite.body.allowGravity = false;
            this.sprite.setSize(32,32);
            this.createAnimations();
            
        }
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.destroy();
            this.scene.playSoundEffect(0.2,'slimeDeath');
            this.resetHealth();
            if (this.scene.checkScoreBoosterActivation())
            {
                this.scene.updateScore(this.score * 2);
            }
            else 
            {
                this.scene.updateScore(this.score);
            }
        }
    }

    resetHealth()
    { // reset health because the enemy will respawn and 
    //the new enemies that are created are clones from the array of enemies from the scene
        if (this.type == "slimeType1")
        {
            this.health = 1;
        }
        else if (this.type == "slimeType2")
        {
            this.health = 2;
        }
        else if (this.type == "slimeType3")
        {
            this.health = 3;
        }
        else 
        {
            this.health = 1;
        }
    }

    destroy() {
        
        if (this.type == "slimeType1")
        {
            this.scene.createParticles(this.sprite.x, this.sprite.y,'slimeGreen');
        }
        else if (this.type == "slimeType2")
        {
            this.scene.createParticles(this.sprite.x, this.sprite.y,'slimeBlue');
        }
        else if (this.type == "slimeType3")
        {
            this.scene.createParticles(this.sprite.x, this.sprite.y,'slimeRed');
        }
        else 
        {
            this.scene.createParticles(this.sprite.x, this.sprite.y,'slimeGreen');
        }
     

        this.sprite.destroy();
    }

    getSpeed()
    {
        return this.speed;
    }

    createAnimations() {
        const { scene, type } = this;
    
        if (!scene.anims.exists(type + 'WalkUp')) {
            scene.anims.create({
                key: type + 'WalkUp',
                frames: scene.anims.generateFrameNumbers(type, { start: 4, end: 7 }),
                frameRate: 10,
                repeat: -1,
            });
        }
    
        if (!scene.anims.exists(type + 'WalkDown')) {
            scene.anims.create({
                key: type + 'WalkDown',
                frames: scene.anims.generateFrameNumbers(type, { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1,
            });
        }
    
        if (!scene.anims.exists(type + 'WalkLeft')) {
            scene.anims.create({
                key: type + 'WalkLeft',
                frames: scene.anims.generateFrameNumbers(type, { start: 12, end: 15 }),
                frameRate: 10,
                repeat: -1,
            });
        }
    
        if (!scene.anims.exists(type + 'WalkRight')) {
            scene.anims.create({
                key: type + 'WalkRight',
                frames: scene.anims.generateFrameNumbers(type, { start: 8, end: 11 }),
                frameRate: 10,
                repeat: -1,
            });
        }
    }

    playMovementAnimation(directionX, directionY) {
        if (this.sprite) {
            const type = this.type;
            if (Math.abs(directionX) > Math.abs(directionY)) {
                // move along the X axis
                if (directionX > 0) {
                    this.sprite.anims.play(type + 'WalkRight', true);
                } else {
                    this.sprite.anims.play(type + 'WalkLeft', true);
                }
            } else {
                // move along the Y axis
                if (directionY > 0) {
                    this.sprite.anims.play(type + 'WalkDown', true);
                } else {
                    this.sprite.anims.play(type + 'WalkUp', true);
                }
            }
        }
    }
    
}