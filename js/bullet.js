Bullet = function (game, x, y, direction) {
    'use strict';
    Phaser.Sprite.call(this, game, x, y, 'bullet');
    this.speed = 300;

    game.physics.arcade.enable(this);
    this.body.immovable = true;
    if (direction === 'left') {
        this.body.velocity.x = -this.speed;
    } else {
        this.body.velocity.x = this.speed;
    }
    game.add.existing(this);
};

// add a new object Phaser.Sprite as prototype of Mario 
Bullet.prototype = Object.create(Phaser.Sprite.prototype);
// specify the constructor
Bullet.constructor = Bullet;

Bullet.prototype.remove = function (bullet, platforms) {
    bullet.kill();
};

Bullet.prototype.update = function () {
    //game.physics.arcade.collide(sprite, platforms);
    game.physics.arcade.overlap(this, platforms, this.remove, null, this);

    console.log(enemies);
    for (var i = 0; i < enemies.length; i++) {
        game.physics.arcade.overlap(this, enemies[i].sprite, this.removeEnemey, null, this);
    }
};

Bullet.prototype.removeEnemey = function (bullet, enemy) {
    bullet.kill();
    enemy.animations.play('jump-left');
    setTimeout(function () {
        enemy.kill(), 1000
    });
};