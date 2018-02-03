import Phaser from 'phaser'

export default class Controls {
    constructor({ game, player }) {
        this.cursors = game.input.keyboard.createCursorKeys()
        this.player = player
        this.init()
    }

    init() {
        let cursors = this.cursors

        cursors.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR])

        cursors.down.onDown.add(() => {
            if (this.player.isInElevator) {
                this.player.moveElevator('down')
            } else if (this.player.isOnGround) {
                //  Ducking
                this.player.duck()
            }
        })

        cursors.up.onDown.add(() => {
            if (this.player.isInElevator) {
                this.player.moveElevator('up')
            } else if (this.player.isDucking) {
                this.player.standUp()
            } else if (this.player.isOnGround) {
                this.player.jump()
            }
        })

        cursors.space.onDown.add(() => {
            this.player.shoot()
        })
    }

    update() {
        let cursors = this.cursors

        game.camera.follow(this.player)
        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0

        if (this.player.isOnGround && !this.player.isShooting && !this.player.isJumping) {
            if (!cursors.left.isDown && !cursors.right.isDown) {
                this.player.stay()
            }
        }

        if (cursors.left.isDown) {
            this.player.go('left')
        }
        if (cursors.right.isDown) {
            this.player.go('right')
        }
    }
}