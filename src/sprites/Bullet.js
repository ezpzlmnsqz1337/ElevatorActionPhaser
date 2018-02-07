import Phaser from 'phaser'

export default class Bullet extends Phaser.Sprite {
  constructor({ game, x, y, direction, shooter }) {
    super(game, x, y, 'bullet')
    this.anchor.setTo(0.5)
    this.speed = 300
    this.state = game.state.getCurrentState()
    this.shooter = shooter //used to determine who shoot the bullet

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
    let state = this.state
    //player overlap check
    game.physics.arcade.overlap(this, state.player, this.killPlayer, null, this)

    //enemies overlap check
    game.physics.arcade.overlap(this, state.platforms, this.remove, null, this)
    for (let i = 0; i < state.enemies.length; i++) {
      let enemy = state.enemies[i];
      if (!enemy.isDead) {
        game.physics.arcade.overlap(this, enemy, this.removeEnemy, null, this)
      }
    }
  }

  removeEnemy(bullet, enemy) {
    if (bullet.shooter === 'player') {
      bullet.kill()
      enemy.die()
    }
  }

  killPlayer(bullet, player) {
    if (bullet.shooter === 'enemy') {
      bullet.kill()
      player.die()
    }
  }

  remove(bullet, platforms) {
    bullet.kill()
  }
}
