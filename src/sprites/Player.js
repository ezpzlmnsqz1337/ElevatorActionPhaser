import Phaser from 'phaser'
import Bullet from './Bullet'

export default class Player extends Phaser.Sprite {
    constructor({ game, x, y }) {
        super(game, x, y, 'player')

        //constants
        this.STANDUP_HEIGHT = 51
        this.DUCK_HEIGHT = 31
        this.JUMP_HEIGHT = 39

        //physics
        game.physics.arcade.enable(this)
        this.body.bounce.y = 0
        this.body.gravity.y = 1200
        this.body.collideWorldBounds = true
        this.state = game.state.getCurrentState()
        this.anchor.setTo(0.5, 1)
        this.body.height = this.STANDUP_HEIGHT


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
        this.animations.add('left', ['left'], 10, false)
        this.animations.add('right', ['right'], 10, false)
        //walk
        this.animations.add('go-left', ['go-left-1', 'go-left-2'], 10, true)
        this.animations.add('go-right', ['go-right-1', 'go-right-2'], 10, true)
        //shoot
        this.animations.add('shoot-left', ['shoot-left'], 1, false)
        this.animations.add('shoot-right', ['shoot-right'], 1, false)
        //duck
        this.animations.add('duck-left', ['duck-left'], 1, false)
        this.animations.add('duck-right', ['duck-right'], 1, false)
        //duck shoot
        this.animations.add('duck-shoot-left', ['duck-shoot-left'], 1, false)
        this.animations.add('duck-shoot-right', ['duck-shoot-right'], 1, false)
        //jump
        this.animations.add('jump-left', ['jump-left'], 1, false)
        this.animations.add('jump-right', ['jump-right'], 1, false)
        //jump shoot
        this.animations.add('jump-shoot-left', ['jump-shoot-left'], 1, false)
        this.animations.add('jump-shoot-right', ['jump-shoot-right'], 1, false)

        console.log(this.body)

        game.add.existing(this)
    }

    update() {
        //elevators
        let elevatorCollide = game.physics.arcade.collide(this.state.elevators, this, this.setInElevator, null, this)

        if (!elevatorCollide) {
            this.activeElevator = null
        }

        //platforms
        let hitPlatform = game.physics.arcade.collide(this, this.state.platforms)
        this.isOnGround = this.body.touching.down && hitPlatform

        if (this.isOnGround || this.activeElevator) {
            this.isJumping = false
        }

        if (this.isJumping) {
            this.body.height = this.JUMP_HEIGHT
            if (this.isShooting) {
                this.animations.play('jump-shoot-' + this.direction)
            } else {
                this.animations.play('jump-' + this.direction)
            }
        } else if (this.isDucking) {
            this.duck()
        } else {
            this.body.height = this.STANDUP_HEIGHT
        }
    }

    duck() {
        this.body.height = this.DUCK_HEIGHT
        this.isDucking = true
        if (this.isShooting) {
            this.animations.play('duck-shoot-' + this.direction)
        } else {
            this.animations.play('duck-' + this.direction)
        }
    }

    jump() {
        this.body.height = this.JUMP_HEIGHT
        this.isJumping = true
        this.body.velocity.y = -this.jumpSpeed
        this.animations.play('jump-' + this.direction)
    }

    standUp() {
        this.body.height = this.STANDUP_HEIGHT
        this.isDucking = false
        this.animations.play(this.direction)
    }

    go(direction) {
        if (direction === 'left') {
            this.direction = direction
            if (this.isDucking) {
                //duck left
                this.body.height = this.DUCK_HEIGHT
                this.animations.play('duck-' + this.direction)
            } else if (this.isJumping) {
                // jump left
                this.body.height = this.JUMP_HEIGHT
                this.body.velocity.x = -this.speed
                this.animations.play('jump-' + this.direction)
            } else {
                // go left
                this.body.height = this.STANDUP_HEIGHT
                this.body.velocity.x = -this.speed
                this.animations.play('go-' + this.direction)
            }
        } else if (direction === 'right') {
            this.direction = direction
            if (this.isDucking) {
                this.body.height = this.DUCK_HEIGHT
                this.animations.play('duck-' + this.direction)
            } else if (this.isJumping) {
                //  Move to the right
                this.body.height = this.JUMP_HEIGHT
                this.body.velocity.x = this.speed
                this.animations.play('jump-' + this.direction)
            } else {
                //  Move to the right
                this.body.height = this.STANDUP_HEIGHT
                this.body.velocity.x = this.speed
                this.animations.play('go-' + this.direction)
            }
        }
    }

    stay() {
        this.animations.play(this.direction)
    }

    shoot() {
        if (this.isShooting) {
            return
        }

        let bullets = this.state.bullets

        this.isShooting = true
        //actual shooting
        //bullet properties
        let x = this.position.x
        x += this.direction === 'left' ? -10 : 10
        let y = this.position.y - 22

        //shooting
        if (this.isDucking) {
            this.body.height = this.DUCK_HEIGHT
            y += 15
            bullets.add(new Bullet({ game: this.game, x: x, y: y, direction: this.direction, shooter: 'player' }))
            this.animations.play('duck-shoot-' + this.direction)
        } else if (this.isJumping) {
            this.body.height = this.JUMP_HEIGHT
            bullets.add(new Bullet({ game: this.game, x: x, y: y, direction: this.direction, shooter: 'player' }))
            this.animations.play('jump-shoot-' + this.direction)
        } else {
            this.body.height = this.STANDUP_HEIGHT
            bullets.add(new Bullet({ game: this.game, x: x, y: y, direction: this.direction, shooter: 'player' }))
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

    setInElevator(player, elevator) {
        this.activeElevator = elevator
    }
}