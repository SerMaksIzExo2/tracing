export default class Stats {
  laps: number;
  scene: Phaser.Scene;
  time = 0;
  timeLap = 0;
  lap = 1;
  timeBestLap = 0;
  timeLastLap = 0;

  constructor(scene: Phaser.Scene, laps: number) {
    this.scene = scene;
    this.laps = laps;
  }

  get complete() {
    return this.lap > this.laps;
  }

  onLapComplete() {
    this.lap += 1;

    if (this.timeBestLap === 0 || this.timeLap < this.timeBestLap) {
      this.timeBestLap = this.timeLap;
    }

    this.timeLastLap = this.timeLap;
    this.timeLap = 0;
  }

  update(dt: number) {
    if (!this.complete) {
      const time = dt / 1000;
      this.time += time;
      this.timeLap += time;

    }
  }

}