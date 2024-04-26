import Phaser from 'phaser'
import { LoadingBar } from '../classes/LoadingBar'
import tilesetPng from '../../public/assets/tileset.png'
import tilemapJson from '../../public/assets/tilemap.json'
import objectsPng from '../../public/assets/objects.png'
import objectsJson from '../../public/assets/objects.json'


export default class Preloader extends Phaser.Scene {
    loadingBar: LoadingBar;
    constructor() {
        super('Preloader');
    }

    init() {

    }

    preload() {
        this.add.sprite(0, 0, 'background').setOrigin(0);

        this.loadingBar = new LoadingBar(this)

        this.load.spritesheet('tileset', tilesetPng, { frameWidth: 64, frameHeight: 64 });
        this.load.tilemapTiledJSON('tilemap', tilemapJson);
        this.load.atlas('objects', objectsPng, objectsJson);
    }

    create() {
        this.scene.start('Start');
    }
}
