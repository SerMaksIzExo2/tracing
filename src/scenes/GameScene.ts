import Phaser from 'phaser'
import Map from '../classes/Map';
import Player from '../classes/Player';
import Stats from '../classes/Stats';
import StatsPanel from '../classes/StatsPanel';
import StatsPopup from '../classes/StatsPopup';
import Client from '../classes/Client';
import { PlayerMoveData } from '../types';

const LAPS = 3;
const CARS = {
    BLUE: {
        sprite: 'car_blue_1',
        position: 'player'
    },
    RED: {
        sprite: 'car_red_1',
        position: 'enemy',
    }
}

export default class GameScene extends Phaser.Scene {
    map: Map;
    player: Player;
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    stats: Stats;
    statsPanel: StatsPanel;
    statsPopup: StatsPopup;
    client: Client;
    enemy: Player;

    constructor() {
        super('Game');
    }

    init(data: { client: Client; }) {
        if (data.client) {
            this.client = data.client
        }
        this.cursors = this.input.keyboard?.createCursorKeys()
    }

    preload() {
        this.add.sprite(0, 0, 'background').setOrigin(0);
    }

    create() {
        this.map = new Map(this);

        const car = this.getCarsConfig();

        this.player = new Player(this, this.map, car.player, this.cursors);

        if (this.client) {
            this.enemy = new Player(this, this.map, car.enemy, this.cursors);
            this.client.on('data', (data: PlayerMoveData) => {
                this.enemy.car.setX(data.x);
                this.enemy.car.setY(data.y);
                this.enemy.car.setAngle(data.angle);
            })
        }

        this.stats = new Stats(this, LAPS);
        this.statsPanel = new StatsPanel(this, this.stats);

        this.cameras.main.setBounds(0, 0, this.map.tilemap.widthInPixels, this.map.tilemap.heightInPixels);
        this.cameras.main.startFollow(this.player.car);

        this.player.car.on('lap', this.onLapComplete, this);

        this.matter.world.on('collisionactive', (_event: any, a: { gameObject: { frame: { name: string; }; }; }, b: { gameObject: Phaser.Physics.Matter.Sprite; }) => {

            if (b.gameObject === this.player.car && a.gameObject.frame.name === 'oil') {
                this.player.slide();
            }

        })
    }

    update(_time: number, dt: number) {
        this.stats.update(dt);
        this.statsPanel.render();
        this.player.move();
        this.sync();
    }

    getCarsConfig() {
        let config = { player: CARS.BLUE, enemy: CARS.RED }
        if (this.client && !this.client.master) {
            config = { player: CARS.RED, enemy: CARS.BLUE }
        }
        return config;
    }

    onLapComplete() {
        this.stats.onLapComplete();

        if (this.stats.complete) {
            this.statsPopup = new StatsPopup(this, this.stats);

        }
    }

    sync() {
        if (this.client) {
            const playerMoveData: PlayerMoveData = {
                x: this.player.car.x,
                y: this.player.car.y,
                angle: this.player.car.angle,
            };
            this.client.send(playerMoveData);
        }
    }

}
