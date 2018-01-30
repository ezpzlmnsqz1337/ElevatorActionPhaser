Elevator = function (game, x, y, floors) {
    'use strict';
    console.log(this);
    Phaser.Sprite.call(this, game, x, y, 'elevator');
    console.log(this);
    game.physics.arcade.enable(this);
    this.scale.setTo(0.6, 1);
    this.body.immovable = true;

    this.direction = 'down';
    this.floors = [];
    for (var i = 0; i < floors; i++) {
        this.floors.push(y + (i * FLOOR_HEIGHT));
    }
    this.currentFloor = 0;
    this.isWaiting = false;
    game.add.existing(this);
}

// add a new object Phaser.Sprite as prototype of Mario 
Elevator.prototype = Object.create(Phaser.Sprite.prototype);
// specify the constructor
Elevator.constructor = Elevator;

Elevator.prototype.move = function (direction) {
    var floors = this.floors;
    var arcade = game.physics.arcade;

    if (direction === 'up') {
        this.direction = direction;
        this.nextFloor = this.currentFloor - 1 > 0 ? this.currentFloor - 1 : 0;
        arcade.moveToXY(this, this.body.position.x, floors[this.nextFloor], 100);
        this.currentFloor = this.nextFloor;
    } else if (direction === 'down') {
        this.direction = direction;
        this.nextFloor = this.currentFloor + 1 < floors.length ? this.currentFloor + 1 : floors.length - 1;
        arcade.moveToXY(this, this.body.position.x, floors[this.nextFloor], 100);
        this.currentFloor = this.nextFloor;
    }
};

Elevator.prototype.update = function () {
    var floors = this.floors;
    var arcade = game.physics.arcade;

    // handle the this in a floor,wait
    if (!this.isWaiting) {
        //stay in current direction
        this.isWaiting = true;
        this.move(this.direction);
    }


    game.physics.arcade.collide(player, this, this.setPlayerOnElevator, null, this);

    //this
    var zeroDistanceUp = Math.floor(arcade.distanceToXY(this, this.body.position.x, floors[this.currentFloor])) === 0;
    var zeroDistanceDown = Math.floor(arcade.distanceToXY(this, this.body.position.x, floors[this.currentFloor])) === 0;

    if (this.direction === 'up' && zeroDistanceUp) {
        if (this.currentFloor === 0) {
            this.direction = 'down';
        }
        this.body.velocity.y = 0;
        setTimeout(function () {
            this.isWaiting = false;
        }, 3000);
    } else if (this.direction === 'down' && zeroDistanceDown) {
        if (this.currentFloor === floors.length - 1) {
            this.direction = 'up';
        }
        this.body.velocity.y = 0;
        setTimeout(function () {
            this.isWaiting = false;
        }, 3000);
    }
};

Elevator.prototype.setPlayerOnElevator = function (elevator, player) {
    player.isInElevator = true;
    console.log("IS IN ELEVATOR");
};