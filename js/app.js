
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});
function preload() {
    game.load.image('sky', 'images/sky.png');
    game.load.image('building-bg', 'images/building-bg.png');
    game.load.image('ground', 'images/platform.png');
    game.load.image('elevator', 'images/elevator.png');
    game.load.image('wall', 'images/wall.png');
    game.load.spritesheet('player', 'images/player.png', 19, 51);

    game.load.script('player.js', 'js/player.js');
    game.load.script('controls.js', 'js/controls.js');
    game.load.script('elevator.js', 'js/elevator.js');
}

var player;
var controls;
var elevators = [];
var platforms;
var background;
var score = 0;
var scoreText;
var FLOOR_HEIGHT = 120;


function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 1500, 4000);
    createLevel();
    createPlayer();

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
    controls = new Controls(game, player);

}

function update() {
    controls.update();
    player.update(platforms);
    for (var i = 0; i < elevators.length; i++) {
        elevators[i].update();
    }
}

function createLevel() {

    //  A simple background for our game
    background = game.add.sprite(0, 0, 'sky');
    background.scale.setTo(1.875, 7);
    //building bg
    var top10FloorsBg = game.add.sprite(470, 100, 'building-bg');
    top10FloorsBg.scale.setTo(56, 110);

    var bottom20FloorsBg = game.add.sprite(220, 10 * FLOOR_HEIGHT, 'building-bg');
    bottom20FloorsBg.scale.setTo(110, 228);

//  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
    //  We will enable physics for any object that is created in this group
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
        createGround(470, y, 2.5);
        if (i < 9) {
            createWalls(470, y);//left
            createWalls(1030, y);//right
        }
        //right
        createGround(780, y, 2.5);
        lastY = y;
    }

    //next 20 floors are wider

    for (var i = 0; i < 20; i++) {
        var y = lastY + (i * FLOOR_HEIGHT);
        //left
        createGround(210, y, 5.1);
        if (i < 9) {
            createWalls(210, y);//left
            createWalls(1300, y);//right
        }
        //right
        createGround(780, y, 5.3);
    }
    createElevators();
}

function createWalls(x, y) {
    var wall = platforms.create(x, y, 'wall');
    wall.scale.setTo(1, 1.3);
    wall.body.immovable = true;
}

function createGround(x, y, width) {
    ground = platforms.create(x, y, 'ground');
    ground.scale.setTo(width, 1);
    ground.body.immovable = true;
}

function createPlayer() {
    player = new Player(game, 500, 500);
}

function createElevators() {
    elevators.push(new Elevator(game, platforms, 720, 100, FLOOR_HEIGHT, 10));
}
