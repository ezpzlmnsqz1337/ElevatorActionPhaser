Door = function (game, x, y, color, orientation) {
    'use strict';

    // The player and its settings
    Phaser.Sprite.call(this, game, x, y, 'door');
    this.color = color;
    this.orientation = orientation;

    //animations
    this.animations.add('red-left', [6], 1, false);
    this.animations.add('red-right', [7], 1, false);

    this.animations.add('red-left-open', [6, 8, 10, 8, 6], 5, false);
    this.animations.add('red-right-open', [7, 9, 11, 9, 7], 5, false);

    this.animations.add('blue-left', [0], 1, false);
    this.animations.add('blue-right', [1], 1, false);

    this.animations.add('blue-left-open', [0, 3, 5, 3, 0], 5, false);
    this.animations.add('blue-right-open', [1, 4, 6, 4, 1], 5, false);

    this.animations.play(this.color + '-' + this.orientation);
    game.add.existing(this);
}


// add a new object Phaser.Sprite as prototype of Mario 
Door.prototype = Object.create(Phaser.Sprite.prototype);
// specify the constructor
Door.constructor = Door;

Door.prototype.open = function () {
    this.animations.play(this.color + '-' + this.orientation + '-open');
};