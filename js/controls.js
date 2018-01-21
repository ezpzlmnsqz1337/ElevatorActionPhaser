function Controls(game, player) {
    this.game = game;
    this.player = player;
    this.cursors = game.input.keyboard.createCursorKeys();
    this.init();
}

Controls.prototype.init = function () {
    var game = this.game;
    var player = this.player;
    var cursors = this.cursors;

    cursors.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    game.camera.follow(player.sprite);


    cursors.down.onDown.add(function () {
        if (player.isOnGround) {
            //  Ducking
            player.duck();
        }
    });

    cursors.up.onDown.add(function () {
        if (player.isDucking) {
            player.standUp();
        } else if (player.isOnGround) {
            player.jump();
        }
    });

    cursors.space.onDown.add(function () {
        player.shoot();
    });
}

Controls.prototype.update = function () {
    var player = this.player;
    var cursors = this.cursors;

    //  Reset the players velocity (movement)
    player.sprite.body.velocity.x = 0;

    if (player.isOnGround && !player.isShooting && !player.isJumping) {
        if (!cursors.left.isDown && !cursors.right.isDown) {
            player.stay();
        }
    }

    if (cursors.left.isDown) {
        player.go('left');
    }
    if (cursors.right.isDown) {
        player.go('right');
    }
}

