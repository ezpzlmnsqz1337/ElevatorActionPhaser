import Phaser from 'phaser'
import Bullet from './Bullet'

export default class Player extends Phaser.Sprite {
    constructor({ game, x, y }) {
        super(game, x, y, 'player')
        game.physics.arcade.enable(this)
        this.body.bounce.y = 0
        this.body.gravity.y = 1200
        this.body.collideWorldBounds = true
        this.state = game.state.getCurrentState()

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
        this.animations.add('left', ['left.png'], 10, false)
        this.animations.add('right', ['right.png'], 10, false)
        //walk
        this.animations.add('go-left', ['go-left-1.png', 'go-left-2.png'], 10, true)
        this.animations.add('go-right', ['go-right-1.png', 'go-right-2.png'], 10, true)
        //shoot
        this.animations.add('shoot-left', ['shoot-left.png'], 1, false)
        this.animations.add('shoot-right', ['shoot-right.png'], 1, false)
        //duck
        this.animations.add('duck-left', ['duck-left.png'], 1, false)
        this.animations.add('duck-right', ['duck-right.png'], 1, false)
        //duck shoot
        this.animations.add('duck-shoot-left', ['duck-shoot-left.png'], 1, false)
        this.animations.add('duck-shoot-right', ['duck-shoot-right.png'], 1, false)
        //jump
        this.animations.add('jump-left', ['jump-left.png'], 1, false)
        this.animations.add('jump-right', ['jump-right.png'], 1, false)
        //jump shoot
        this.animations.add('jump-shoot-left', ['jump-shoot-left.png'], 1, false)
        this.animations.add('jump-shoot-right', ['jump-shoot-right.png'], 1, false)

        console.log(this.body)

        game.add.existing(this)
    }

    update() {
        let bullets = this.state.bullets
        //  Collisions
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].update()
        }

        let hitPlatform = game.physics.arcade.collide(this, this.state.platforms)
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
        let bullets = this.state.bullets

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
            bullets.push(new Bullet({ game: this.game, x: x, y: y, direction: this.direction, shooter: 'player' }))
            this.animations.play('duck-shoot-' + this.direction)
        } else if (this.isJumping) {
            bullets.push(new Bullet({ game: this.game, x: x, y: y, direction: this.direction, shooter: 'player' }))
            this.animations.play('jump-shoot-' + this.direction)
        } else {
            bullets.push(new Bullet({ game: this.game, x: x, y: y, direction: this.direction, shooter: 'player' }))
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

    die() {
        this.lives--
        if (this.lives === 0) {
            this.state.gameOver()
        }
    }
}