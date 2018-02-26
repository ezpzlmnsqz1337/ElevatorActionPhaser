import Phaser from 'phaser'
import d from '../dimensions'

export default class Elevator extends Phaser.Sprite {
    constructor({ game, x, y, floors, startFloor, startDirection, speed }) {
        super(game, x, y, 'elevator')
        //physics
        game.physics.arcade.enable(this)
        this.scale.setTo(0.6, 1)
        this.body.immovable = true

        //params
        this.ELEVATOR_SPEED = speed
        this.direction = startDirection
        this.currentFloor = startFloor
        this.isMoving = false


        //elevator timeout
        this.elevatorTimeout = setTimeout(() => {
            this.move(this.direction)
        }, this.ELEVATOR_SPEED)

        this.floors = []
        for (let i = 0; i < floors; i++) {
            this.floors.push(y + (i * d.FLOOR_HEIGHT))
        }

        game.add.existing(this)
    }

    move(direction) {
        let floors = this.floors
        let arcade = this.game.physics.arcade

        console.log("DIRECTION: " + direction)
        if (direction !== this.direction || (direction === this.direction && !this.isMoving)) {
            //only work if the direction has changed or  if direction is the same and the elevator is waiting in a floor, i.e. not moving
            clearTimeout(this.elevatorTimeout)

            this.direction = direction
            this.isMoving = true

            if (direction === 'up') {
                let nextFloor = this.currentFloor - 1 > 0 ? this.currentFloor - 1 : 0
                arcade.moveToXY(this, this.body.position.x, floors[nextFloor], 100)
                this.currentFloor = nextFloor
            } else if (direction === 'down') {
                let nextFloor = this.currentFloor + 1 < floors.length ? this.currentFloor + 1 : floors.length - 1
                arcade.moveToXY(this, this.body.position.x, floors[nextFloor], 100)
                this.currentFloor = nextFloor
            }

            this.elevatorTimeout = setTimeout(() => {
                this.move(this.direction)
            }, this.ELEVATOR_SPEED)
        }
    }

    update() {
        let floors = this.floors
        let arcade = game.physics.arcade

        // elevator
        let zeroDistanceUp = Math.floor(arcade.distanceToXY(this, this.body.position.x, floors[this.currentFloor])) === 0
        let zeroDistanceDown = Math.floor(arcade.distanceToXY(this, this.body.position.x, floors[this.currentFloor])) === 0

        if (this.direction === 'up' && zeroDistanceUp) {
            if (this.currentFloor === 0) {
                this.direction = 'down'
            }
            this.body.velocity.y = 0
            this.isMoving = false

        } else if (this.direction === 'down' && zeroDistanceDown) {
            if (this.currentFloor === floors.length - 1) {
                this.direction = 'up'
            }
            this.body.velocity.y = 0
            this.isMoving = false
        }
    }
}
