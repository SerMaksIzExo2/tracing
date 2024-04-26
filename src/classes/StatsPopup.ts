import Stats from "./Stats";

export default class StatsPopup {
  scene: Phaser.Scene;
  stats: Stats;
  timeText: Phaser.GameObjects.Text;
  timeBestLapText: Phaser.GameObjects.Text;
  popup: Phaser.GameObjects.Graphics;
  title: Phaser.GameObjects.Text;
  text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, stats: Stats) {
    this.scene = scene;
    this.stats = stats;
    this.create();

  }


  create() {
    const style = {
      font: '30px Arial',
      color: '#fff',
    }
    const styleTitle = {
      font: '46px Arial', color: '#FAFAD2',
    }
    const popupWidth = 800;
    const popupHeight = 600;


    this.popup = this.scene.add.graphics()
      .setScrollFactor(0)
      .fillStyle(0x000000, 0.5)
      .fillRoundedRect((Number(this.scene.sys.game.config.width) - popupWidth) / 2, (Number(this.scene.sys.game.config.height) - popupHeight) / 2, popupWidth, popupHeight);

    this.title = this.scene.add.text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY - 200, 'Level Complete!', styleTitle).setOrigin(0.5).setScrollFactor(0);

    this.timeText = this.scene.add.text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY - 50, `Time Total: ${this.stats.time.toFixed(2)}`, style).setOrigin(0.5).setScrollFactor(0);
    this.timeBestLapText = this.scene.add.text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY + 50, `Best Lap: ${this.stats.timeBestLap.toFixed(2)}`, style).setOrigin(0.5).setScrollFactor(0);

    this.text = this.scene.add.text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY + 200, 'Tap To Continue!', style).setOrigin(0.5).setScrollFactor(0);

    this.scene.input.once('pointerdown', () => {
      this.scene.scene.start('Game');
    })
  };

};
