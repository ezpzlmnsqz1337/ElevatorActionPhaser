import Phaser from 'phaser'
import Bullet from './Bullet'

export default class Player extends Phaser.Sprite {
    constructor({ game, x, y }) {
        super(game, x, y, 'player')
        game.physics.arcade.enable(this)
        this.body.bounce.y = 0
        this.body.gravity.y = 1200
        this.body.collideWorldBounds = true
        this.bullets = game.state.getCurrentState().bullets
        console.log(this.bullets)
        this.platforms = game.state.getCurrentState().platforms
        this.eneimes = game.state.getCurrentState().enemies


        //custom properties
        this.direction = 'left'
        this.isJumping = false
        this.isDucking = false
        this.isShooting = false
        this.isOnGround = false
        this.speed = 150
        this.lives = 2
        this.jumpSpeed = 350
        this.isInElevator = false
        this.activeElevator = null

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

        game.add.existing(this)
    }

    update() {
        let bullets = this.bullets
        //  Collisions
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].update()
        }

        let hitPlatform = game.physics.arcade.collide(this, this.platforms)
        this.isOnGround = this.body.touching.down && hitPlatform

        if (this.isOnGround) {
            this.isJumping = false
            this.isInElevator = false
            this.activeElevator = null
        }

        if (this.isInElevator) {
            this.isJumping = false
        }

        if (this.isJumping) {
            if (this.isShooting) {
                this.animations.play('jump-shoot-' + this.direction)
            } else {
                this.animations.play('jump-' + this.direction)
            }
        }

        if (this.isDucking) {
            this.duck()
        }
    }

    duck() {
        this.isDucking = true
        if (this.isShooting) {
            this.animations.play('duck-shoot-' + this.direction)
        } else {
            this.animations.play('duck-' + this.direction)
        }
    }

    jump() {
        this.isJumping = true
        this.body.velocity.y = -this.jumpSpeed
        this.animations.play('jump-' + this.direction)
    }

    standUp() {
        this.isDucking = false
        this.animations.play(this.direction)
    }

    go(direction) {
        if (direction === 'left') {
            this.direction = direction
            if (this.isDucking) {
                //duck left
                this.animations.play('duck-' + this.direction)
            } else if (this.isJumping) {
                // jump left
                this.body.velocity.x = -this.speed
                this.animations.play('jump-' + this.direction)
            } else {
                // go left
                this.body.velocity.x = -this.speed
                this.animations.play('go-' + this.direction)
            }
        } else if (direction === 'right') {
            this.direction = direction
            if (this.isDucking) {
                this.animations.play('duck-' + this.direction)
            } else if (this.isJumping) {
                //  Move to the right
                this.body.velocity.x = this.speed
                this.animations.play('jump-' + this.direction)
            } else {
                //  Move to the right
                this.body.velocity.x = this.speed
                this.animations.play('go-' + this.direction)
            }
        }
    }

    stay() {
        this.animations.play(this.direction)
    }

    shoot() {
        let bullets = this.bullets
        console.log(this.direction)

        if (this.isShooting) {
            return
        }

        this.isShooting = true
        //actual shooting
        //bullet properties
        let x = this.position.x
        x += this.direction === 'left' ? -10 : 10
        let y = this.position.y + 22

        //shooting
        if (this.isDucking) {
            y += 15
            bullets.push(new Bullet({ game: this.game, x: x, y: y, direction: this.direction }))
            this.animations.play('duck-shoot-' + this.direction)
        } else if (this.isJumping) {
            bullets.push(new Bullet({ game: this.game, x: x, y: y, direction: this.direction }))
            this.animations.play('jump-shoot-' + this.direction)
        } else {
            bullets.push(new Bullet({ game: this.game, x: x, y: y, direction: this.direction }))
            this.animations.play('shoot-' + this.direction)
        }

        setTimeout(() => {
            this.isShooting = false
        }, 300)
    }

    moveElevator(direction) {
        if (this.activeElevator) {
            this.activeElevator.move(direction)
        }
    }
}