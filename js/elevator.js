function Elevator(game, platforms, x, y, floorHeight, floors) {
    this.game = game;
    this.sprite = platforms.create(x, y, 'elevator');
    this.sprite.scale.setTo(0.6, 1);
    this.sprite.body.immovable = true;

    this.direction = 'down';
    this.floors = [];
    for (var i = 0; i < floors; i++) {
        this.floors.push(y + (i * floorHeight));
    }
    this.currentFloor = 0;
    this.isWaiting = false;
}

Elevator.prototype.move = function (direction) {
    var elevator = this;
    var sprite = this.sprite;
    var floors = this.floors;
    var arcade = this.game.physics.arcade;

    if (direction === 'up') {
        elevator.direction = direction;
        elevator.nextFloor = elevator.currentFloor - 1 > 0 ? elevator.currentFloor - 1 : 0;
        arcade.moveToXY(sprite, sprite.body.position.x, floors[elevator.nextFloor], 100);
        elevator.currentFloor = elevator.nextFloor;
    } else if (direction === 'down') {
        elevator.direction = direction;
        elevator.nextFloor = elevator.currentFloor + 1 < floors.length ? elevator.currentFloor + 1 : floors.length - 1;
        arcade.moveToXY(sprite, sprite.body.position.x, floors[elevator.nextFloor], 100);
        elevator.currentFloor = elevator.nextFloor;
    }
};

Elevator.prototype.update = function () {
    var elevator = this;
    var sprite = this.sprite;
    var floors = this.floors;
    var arcade = this.game.physics.arcade;

    //console.log(arcade.distanceToXY(sprite, sprite.body.position.x, floors[elevator.currentFloor]));
    //console.log(elevator.currentFloor);

    // handle the elevator in a floor,wait
    if (!elevator.isWaiting) {
        //stay in current direction
        elevator.isWaiting = true;
        elevator.move(elevator.direction);
    }
    //elevator
    var zeroDistanceUp = Math.floor(arcade.distanceToXY(sprite, sprite.body.position.x, floors[elevator.currentFloor])) === 0;
    var zeroDistanceDown = Math.floor(arcade.distanceToXY(sprite, sprite.body.position.x, floors[elevator.currentFloor])) === 0;

    if (elevator.direction === 'up' && zeroDistanceUp) {
        if (elevator.currentFloor === 0) {
            elevator.direction = 'down';
        }
        sprite.body.velocity.y = 0;
        setTimeout(function () {
            elevator.isWaiting = false;
        }, 3000);
    } else if (elevator.direction === 'down' && zeroDistanceDown) {
        if (elevator.currentFloor === floors.length - 1) {
            elevator.direction = 'up';
        }
        sprite.body.velocity.y = 0;
        setTimeout(function () {
            elevator.isWaiting = false;
        }, 3000);
    }
};