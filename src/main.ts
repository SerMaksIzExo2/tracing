import Boot from './scenes/Boot';

import Preloader from './scenes/Preloader';
import GameScene from './scenes/GameScene';
import StartScene from './scenes/StartScene';

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'matter',
        matter: {
            debug: false,
            gravity: { x: 0, y: 0 }
        }
    },
    scene: [
        Boot,
        Preloader,
        StartScene,
        GameScene,
    ]
};

export default new Phaser.Game(config);
