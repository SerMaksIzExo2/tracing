import Client from "../classes/Client";

export default class StartScene extends Phaser.Scene {
  button1: Phaser.GameObjects.Text;
  button2: Phaser.GameObjects.Text;
  client: Client;

  constructor() {
    super('Start')
  }

  create() {
    this.createBackground()
    this.createButtons();
    this.setEvents();
  }

  createBackground() {
    this.add.sprite(0, 0, 'background').setOrigin(0, 0);
  }

  createButtons() {
    this.button1 = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'ONE PLAYER',
      { font: 'bold 46px Arial', color: '#FAFAD2' })
      .setOrigin(0.5)
      .setInteractive();

    this.button2 = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'TWO PLAYERS',
      { font: 'bold 46px Arial', color: '#FAFAD2' })
      .setOrigin(0.5)
      .setInteractive();
  }

  setEvents() {
    this.button1.on('pointerdown', () => {
      this.startGame();
    })

    this.button2.on('pointerdown', () => {
      this.requestGame();
    })
  }

  startGame() {
    this.scene.start('Game', { client: this.client });
  }

  requestGame() {
    this.client = new Client();
    const socket = this.client.init(); // Вызываем метод init только после нажатия на кнопку "TWO PLAYERS"
    socket.on('game', () => {
      this.startGame();
    });
  }
}