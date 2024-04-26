import { config } from "../main";

export class LoadingBar {
  private scene: Phaser.Scene;
  private progressBox?: Phaser.GameObjects.Graphics;
  private progressBar?: Phaser.GameObjects.Graphics;
  private style = {
    boxColor: 0xD3D3D3,
    barColor: 0xFFF8DC,
    x: Number(config.width) / 2 - 500,
    y: Number(config.height) / 2 + 250,
    width: 900,
    height: 25,
  }

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.progressBox = this.scene.add.graphics()
    this.progressBar = this.scene.add.graphics()
    this.showProgressBox();
    this.setEvents();

  }

  setEvents() {
    this.scene.load.on('progress', this.showProgressBar, this);
    this.scene.load.on('complete', this.onLoadComplete, this);
  }

  showProgressBox() {
    this.progressBox?.fillStyle(this.style.boxColor)
    this.progressBox?.fillRect(this.style.x, this.style.y, this.style.width, this.style.height)
  }

  onLoadComplete() {
    this.progressBar?.destroy();
    this.progressBox?.destroy();
  }

  showProgressBar(value: number) {
    this.progressBar?.clear();
    this.progressBar?.fillStyle(this.style.barColor);
    this.progressBar?.fillRect(this.style.x, this.style.y, this.style.width * value, this.style.height);
  }
}