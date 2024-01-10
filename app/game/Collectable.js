export default class Collectable {
    constructor(scene, type) {
        this.scene = scene;
        this.collectable = null;
        this.type = type;
        this.scoreValue = 0;
        this.despawnTimer = 10;
        this.flashDuration = 200;
        this.flashInterval = null;
        this.timer = null;
    }

    spawn(x, y, type) {
        this.collectable = this.scene.physics.add.sprite(x, y, `${type}`);
        if (this.collectable) {
            this.collectable.setCollideWorldBounds(true);
            this.collectable.setImmovable(true);
            this.collectable.body.allowGravity = false;
            this.collectable.setSize(16, 16);
        }
        this.addOverlap(); 
        this.despawnItems();
        this.startTimer();
    }

    startTimer() {
        let timerDuration = 7000; // 7 seconds in milliseconds

        this.timer = this.scene.time.addEvent({
            delay: timerDuration,
            callback: () => {
                this.startFlashingAnimation();    
            },
            callbackScope: this
        });
    }

    despawnItems()
    {
        this.scene.time.addEvent({
            delay: this.despawnTimer * 1000, // convert seconds to milliseconds
            callback: () => {
                this.collectable.destroy();
            },
            callbackScope: this
        });
    }

    startFlashingAnimation() {
        this.flashInterval = this.scene.time.addEvent({
            delay: this.flashDuration,
            loop: true,
            callback: () => {
                this.collectable.setVisible(!this.collectable.visible);
            },
            callbackScope: this
        });
     }

    addOverlap()
    {
        //add overlap with player to collectable item
        this.scene.physics.add.overlap(
            this.collectable,
            this.scene.player.player,
            (collectable,player) => {
                this.collect();
            }
        );
    }

    collect()
    {
        this.determineBoostAndApply();
        this.collectable.destroy();
    }

    determineBoostAndApply()
    {
        switch(this.type)
        {
            case 'heart':
                this.scene.player.increaseHealth();
                this.scene.sound.play('collectableSoundBooster');
                break;
            case 'speedBooster':
                this.scene.player.increaseSpeed();
                this.scene.sound.play('collectableSoundBooster');
                break;
            case 'damageBooster':
                this.scene.damageBoosterIncreaser();
                this.scene.sound.play('collectableSoundBooster');
                break;
            case 'scoreBooster':
                this.scene.scoreBoosterIncreaser();
                this.scene.sound.play('collectableSoundBooster');
                break;
            case 'shield':
                this.scene.player.activateShield();
                this.scene.sound.play('collectableSoundBooster');
                break;
            default:
                this.scene.playSoundEffect(0.5,'collectableSoundFood');
                this.determineScoreValueAndAdd();   // for food items
                break;
        }
    }

    determineScoreValueAndAdd()
    {
        switch (this.type) {
            case 'dragonFruit':
                this.scoreValue = 120;
                break;
            case 'goldenApple':
                this.scoreValue = 150;
                break;
            case 'jam':
                this.scoreValue = 50;
                break;
            case 'mici':
                this.scoreValue = 500;
                break;
            case 'pumpkin':
                this.scoreValue = 20;
                break;
            case 'tomato':
                this.scoreValue = 10;
                break;
            case 'turkeyLeg':
                this.scoreValue = 369;
                break;
            default:
                break;
        }
     
        if (this.scene.checkScoreBoosterActivation())
        {
            this.scoreValue *= 2;
        }

        this.scene.updateScore(this.scoreValue);
    }

    

}