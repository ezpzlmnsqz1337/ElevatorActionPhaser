function Door(x, y, color, orientation) {

    // The player and its settings
    this.sprite = game.add.sprite(x, y, 'door');
    this.color = color;
    this.orientation = orientation;

    //animations
    this.sprite.animations.add('red-left', [6], 1, false);
    this.sprite.animations.add('red-right', [7], 1, false);

    this.sprite.animations.add('red-left-open', [6, 8, 10, 8, 6], 5, false);
    this.sprite.animations.add('red-right-open', [7, 9, 11, 9, 7], 5, false);

    this.sprite.animations.add('blue-left', [0], 1, false);
    this.sprite.animations.add('blue-right', [1], 1, false);

    this.sprite.animations.add('blue-left-open', [0, 3, 5, 3, 0], 5, false);
    this.sprite.animations.add('blue-right-open', [1, 4, 6, 4, 1], 5, false);

    this.sprite.animations.play(this.color + '-' + this.orientation);
}

Door.prototype.open = function () {
    var doors = this;
    var sprite = this.sprite;

    this.sprite.animations.play(doors.color + '-' + doors.orientation + '-open');
};