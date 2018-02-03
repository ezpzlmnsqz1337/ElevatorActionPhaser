import Phaser from 'phaser'

export default class Bullet extends Phaser.Sprite {
  constructor({ game, x, y, direction }) {
    super(game, x, y, 'bullet')
    this.anchor.setTo(0.5)
    this.speed = 300
    this.platforms = game.state.getCurrentState().platforms
    this.enemies = game.state.getCurrentState().enemies

    game.physics.arcade.enable(this)
    this.body.immovable = true

    if (direction === 'left') {
      this.body.velocity.x = -this.speed
    } else {
      this.body.velocity.x = this.speed
    }
    game.add.existing(this)
  }

  update() {
    game.physics.arcade.overlap(this, this.platforms, this.remove, null, this)
    for (let i = 0; i < this.enemies.length; i++) {
      let enemy = this.enemies[i];
      if (!enemy.isDead) {
        game.physics.arcade.overlap(this, enemy, this.removeEnemy, null, this)
      }
    }
  }

  removeEnemy(bullet, enemy) {
    bullet.kill()
    enemy.die()
  }

  remove(bullet, platforms) {
    bullet.kill()
  }
}
