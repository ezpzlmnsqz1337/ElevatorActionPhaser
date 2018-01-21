function Level1(game) {

    this.game = game;
    this.platforms = game.add.group();
    this.elevators = [];
    this.doors = [];
}

Level1.prototype.create = function () {
    var game = this.game;
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
        this.createGround(470, y, 2.5);
        if (i < 9) {
            this.createWalls(470, y); //left
            this.createWalls(1030, y); //right
        }
        //right
        this.createGround(780, y, 2.5);
        lastY = y;
    }

    //next 20 floors are wider
    for (var i = 0; i < 20; i++) {
        var y = lastY + (i * FLOOR_HEIGHT);
        //left
        this.createGround(210, y, 5.1);
        if (i < 9) {
            this.createWalls(210, y); //left
            this.createWalls(1300, y); //right
        }
        //right
        this.createGround(780, y, 5.3);
    }

    this.createElevators();
    this.createDoors();
};

Level1.prototype.update = function () {
    var elevators = this;
    for (var i = 0; i < elevators.length; i++) {
        elevators[i].update();
    }
};

Level1.prototype.createBackground = function (x, y) {
    var game = this.game;
    //  A simple background for our game
    this.background = game.add.sprite(0, 0, 'sky');
    this.background.scale.setTo(1.875, 7);
    //building bg
    var top10FloorsBg = game.add.sprite(470, 100, 'building-bg');
    top10FloorsBg.scale.setTo(56, 110);
    var bottom20FloorsBg = game.add.sprite(220, 10 * FLOOR_HEIGHT, 'building-bg');
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

Level1.prototype.createDoors = function () {
    var game = this.game;
    var doors = this.doors;
    doors.push(new Door(game, 500, 500, 'red', 'left'));
    doors[0].open();
};

Level1.prototype.createElevators = function () {
    var game = this.game;
    var elevators = this.elevators;
    var platforms = this.platforms;

    elevators.push(new Elevator(game, platforms, 720, 100, FLOOR_HEIGHT, 10));
};
