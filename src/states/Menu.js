/* globals __DEV__ */
import Phaser from 'phaser'
import Door from '../sprites/Door'

export default class extends Phaser.State {
  init() {

  }

  preload() {

  }

  create() {
    game.stage.backgroundColor = '#182d3b';
    let button = game.add.button(game.world.centerX - 95, 400, 'startButton', null, this, 1, 2, 0);

    button.onInputUp.add(this.up, this);
  }

  up() {
    this.startLevel('Level1')
  }

  startLevel(stateName) {
    this.state.start(stateName)
  }

  render() {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.door, 35, 67)
    }
  }
}
