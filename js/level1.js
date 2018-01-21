var LEFT_WALL_X = 310;
var LEFT_WALL_X20 = 0;

var LEFT_GROUND_X = 260;
var RIGHT_GROUND_X = 570;

var RIGHT_WALL_X = 820;
var RIGHT_WALL_X20 = 1300;

function Level1() {
    this.background = game.add.group();
    this.platforms = game.add.group();
    this.elevators = [];
    this.doors = [];
}

Level1.prototype.create = function () {
    var platforms = this.platforms;

    this.createBackground();
    platforms.enableBody = true;
    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 15, 'ground');
    ground.scale.setTo(15, 2);
    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;
    //floors
    //first 10 floors
    var lastY = 0;
    for (var i = 0; i < 10; i++) {
        var y = 100 + (i * FLOOR_HEIGHT);
        //left
        this.createGround(LEFT_GROUND_X, y, 2.5);
        if (i < 9) {
            this.createWalls(LEFT_WALL_X, y); //left
            this.createWalls(RIGHT_WALL_X - 20, y); //right
        }
        var doorY = y + 60;
        //create doors
        this.doors.push(new Door(LEFT_GROUND_X + 77, doorY, 'blue', 'left'));
        this.doors.push(new Door(LEFT_GROUND_X + 167, doorY, 'blue', 'left'));
        this.doors.push(new Door(RIGHT_GROUND_X + 47, doorY, 'blue', 'right'));
        this.doors.push(new Door(RIGHT_GROUND_X + 137, doorY, 'blue', 'right'));
        //right
        this.createGround(RIGHT_GROUND_X, y, 2.5);
        lastY = y;
    }

    //next 20 floors are wider
    for (var i = 0; i < 20; i++) {
        var y = lastY + (i * FLOOR_HEIGHT);
        //left
        this.createGround(LEFT_WALL_X20, y, 5.1);
        if (i < 20) {
            this.createWalls(LEFT_WALL_X20, y); //left
            this.createWalls(RIGHT_WALL_X20, y); //right
        }
        //right
        this.createGround(RIGHT_GROUND_X, y, 5.3);
    }

    this.createElevators();
};

Level1.prototype.update = function () {
    var elevators = this;
    for (var i = 0; i < elevators.length; i++) {
        elevators[i].update();
    }
};

Level1.prototype.createBackground = function () {
    var background = this.background;
    //  A simple background for our game
    var sky = background.create(0, 0, 'sky');
    sky.scale.setTo(1.875, 7);
    //building bg
    var top10FloorsBg = background.create(LEFT_WALL_X, 100, 'building-bg');
    top10FloorsBg.scale.setTo(56, 110);
    var bottom20FloorsBg = background.create(LEFT_WALL_X20, 10 * FLOOR_HEIGHT, 'building-bg');
    bottom20FloorsBg.scale.setTo(110, 228);
};

Level1.prototype.createWalls = function (x, y) {
    var platforms = this.platforms;

    var wall = platforms.create(x, y, 'wall');
    wall.scale.setTo(1, 1.3);
    wall.body.immovable = true;
};

Level1.prototype.createGround = function (x, y, width) {
    var platforms = this.platforms;

    var ground = platforms.create(x, y, 'ground');
    ground.scale.setTo(width, 1);
    ground.body.immovable = true;
};

Level1.prototype.createElevators = function () {
    var elevators = this.elevators;
    var platforms = this.platforms;

    elevators.push(new Elevator(platforms, 510, 100, FLOOR_HEIGHT, 10));
};
