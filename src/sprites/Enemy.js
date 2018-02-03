import Phaser from 'phaser'
import d from '../dimensions'

export default class Enemy extends Phaser.Sprite {
    constructor({ game, x, y }) {
        super(game, x, y, 'enemy')
        game.physics.arcade.enable(this)
        this.player = game.state.getCurrentState().player
        this.platforms = game.state.getCurrentState().platforms
        this.elevators = game.state.getCurrentState().elevators
        this.body.gravity.y = 1200
        this.body.bounce.y = 0
        this.isDead = false

        this.speed = 80

        // set up animations
        //stand still
        this.animations.add('left', [0], 10, false)
        this.animations.add('right', [1], 10, false)
        //walk
        this.animations.add('go-left', [12, 14], 10, true)
        this.animations.add('go-right', [13, 15], 10, true)
        //shoot
        this.animations.add('shoot-left', [6], 1, false)
        this.animations.add('shoot-right', [7], 1, false)
        //duck
        this.animations.add('duck-left', [4], 1, false)
        this.animations.add('duck-right', [5], 1, false)
        //duck shoot
        this.animations.add('duck-shoot-left', [10], 1, false)
        this.animations.add('duck-shoot-right', [11], 1, false)
        //jump
        this.animations.add('jump-left', [2], 1, false)
        this.animations.add('jump-right', [3], 1, false)
        //jump shoot
        this.animations.add('jump-shoot-left', [8], 1, false)
        this.animations.add('jump-shoot-right', [9], 1, false)

        this.animations.add('die', [2, 3, 8, 9], 10, true)
        game.add.existing(this)
    }

    update() {
        game.physics.arcade.collide(this, this.platforms)
        game.physics.arcade.overlap(this, this.player, this.colision, null, this)
        //elevator collisions
        for (let i = 0; i < this.elevators.length; i++) {
            const elevator = this.elevators[i];
            game.physics.arcade.collide(this, elevator)
        }

        if (this.isDead) {
            this.body.velocity.x = 0
            return
        }

        let x = this.position.x
        let px = this.player.position.x
        let y = this.position.y
        let py = this.player.position.y

        let inTheSameFloor = (y + d.FLOOR_HEIGHT > py && y - d.FLOOR_HEIGHT < py)

        if (x < px && inTheSameFloor) {
            this.body.velocity.x = this.speed
            this.animations.play('go-right')
        } else if (x > px && inTheSameFloor) {
            this.body.velocity.x = -this.speed
            this.animations.play('go-left')
        } else {
            this.animations.play('left')
            this.body.velocity.x = 0
        }
    }

    colision(enemy, player) {
        console.log(player.isJumping)
        if (player.isJumping) {
            this.die()
        }
    }

    die() {
        this.isDead = true
        this.animations.play('die')
        setTimeout(() => {
            this.kill()
        }, 1000)
    }
}