import Phaser from 'phaser'

export default class Controls {
    constructor({ game }) {
        this.game = game
        this.cursors = game.input.keyboard.createCursorKeys()
        this.state = game.state.getCurrentState()
        this.player = this.state.player

        //mobile controls shit
        this.showMobileControls = false
        this.left = false
        this.right = false
        this.fire = false
        this.jump = false

        this.init()
    }

    init() {


        let cursors = this.cursors

        cursors.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR])

        cursors.down.onDown.add(() => this.handleDownKey())

        cursors.up.onDown.add(() => this.handleUpKey())

        cursors.space.onDown.add(() => this.handleSpaceKey())

        //mobile
        this.arrowLeft = game.add.button(0, 480, 'left', null, this, 1, 0, 1, 0);  //game, x, y, key, callback, callbackCont
        this.arrowLeft.fixedToCamera = true;  //our buttons should stay on the same place  
        this.arrowLeft.events.onInputDown.add(() => this.left = true);
        this.arrowLeft.events.onInputUp.add(() => this.left = false);
        this.arrowLeft.scale.setTo(2.5, 2.5)
        this.arrowLeft.visible = this.showMobileControls

        this.arrowRight = game.add.button(140, 480, 'right', null, this, 1, 0, 1, 0);  //game, x, y, key, callback, callbackCont
        this.arrowRight.fixedToCamera = true;  //our buttons should stay on the same place  
        this.arrowRight.events.onInputDown.add(() => this.right = true);
        this.arrowRight.events.onInputUp.add(() => this.right = false);
        this.arrowRight.scale.setTo(2.5, 2.5)
        this.arrowRight.visible = this.showMobileControls

        this.arrowDown = game.add.button(70, 595, 'down', this.handleDownKey, this, 1, 0, 1, 0);  //game, x, y, key, callback, callbackCont
        this.arrowDown.fixedToCamera = true;  //our buttons should stay on the same place  
        this.arrowDown.scale.setTo(2.5, 2.5)
        this.arrowDown.visible = this.showMobileControls

        this.btnShoot = game.add.button(1100, 540, 'shoot', this.handleSpaceKey, this, 1, 0, 1, 0);  //game, x, y, key, callback, callbackCont
        this.btnShoot.fixedToCamera = true;  //our buttons should stay on the same place
        this.btnShoot.visible = this.showMobileControls

        this.btnJump = game.add.button(1100, 360, 'jump', this.handleUpKey, this, 1, 0, 1, 0);  //game, x, y, key, callback, callbackCont
        this.btnJump.fixedToCamera = true;  //our buttons should stay on the same place
        this.btnJump.visible = this.showMobileControls

        this.btnRestart = game.add.button(1220, 10, 'restart', () => this.game.state.restart(), this, 1, 0, 1, 0);  //game, x, y, key, callback, callbackCont
        this.btnRestart.fixedToCamera = true;  //our buttons should stay on the same place

        this.btnMobileControls = game.add.button(10, 10, 'showMobileControls', this.toggleMobileControls, this, 1, 0, 1, 0);  //game, x, y, key, callback, callbackCont
        this.btnMobileControls.scale.setTo(0.5, 0.5)
        this.btnMobileControls.fixedToCamera = true;  //our buttons should stay on the same place
    }

    toggleMobileControls() {
        this.showMobileControls = !this.showMobileControls
        this.arrowLeft.visible = this.showMobileControls
        this.arrowRight.visible = this.showMobileControls
        this.arrowDown.visible = this.showMobileControls
        this.btnShoot.visible = this.showMobileControls
        this.btnJump.visible = this.showMobileControls
    }

    handleDownKey() {
        if (this.player.isInElevator) {
            this.player.moveElevator('down')
        } else if (this.player.isOnGround) {
            //  Ducking
            this.player.duck()
        }
    }

    handleUpKey() {
        if (this.player.isInElevator) {
            this.player.moveElevator('up')
        } else if (this.player.isDucking) {
            this.player.standUp()
        } else if (this.player.isOnGround) {
            this.player.jump()
        }
    }

    handleSpaceKey() {
        this.player.shoot()
    }

    update() {
        let cursors = this.cursors

        game.camera.follow(this.player)
        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0

        if (this.player.isOnGround && !this.player.isShooting && !this.player.isJumping) {
            if (!cursors.left.isDown && !cursors.right.isDown && !this.left && !this.right) {
                this.player.stay()
            }
        }

        if (cursors.left.isDown || this.left) {
            this.player.go('left')
        }
        if (cursors.right.isDown || this.right) {
            this.player.go('right')
        }
    }
}