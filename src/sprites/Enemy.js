import Phaser from 'phaser'
import Bullet from './Bullet'
import d from '../dimensions'

export default class Enemy extends Phaser.Sprite {
    constructor({ game, x, y }) {
        super(game, x, y, 'enemy')
        game.physics.arcade.enable(this)
        this.player = game.state.getCurrentState().player
        this.platforms = game.state.getCurrentState().platforms
        this.elevators = game.state.getCurrentState().elevators
        this.bullets = game.state.getCurrentState().bullets
        this.body.gravity.y = 1200
        this.body.bounce.y = 0
        this.isDead = false
        this.direction = 'left'
        this.isDucking = false
        this.isShooting = false

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


        //look for player
        this.goToPlayerFloor()
    }

    goToPlayerFloor() {
        let x = this.position.x
        let px = this.player.position.x
        let y = this.position.y
        let py = this.player.position.y

        let playerInTheSameFloor = (y + 10 > py && y - 10 < py)
        let elevatorInTheSameFloor = false

        //check if elevator on the same floor as enemy
        let ex = null
        for (const elevator of this.elevators) {
            const ey = elevator.position.y
            if (y + 70 > ey && y - 20 < ey) {
                elevatorInTheSameFloor = true
                ex = elevator.position.x //set x position of the elevator so that the enemy can goto the elevator
                break
            }
        }

        if (playerInTheSameFloor) { //if player on the same floor, shoot
            if (x < px) {
                this.direction = 'left'
                this.shoot()
            } else {
                this.direction = 'right'
                this.shoot()
            }
        } else {//else if elevator on the same floor go to player
            if (elevatorInTheSameFloor && x < ex) {
                this.direction = 'right'
                this.body.velocity.x = this.speed
                this.animations.play('go-' + this.direction)
            } else if (elevatorInTheSameFloor && x > ex) {
                this.direction = 'left'
                this.body.velocity.x = -this.speed
                this.animations.play('go-' + this.direction)
            }
        }
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
        x += this.direction === 'left' ? -15 : 15
        let y = this.position.y + 22

        //shooting
        if (this.isDucking) {
            y += 15
            bullets.push(new Bullet({ game: this.game, x: x, y: y, direction: this.direction }))
            this.animations.play('duck-shoot-' + this.direction)
        } else {
            bullets.push(new Bullet({ game: this.game, x: x, y: y, direction: this.direction }))
            this.animations.play('shoot-' + this.direction)
        }

        setTimeout(() => {
            this.isShooting = false
        }, 2000)
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