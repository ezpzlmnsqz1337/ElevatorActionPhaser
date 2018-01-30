var LEFT_WALL_X = 320;
var LEFT_WALL_X20 = 0;

var LEFT_GROUND_X = 320;
var RIGHT_GROUND_X = 670;
var RIGHT_WALL_X = 960;
var RIGHT_WALL_X20 = 1280;


function Level1() {
    this.platforms = game.add.group();
    platforms = this.platforms;
    this.background = game.add.group();
    this.elevators = [];
    this.doors = [];
}

Level1.prototype.create = function () {
    var platforms = this.platforms;

    //this.createBackground();
    platforms.enableBody = true;
    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 15, 'ground');
    ground.scale.setTo(15, 2);
    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;
    //floors
    //first 10 floors
    var lastY = 0;
    for (var i = 0; i < 9; i++) {
        var y = 100 + (i * FLOOR_HEIGHT);
        //left
        this.createGround(LEFT_GROUND_X, y, 2.9);
        this.createWalls(LEFT_WALL_X, y); //left
        this.createWalls(RIGHT_WALL_X - 20, y); //right
        var doorY = y + 60;
        //create doors
        this.doors.push(new Door(LEFT_GROUND_X + 90, doorY, 'blue', 'left'));
        this.doors.push(new Door(LEFT_GROUND_X + 175, doorY, 'blue', 'left'));
        this.doors.push(new Door(RIGHT_GROUND_X + 80, doorY, 'blue', 'right'));
        this.doors.push(new Door(RIGHT_GROUND_X + 165, doorY, 'blue', 'right'));
        //right
        this.createGround(RIGHT_GROUND_X, y, 2.9);
        lastY = y;
    }

    //next 20 floors are wider
    lastY = lastY + FLOOR_HEIGHT;
    for (var i = 0; i < 20; i++) {
        var y = lastY + (i * FLOOR_HEIGHT);
        //left
        this.createGround(LEFT_WALL_X20, y, 6.1);
        if (i < 19) {
            this.createWalls(LEFT_WALL_X20, y); //left
            this.createWalls(RIGHT_WALL_X20 - 20, y); //right
        }
        //right
        this.createGround(RIGHT_GROUND_X, y, 6.1);
    }

    this.createElevators();
};

Level1.prototype.update = function () {
    var elevators = this.elevators;
    for (var i = 0; i < elevators.length; i++) {
        elevators[i].update();
    }
};

Level1.prototype.createBackground = function () {
    var background = this.background;
    //  A simple background for our game
    var sky = background.create(0, 0, 'sky');
    sky.scale.setTo(2, 7);
    //building bg
    var top10FloorsBg = background.create(LEFT_WALL_X, 100, 'building-bg');
    top10FloorsBg.scale.setTo(64, 110);
    var bottom20FloorsBg = background.create(LEFT_WALL_X20, 10 * FLOOR_HEIGHT, 'building-bg');
    bottom20FloorsBg.scale.setTo(128, 228);
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

    elevators.push(new Elevator(platforms, 610, 100, FLOOR_HEIGHT, 10));
};
