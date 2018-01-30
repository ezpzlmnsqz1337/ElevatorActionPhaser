Player = function (game, x, y) {
    'use strict';

    Phaser.Sprite.call(this, game, x, y, 'player');
    //  Player physics properties. Give the little guy a slight bounce.
    //  We need to enable physics on the this.sprite
    game.physics.arcade.enable(this);
    this.body.bounce.y = 0;
    this.body.gravity.y = 1200;
    this.body.collideWorldBounds = true;
    this.bullets = [];

    //custom properties
    this.orientation = 'left';
    this.isJumping = false;
    this.isDucking = false;
    this.isShooting = false;
    this.isOnGround = false;
    this.speed = 150;
    this.lives = 2;
    this.jumpSpeed = 350;
    this.isInElevator = false;

    // set up animations
    //stand still
    this.animations.add('left', [0], 10, false);
    this.animations.add('right', [1], 10, false);
    //walk
    this.animations.add('go-left', [12, 14], 10, true);
    this.animations.add('go-right', [13, 15], 10, true);
    //shoot
    this.animations.add('shoot-left', [6], 1, false);
    this.animations.add('shoot-right', [7], 1, false);
    //duck
    this.animations.add('duck-left', [4], 1, false);
    this.animations.add('duck-right', [5], 1, false);
    //duck shoot
    this.animations.add('duck-shoot-left', [10], 1, false);
    this.animations.add('duck-shoot-right', [11], 1, false);
    //jump
    this.animations.add('jump-left', [2], 1, false);
    this.animations.add('jump-right', [3], 1, false);
    //jump shoot
    this.animations.add('jump-shoot-left', [8], 1, false);
    this.animations.add('jump-shoot-right', [9], 1, false);

    game.add.existing(this);
};

// add a new object Phaser.Sprite as prototype of Mario 
Player.prototype = Object.create(Phaser.Sprite.prototype);
// specify the constructor
Player.constructor = Player;

//methods
Player.prototype.duck = function () {
    var player = this;

    player.isDucking = true;
    if (player.isShooting) {
        player.animations.play('duck-shoot-' + player.orientation);
    } else {
        player.animations.play('duck-' + player.orientation);
    }
};

Player.prototype.jump = function () {
    var player = this;

    player.isJumping = true;
    player.body.velocity.y = -player.jumpSpeed;
    player.animations.play('jump-' + player.orientation);
};

Player.prototype.standUp = function () {
    var player = this;

    player.isDucking = false;
    player.animations.play(player.orientation);
};

Player.prototype.go = function (direction) {
    var player = this;

    if (direction === 'left') {
        player.orientation = direction;
        if (player.isDucking) {
            //duck left
            player.animations.play('duck-' + player.orientation);
        } else if (player.isJumping) {
            // jump left
            player.body.velocity.x = -player.speed;
            player.animations.play('jump-' + player.orientation);
        } else {
            // go left
            player.body.velocity.x = -player.speed;
            player.animations.play('go-' + player.orientation);
        }
    } else if (direction === 'right') {
        player.orientation = direction;
        if (player.isDucking) {
            player.animations.play('duck-' + player.orientation);
        } else if (player.isJumping) {
            //  Move to the right
            player.body.velocity.x = player.speed;
            player.animations.play('jump-' + player.orientation);
        } else {
            //  Move to the right
            player.body.velocity.x = player.speed;
            player.animations.play('go-' + player.orientation);
        }
    }
};

Player.prototype.stay = function () {
    var player = this;

    player.animations.play(player.orientation);
};

Player.prototype.shoot = function () {
    var player = this;
    var bullets = this.bullets;

    if (player.isShooting) {
        return;
    }

    player.isShooting = true;
    //actual shooting
    //bullet properties
    var x = player.position.x;
    x += player.orientation === 'left' ? -10 : 10;
    var y = player.position.y + 22;

    //shooting
    if (player.isDucking) {
        y += 15;
        bullets.push(new Bullet(game, x, y, player.orientation));
        player.animations.play('duck-shoot-' + player.orientation);
    } else if (player.isJumping) {
        bullets.push(new Bullet(game, x, y, player.orientation));
        player.animations.play('jump-shoot-' + player.orientation);
    } else {
        bullets.push(new Bullet(game, x, y, player.orientation));
        player.animations.play('shoot-' + player.orientation);
    }

    setTimeout(function () {
        player.isShooting = false;
    }, 300);
};

Player.prototype.update = function () {
    var bullets = this.bullets;
    //  Collisions
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].update();
    }

    var hitPlatform = game.physics.arcade.collide(this, platforms);
    this.isOnGround = this.body.touching.down && hitPlatform;

    if (this.isOnGround) {
        this.isJumping = false;
    }

    if (this.isJumping) {
        if (this.isShooting) {
            this.animations.play('jump-shoot-' + this.orientation);
        } else {
            this.animations.play('jump-' + this.orientation);
        }
    }

    if (this.isDucking) {
        this.duck();
    }
};

Player.prototype.elevatorUp = function () {

}

Player.prototype.elevatorDown = function () {
}