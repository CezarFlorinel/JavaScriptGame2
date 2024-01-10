import Phaser from 'phaser';
import GameScene from './GameScene.js';

const sizes = {width:704, height:480}


const config = {
    type: Phaser.CANVAS,
    width: sizes.width,
    height: sizes.height,
    backgroundColor: '#ff5c5c',
    canvas: document.getElementById('gameCanvas'),
    scene: [GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }

}

const game = new Phaser.Game(config)