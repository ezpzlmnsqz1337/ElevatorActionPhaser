var game = new Phaser.Game(1280, 720, Phaser.AUTO, '', {preload: preload, create: create, update: update});

function preload() {
    game.load.image('sky', 'images/sky.png');
    game.load.image('building-bg', 'images/building-bg.png');
    game.load.image('ground', 'images/platform.png');
    game.load.image('elevator', 'images/elevator.png');
    game.load.image('wall', 'images/wall.png');
    game.load.spritesheet('player', 'images/player.png', 19, 51);
    game.load.spritesheet('door', 'images/doors.png', 35, 67);
    game.load.spritesheet('bullet', 'images/bullet.png', 5, 2);

    game.load.script('level1.js', 'js/level1.js');
    game.load.script('player.js', 'js/player.js');
    game.load.script('controls.js', 'js/controls.js');
    game.load.script('elevator.js', 'js/elevator.js');
    game.load.script('door.js', 'js/door.js');
    game.load.script('bullet.js', 'js/bullet.js');
}

var FLOOR_HEIGHT = 120;

var player;
var controls;
var level1;
var score = 0;
var scoreText;


function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 1280, 4000);
    createLevel();
    createPlayer();

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
    controls = new Controls(game, player);
}

function update() {
    controls.update();
    player.update(level1.platforms);
    level1.update();
}

function createLevel() {
    level1 = new Level1();
    level1.create();
}

function createPlayer() {
    player = new Player(500, 0);
}