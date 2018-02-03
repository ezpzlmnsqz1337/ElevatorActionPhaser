import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init() { }

  preload() {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    game.load.image('sky', '../assets/images/sky.png');
    game.load.image('building-bg', '../assets/images/building-bg.png');
    game.load.image('ground', '../assets/images/platform.png');
    game.load.image('elevator', '../assets/images/elevator.png');
    game.load.image('wall', '../assets/images/wall.png');
    game.load.spritesheet('player', '../assets/images/player.png', 19, 51);
    game.load.spritesheet('enemy', '../assets/images/enemy.png', 19, 51);
    game.load.spritesheet('door', '../assets/images/doors.png', 35, 67);
    game.load.spritesheet('bullet', '../assets/images/bullet.png', 5, 2);
    game.load.spritesheet('startButton', '../assets/images/startButton.png', 200, 80);
  }

  create() {
    //this.state.start('Menu')
    this.state.start('Level1')
  }
}
