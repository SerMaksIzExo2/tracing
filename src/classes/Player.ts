import Map from "./Map";

const DIRECTIONS = Object.freeze({ BACKWARD: -1, NONE: 0, FORWARD: 1 });
const TURNS = Object.freeze({ LEFT: -1, NONE: 0, RIGHT: 1 });
const SPEED = 10;
const ACCELERATION = 0.5;
const SLIDE_ANGLE = 5;

type Config = {
  sprite: string; position: string;
}

export default class Player {
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  scene: Phaser.Scene;
  map: Map;
  car: Phaser.Physics.Matter.Sprite;
  direction: number;
  turn: number;
  velocity = 0;
  checkpoint = 0;



  constructor(scene: Phaser.Scene, map: Map, config: Config, cursors?: Phaser.Types.Input.Keyboard.CursorKeys,) {
    this.scene = scene;
    this.map = map;

    const position = map.getPlayerPosition(config.position);
    this.car = this.scene.matter.add.sprite(Number(position?.x), Number(position?.y), 'objects', config.sprite);
    this.car.setFixedRotation();

    this.cursors = cursors;
  }


  getDirection() {
    this.direction = DIRECTIONS.NONE;

    if (this.cursors?.up.isDown) {
      this.direction = DIRECTIONS.FORWARD;
    } else if (this.cursors?.down.isDown) {
      this.direction = DIRECTIONS.BACKWARD;
    }

    return this.direction;
  }

  getTurn() {
    this.turn = TURNS.NONE;

    if (this.cursors?.left.isDown) {
      this.turn = TURNS.LEFT;
    } else if (this.cursors?.right.isDown) {
      this.turn = TURNS.RIGHT;
    }

    return this.turn;
  }

  getVelocity() {
    const speed = Math.abs(this.velocity);
    const max = this.getMaxSpeed();

    if (this.getDirection() && speed < max) {
      this.velocity += ACCELERATION * Math.sign(this.getDirection());
    } else if ((this.direction && speed > max) ||
      (!this.getDirection() && speed > 0)) {
      this.velocity -= ACCELERATION * Math.sign(this.velocity);
    }

    return this.velocity;
  }

  getAngle() {
    return this.car.angle + this.getTurn() * SPEED / 2;
  }

  getVelocityFromAngle() {
    const vec2 = new Phaser.Math.Vector2();

    return vec2.setToPolar(this.car.rotation - Math.PI / 2, this.getVelocity());
  }

  getMaxSpeed() {
    return SPEED * this.map.getTileFriction(this.car);
  }

  slide() {
    this.car.angle += SLIDE_ANGLE;
  }

  move() {
    this.car.setAngle(this.getAngle());

    const velocity = this.getVelocityFromAngle();
    this.car.setVelocity(velocity.x, velocity.y);
    this.checkPositon();
  }

  checkPositon() {
    const checkpoint = this.map.getCheckpoint(this.car);

    if (checkpoint) {
      this.onCheckpoint(checkpoint);
    }
  }

  onCheckpoint(checkpoint: number) {
    if (checkpoint === 1 && this.checkpoint === this.map.checkpoints.length) {
      this.checkpoint = 1;
      this.car.emit('lap')

    } else if (checkpoint === this.checkpoint + 1) {
      ++this.checkpoint;
    };
  }
}