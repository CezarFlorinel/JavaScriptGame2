
export default class Player {
    constructor(scene) {
        this.scene = scene;
        this.player = null;
        this.speed = 2;
        this.health = 3;
        this.invincible = false;
        this.invincibleTimer = 3;
        this.flashInterval = null;
        this.flashDuration = 200;
        this.directionCounter = 0;
        this.speedBoostTimer = 5;
    }

    spawn(x, y) {
        this.player = this.scene.physics.add.sprite(x, y, 'player').setOrigin(0, 0);
        if (this.player) {
            this.player.setCollideWorldBounds(true);
            this.player.setImmovable(true);
            this.player.body.allowGravity = false;
            this.player.setSize(32, 32);
            this.createAnimations();
        }
    }

    increaseHealth() {
        if (this.health < 3){
        this.health++;
        this.scene.changeHeartsImage();
        }
    }

    increaseSpeed() {
        const originalSpeed = 2; // default speed
        this.scene.speedBoosterImage.setAlpha(1);
        this.speed *= 2; // double the speed 
        // start timer 
        this.scene.time.addEvent({
            delay: this.speedBoostTimer * 1000, // convert seconds to milliseconds
            callback: () => {
                this.speed = originalSpeed;
                this.scene.speedBoosterImage.setAlpha(0.5);
            },
            callbackScope: this
        });
    }

    activateShield() {
        this.startInvincibilityTimer();
        this.scene.shieldBoosterImage.setAlpha(1);
    }

    takeDamage(damage) {
        if (this.invincible) {
            return;
        }
        else {
            this.health -= damage;
            this.scene.sound.play('playerDamage');
            if (this.health <= 0) {
                // this.player.destroy(); maybe not destroy but diplay the end game 
                this.scene.sound.play('playerDeath');
            }
            this.startInvincibilityTimer();
            this.startFlashingAnimation();
        }
    }

    startInvincibilityTimer() {
        this.invincible = true;

        // decrement the timer every frame
        this.scene.time.addEvent({
            delay: this.invincibleTimer * 1000,
            callback: () => {
                this.invincible = false;
                this.stopFlashingAnimation();
                this.scene.shieldBoosterImage.setAlpha(0.5);
            },
            callbackScope: this
        });
    }

    startFlashingAnimation() {
        this.flashInterval = this.scene.time.addEvent({
            delay: this.flashDuration,
            loop: true,
            callback: () => {
                this.player.visible = !this.player.visible; // toggle visibility
            },
            callbackScope: this
        });
    }

    stopFlashingAnimation() {
        if (this.flashInterval) {
            this.flashInterval.destroy();
            this.flashInterval = null;
            this.player.visible = true; 
            this.flashDuration = 200; 
        }
    }

    keyboardMovement(cursors) { //moves the player and plays the animation
        const { left, right, up, down } = cursors;

        if (left.isDown) {
            this.directionCounter = 1;
            this.player.x -= this.speed;
            this.player.anims.play('left', true);

        } else if (right.isDown) {
            this.directionCounter = 2;
            this.player.x += this.speed;
            this.player.anims.play('right', true);

        } else if (up.isDown) {
            this.directionCounter = 3;
            this.player.y -= this.speed;
            this.player.anims.play('up', true);

        } else if (down.isDown) {
            this.directionCounter = 4;
            this.player.y += this.speed;
            this.player.anims.play('down', true);

        } else {
            if (this.player.anims) {
                this.player.anims.stop();
            }
            this.setIdleFrameForPlayer(this.directionCounter);
        }
    }

    createAnimations() {
        this.scene.anims.create({
            key: 'up',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'down',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    }

    setIdleFrameForPlayer(directionCounter) {
        // Check the direction and set the frame accordingly
        switch (directionCounter) {
            case 1:
                this.player.setFrame(12);
                break;
            case 2:
                this.player.setFrame(8);
                break;
            case 3:
                this.player.setFrame(4);
                break;
            case 4:
                this.player.setFrame(0);
                break;
            default:
                this.player.setFrame(0);
                break;
        }
    }
}