import Phaser from 'phaser'
import background from '../../public/assets/bg.png'

export default class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('background', background);
    }

    create() {
        this.scene.start('Preloader');
    }
}
