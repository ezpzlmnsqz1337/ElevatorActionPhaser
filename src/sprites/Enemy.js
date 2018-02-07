import Phaser from 'phaser'
import Bullet from './Bullet'
import d from '../dimensions'

export default class Enemy extends Phaser.Sprite {
    constructor({ game, x, y }) {
        super(game, x, y, 'enemy')
        game.physics.arcade.enable(this)
        this.state = game.state.getCurrentState()
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
        let state = this.state

        game.physics.arcade.collide(this, state.platforms)
        game.physics.arcade.overlap(this, state.player, this.colision, null, this)
        //elevator collisions
        for (let i = 0; i < state.elevators.length; i++) {
            const elevator = state.elevators[i];
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
        let state = this.state

        let x = this.position.x
        let px = state.player.position.x
        let y = this.position.y
        let py = state.player.position.y

        let playerInTheSameFloor = (y + 10 > py && y - 10 < py)
        let elevatorInTheSameFloor = false

        //check if elevator on the same floor as enemy
        let ex = null
        for (const elevator of state.elevators) {
            const ey = elevator.position.y
            if (y + 70 > ey && y - 20 < ey) {
                elevatorInTheSameFloor = true
                ex = elevator.position.x //set x position of the elevator so that the enemy can goto the elevator
                break
            }
        }

        if (playerInTheSameFloor) { //if player on the same floor, shoot
            this.body.velocity.x = 0
            if (x < px) {
                this.direction = 'right'
                this.shoot()
            } else {
                this.direction = 'left'
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
        let state = this.state

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
            state.bullets.push(new Bullet({ game: this.game, x: x, y: y, direction: this.direction, shooter: 'enemy' }))
            this.animations.play('duck-shoot-' + this.direction)
        } else {
            state.bullets.push(new Bullet({ game: this.game, x: x, y: y, direction: this.direction, shooter: 'enemy' }))
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