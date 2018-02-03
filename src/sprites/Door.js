import Phaser from 'phaser'

export default class Door extends Phaser.Sprite {
    constructor({ game, x, y, color, direction }) {
        super(game, x, y, 'door')
        this.color = color
        this.direction = direction

        // animations
        this.animations.add('red-left', [6], 1, false)
        this.animations.add('red-right', [7], 1, false)

        this.animations.add('red-left-open', [6, 8, 10, 8, 6], 5, false)
        this.animations.add('red-right-open', [7, 9, 11, 9, 7], 5, false)

        this.animations.add('blue-left', [0], 1, false)
        this.animations.add('blue-right', [1], 1, false)

        this.animations.add('blue-left-open', [0, 3, 5, 3, 0], 5, false)
        this.animations.add('blue-right-open', [1, 4, 6, 4, 1], 5, false)

        this.animations.play(this.color + '-' + this.direction)
        game.add.existing(this)
    }

    open() {
        console.log(this.color + '-' + this.direction + '-open')
        this.animations.play(this.color + '-' + this.direction + '-open')
    }
}
