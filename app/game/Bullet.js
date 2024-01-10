export default class Bullet {
    constructor(scene) {
        this.scene = scene;
        this.bullet = null;
        this.speed = 500;
        this.damage = 1;
    }

    spawn(x, y) {
        this.bullet = this.scene.physics.add.sprite(x, y, 'bullet');
        if (this.bullet) {
            this.bullet.setCollideWorldBounds(true);
            this.bullet.setImmovable(true);
            this.bullet.body.allowGravity = false;
            this.bullet.setSize(16, 16);
        }
        this.addOverlap(); 
    }

    changeDamage(damage)
    {
        this.damage = damage;
    }

    addOverlap()
    {
        //add overlap with enemies to damage them on collision
        this.scene.physics.add.overlap(
            this.bullet,
            this.scene.enemies.map(enemy => enemy.sprite), //maps an array of enemy sprites
            (bullet,enemySprite) => {
                const enemyHit = this.scene.enemies.find(enemy => enemy.sprite === enemySprite);  //finds the enemy object that matches the sprite
                if (enemyHit) {
                    this.damageEnemy(enemyHit);
                }
            }
        );
    }

    damageEnemy(enemy) {
        enemy.takeDamage(this.damage);
        this.destroy();
    }

    destroy() {
        if (this.bullet) {
            this.bullet.destroy();
        }
    }
}