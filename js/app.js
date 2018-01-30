'use strict';
var game = new Phaser.Game(1280, 720, Phaser.AUTO, '', {preload: preload, create: create, update: update});

function preload() {
    game.load.image('sky', 'images/sky.png');
    game.load.image('building-bg', 'images/building-bg.png');
    game.load.image('ground', 'images/platform.png');
    game.load.image('elevator', 'images/elevator.png');
    game.load.image('wall', 'images/wall.png');
    game.load.spritesheet('player', 'images/player.png', 19, 51);
    game.load.spritesheet('enemy', 'images/enemy.png', 19, 51);
    game.load.spritesheet('door', 'images/doors.png', 35, 67);
    game.load.spritesheet('bullet', 'images/bullet.png', 5, 2);

    game.load.script('level1.js', 'js/level1.js');
    game.load.script('player.js', 'js/player.js');
    game.load.script('enemy.js', 'js/enemy.js');
    game.load.script('controls.js', 'js/controls.js');
    game.load.script('elevator.js', 'js/elevator.js');
    game.load.script('door.js', 'js/door.js');
    game.load.script('bullet.js', 'js/bullet.js');
}

var FLOOR_HEIGHT = 120;

var player;
var controls;
var platforms;
var level1;
var enemies = [];
var score = 0;
var scoreText;
var maxEnemies = 10;


function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 1280, 3600);
    createLevel();
    createPlayer();
    createEnemy();

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
    controls = new Controls(game);
}

function update() {
    controls.update();
    level1.update();
    for (var i = 0; i < enemies.length; i++) {
        //enemies[i].update(platforms);
    }
}

function createLevel() {
    level1 = new Level1();
    level1.create();
}

function createPlayer() {
    player = new Player(game, 500, 0);
}

function createEnemy() {
    setInterval(function () {
        if (enemies.length < maxEnemies) {
            var doors = level1.doors;

            var i = Math.floor(Math.random() * (doors.length - 0 + 1));
            //get random doors
            console.log(i);
            var door = doors[i];
            console.log(door);

            enemies.push(new Enemy(game, door.position.x, door.position.y));
            door.open();
        }
    }, 3000);
}