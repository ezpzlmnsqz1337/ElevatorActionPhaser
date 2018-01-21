function Player(game, x, y) {
    // The player and its settings
    this.sprite = game.add.sprite(x, y, 'player');
    //  Player physics properties. Give the little guy a slight bounce.
    //  We need to enable physics on the this.sprite
    this.game = game;
    game.physics.arcade.enable(this.sprite);
    this.sprite.body.bounce.y = 0;
    this.sprite.body.gravity.y = 1200;
    this.sprite.body.collideWorldBounds = true;

    //custom properties
    this.orientation = 'left';
    this.isJumping = false;
    this.isDucking = false;
    this.isShooting = false;
    this.isOnGround = false;
    this.speed = 150;
    this.lives = 2;
    this.jumpSpeed = 350;

    // set up animations
    //stand still
    this.sprite.animations.add('left', [0], 10, false);
    this.sprite.animations.add('right', [1], 10, false);
    //walk
    this.sprite.animations.add('go-left', [12, 14], 10, true);
    this.sprite.animations.add('go-right', [13, 15], 10, true);
    //shoot
    this.sprite.animations.add('shoot-left', [6], 1, false);
    this.sprite.animations.add('shoot-right', [7], 1, false);
    //duck
    this.sprite.animations.add('duck-left', [4], 1, false);
    this.sprite.animations.add('duck-right', [5], 1, false);
    //duck shoot
    this.sprite.animations.add('duck-shoot-left', [10], 1, false);
    this.sprite.animations.add('duck-shoot-right', [11], 1, false);
    //jump
    this.sprite.animations.add('jump-left', [2], 1, false);
    this.sprite.animations.add('jump-right', [3], 1, false);
    //jump shoot
    this.sprite.animations.add('jump-shoot-left', [8], 1, false);
    this.sprite.animations.add('jump-shoot-right', [9], 1, false);
}

//methods
Player.prototype.duck = function () {
    var player = this;
    var sprite = this.sprite;

    player.isDucking = true;
    if (player.isShooting) {
        sprite.animations.play('duck-shoot-' + player.orientation);
    } else {
        sprite.animations.play('duck-' + player.orientation);
    }
};

Player.prototype.jump = function () {
    var player = this;
    var sprite = this.sprite;

    player.isJumping = true;
    sprite.body.velocity.y = -player.jumpSpeed;
    sprite.animations.play('jump-' + player.orientation);
};

Player.prototype.standUp = function () {
    var player = this;
    var sprite = this.sprite;

    player.isDucking = false;
    sprite.animations.play(player.orientation);
};

Player.prototype.go = function (direction) {
    var player = this;
    var sprite = this.sprite;

    if (direction === 'left') {
        player.orientation = direction;
        if (player.isDucking) {
            //duck left
            sprite.animations.play('duck-' + player.orientation);
        } else if (player.isJumping) {
            // jump left
            sprite.body.velocity.x = -player.speed;
            sprite.animations.play('jump-' + player.orientation);
        } else {
            // go left
            sprite.body.velocity.x = -player.speed;
            sprite.animations.play('go-' + player.orientation);
        }
    } else if (direction === 'right') {
        player.orientation = direction;
        if (player.isDucking) {
            sprite.animations.play('duck-' + player.orientation);
        } else if (player.isJumping) {
            //  Move to the right
            sprite.body.velocity.x = player.speed;
            sprite.animations.play('jump-' + player.orientation);
        } else {
            //  Move to the right
            sprite.body.velocity.x = player.speed;
            sprite.animations.play('go-' + player.orientation);
        }
    }
};

Player.prototype.stay = function () {
    var player = this;
    var sprite = this.sprite;

    sprite.animations.play(player.orientation);
};

Player.prototype.shoot = function () {
    var player = this;
    var sprite = this.sprite;
    var game = this.game;

    if (player.isShooting) {
        return;
    }

    player.isShooting = true;
    //actual shooting
    //bullet properties
    var x = sprite.position.x;
    x += player.orientation === 'left' ? -10 : 10;
    var y = sprite.position.y + 22;

    //shooting
    if (player.isDucking) {
        y += 15;
        new Bullet(game, x, y, player.orientation);
        sprite.animations.play('duck-shoot-' + player.orientation);
    } else if (player.isJumping) {
        new Bullet(game, x, y, player.orientation);
        sprite.animations.play('jump-shoot-' + player.orientation);
    } else {
        new Bullet(game, x, y, player.orientation);
        sprite.animations.play('shoot-' + player.orientation);
    }

    setTimeout(function () {
        player.isShooting = false;
    }, 300);
};

Player.prototype.update = function (platforms) {
    var player = this;
    var sprite = this.sprite;
    var game = this.game;
    //  Collisions
    var hitPlatform = game.physics.arcade.collide(player.sprite, platforms);
    player.isOnGround = sprite.body.touching.down && hitPlatform;

    if (player.isOnGround) {
        player.isJumping = false;
    }

    if (player.isJumping) {
        if (player.isShooting) {
            sprite.animations.play('jump-shoot-' + player.orientation);
        } else {
            sprite.animations.play('jump-' + player.orientation);
        }
    }

    if (player.isDucking) {
        player.duck();
    }
};



