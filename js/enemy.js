Enemy = function (game, x, y) {
    'use strict';
    // The player and its settings
    Phaser.Sprite.call(this, game, x, y, 'enemy');
    game.physics.arcade.enable(this);
    this.body.gravity.y = 1200;
    this.body.bounce.y = 0;


    this.speed = 80;

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

    this.animations.add('die', [13, 14, 15, 16], 2, false);
    game.add.existing(this);
};

// add a new object Phaser.Sprite as prototype of Mario 
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
// specify the constructor
Enemy.constructor = Enemy;

Enemy.prototype.update = function () {

    var x = this.position.x;
    var px = player.position.x;
    var y = this.position.y;
    var py = player.position.y;

    game.physics.arcade.collide(this, platforms);
    game.physics.arcade.overlap(this, player, this.colision, null, this);

    var inTheSameFloor = (y + FLOOR_HEIGHT > py && y - FLOOR_HEIGHT < py);

    if (x < px && inTheSameFloor) {
        this.body.velocity.x = this.speed;
        this.animations.play('go-right');
    } else if (x > px && inTheSameFloor) {
        this.body.velocity.x = -this.speed;
        this.animations.play('go-left');
    } else {
        this.animations.play('left');
        this.body.velocity.x = 0;
    }
};

Enemy.prototype.colision = function (enemy, player) {
    console.log(player.isJumping);
    if (player.isJumping) {
        this.animations.play('die');
        enemy.kill();
    }
};

Enemy.prototype.die = function () {
    this.animations.play('die');
};