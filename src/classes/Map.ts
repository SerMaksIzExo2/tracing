import { Checkpoint } from "../interfaces";

const GRASS_FRICITON = 0.3;
const ROADS_FRICITON: { [key: string]: number } = {
  road: 1,
  ground: 0.5,
  sand: 0.4,
};

export default class Map {
  scene: Phaser.Scene;
  tilemap: Phaser.Tilemaps.Tilemap;
  tileset: Phaser.Tilemaps.Tileset | null;
  checkpoints: Checkpoint[] = [];
  oils: Phaser.Physics.Matter.Sprite[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.init();
    this.create();
  }

  init() {
    this.tilemap = this.scene.make.tilemap({ key: 'tilemap' })
    this.tileset = this.tilemap.addTilesetImage('tileset', 'tileset', 64, 64, 0, 1);
  }

  create() {
    this.createLayers();
    this.createCollision();
    this.createCheckpoints();
    this.createOils();
  }

  createCheckpoints() {
    const checkpointObjects = this.tilemap.getObjectLayer('checkpoints');

    if (checkpointObjects && checkpointObjects.objects) {
      checkpointObjects.objects.forEach(checkpoint => {
        const { x, y, width, height, properties } = checkpoint;
        const rectangle = new Phaser.Geom.Rectangle(x, y, width, height);

        if (properties && properties.length > 0) {
          const indexProperty = properties.find((property: { name: string }) => property.name === 'value');

          if (indexProperty) {
            const rectangleIndex = indexProperty.value;
            this.checkpoints.push({ rectangle, index: rectangleIndex });
          }
        }
      });
    }
  }

  createLayers() {
    if (this.tileset) {
      this.tilemap.createLayer('grass', this.tileset);
      this.tilemap.createLayer('road', this.tileset);
      this.tilemap.createLayer('sand', this.tileset);
      this.tilemap.createLayer('ground', this.tileset);
    }
  }

  createCollision() {
    const collisionObjects = this.tilemap.getObjectLayer('collisions');

    if (collisionObjects) {
      collisionObjects.objects.forEach(collision => {

        const { x, y, properties, width, height } = collision;
        const typeProperty = properties.find((property: { name: string; }) => property.name === 'type');
        const type = typeProperty?.value;

        if (type) {
          const sprite = this.scene.matter.add.sprite(Number(x) + Number(width) / 2, Number(y) - Number(height) / 2, 'objects', type);

          sprite.setStatic(true);
        }
      });
    }
  }

  createOils() {
    const oilsObjects = this.tilemap.getObjectLayer('oils');
    if (oilsObjects) {
      oilsObjects.objects.forEach(oil => {
        const { x, y, width, height } = oil;
        const sprite = this.scene.matter.add.sprite(Number(x) + Number(width) / 2, Number(y) - Number(height) / 2, 'objects', 'oil');

        sprite.setStatic(true);
        sprite.setSensor(true);

      })
    }
  }

  getPlayerPosition(positionName: string) {
    return this.tilemap.findObject(positionName, position => {
      return position.name === positionName;

    })
  }

  getTileFriction(car: Phaser.Physics.Matter.Sprite) {
    for (let road in ROADS_FRICITON) {
      let tile = this.tilemap.getTileAtWorldXY(car.x, car.y, false, this.scene.cameras.main, road);

      if (tile) {
        return ROADS_FRICITON[road];
      }
    }

    return GRASS_FRICITON;
  }


  getCheckpoint(car: Phaser.Physics.Matter.Sprite) {

    const checkpoint = this.checkpoints.find(point => point.rectangle.contains(car.x, car.y));
    return checkpoint ? parseInt(checkpoint.index) : false;
  }
}