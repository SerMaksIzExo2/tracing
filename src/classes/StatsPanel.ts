import Stats from "./Stats";

export default class StatsPanel {
  scene: Phaser.Scene;
  stats: Stats;
  lapsText: Phaser.GameObjects.Text;
  timeText: Phaser.GameObjects.Text;
  timeLapText: Phaser.GameObjects.Text;
  timeBestLapText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, stats: Stats) {
    this.scene = scene;
    this.stats = stats;
    this.create();

  }


  create() {
    const style = {
      font: '24px Arial',
      color: '#000',
    };

    this.lapsText = this.scene.add.text(10, 10, `Laps: 0/0`, style).setScrollFactor(0);
    this.timeText = this.scene.add.text(10, 50, `Time: 0`, style).setScrollFactor(0);
    this.timeLapText = this.scene.add.text(10, 90, `Lap time: 0`, style).setScrollFactor(0);
    this.timeBestLapText = this.scene.add.text(10, 130, `Best lap: 0`, style).setScrollFactor(0);
  }

  render() {
    this.lapsText.setText(`Laps: ${this.stats.lap} / ${this.stats.laps}`);
    this.timeText.setText(`Time: ${this.stats.time.toFixed(2)} `);
    this.timeLapText.setText(`Lap time: ${this.stats.timeLap.toFixed(2)} `);
    this.timeBestLapText.setText(`Best lap: ${this.stats.timeBestLap.toFixed(2)}`);
  }

}