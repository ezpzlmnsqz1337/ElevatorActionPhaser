import Phaser from 'phaser'
import d from '../dimensions'

export default class Elevator extends Phaser.Sprite {
    constructor({ game, x, y, floors }) {
        super(game, x, y, 'elevator')
        game.physics.arcade.enable(this)
        this.scale.setTo(0.6, 1)
        this.body.immovable = true
        this.direction = 'down'
        this.floors = []
        for (let i = 0; i < floors; i++) {
            this.floors.push(y + (i * d.FLOOR_HEIGHT))
        }
        this.currentFloor = 0
        this.isWaiting = false
        this.player = game.state.getCurrentState().player
        this.elevatorTimeout = null
        game.add.existing(this)
    }

    move(direction) {
        let floors = this.floors
        let arcade = this.game.physics.arcade

        clearTimeout(this.elevatorTimeout)

        if (direction === 'up') {
            this.direction = direction
            this.nextFloor = this.currentFloor - 1 > 0 ? this.currentFloor - 1 : 0
            arcade.moveToXY(this, this.body.position.x, floors[this.nextFloor], 100)
            this.currentFloor = this.nextFloor
        } else if (direction === 'down') {
            this.direction = direction
            this.nextFloor = this.currentFloor + 1 < floors.length ? this.currentFloor + 1 : floors.length - 1
            arcade.moveToXY(this, this.body.position.x, floors[this.nextFloor], 100)
            this.currentFloor = this.nextFloor
        }
    }

    moveByEnemy(direction) {
        if (this.isWaiting) {
            console.log('ELEVATOR MOVE')
            this.move(direction)
        }
    }

    update() {
        let floors = this.floors
        let arcade = game.physics.arcade

        // handle the elevator in a floor,wait
        if (!this.isWaiting) {
            // stay in current direction
            this.isWaiting = true
            this.move(this.direction)
        }
        game.physics.arcade.collide(this.player, this, this.setPlayerOnElevator, null, this)

        // elevator
        let zeroDistanceUp = Math.floor(arcade.distanceToXY(this, this.body.position.x, floors[this.currentFloor])) === 0
        let zeroDistanceDown = Math.floor(arcade.distanceToXY(this, this.body.position.x, floors[this.currentFloor])) === 0

        if (this.direction === 'up' && zeroDistanceUp) {
            if (this.currentFloor === 0) {
                this.direction = 'down'
            }
            this.body.velocity.y = 0
            this.elevatorTimeout = setTimeout(() => {
                this.isWaiting = false
            }, 3000)
        } else if (this.direction === 'down' && zeroDistanceDown) {
            if (this.currentFloor === floors.length - 1) {
                this.direction = 'up'
            }
            this.body.velocity.y = 0
            this.elevatorTimeout = setTimeout(() => {
                this.isWaiting = false
            }, 3000)
        }
    }

    setPlayerOnElevator(player, elevator) {
        player.isInElevator = true
        player.activeElevator = elevator
    }
}
