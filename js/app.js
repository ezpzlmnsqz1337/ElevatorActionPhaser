
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});
function preload() {
    game.load.image('sky', 'images/sky.png');
    game.load.image('ground', 'images/platform.png');
    game.load.image('elevator', 'images/elevator.png');
    game.load.image('wall', 'images/wall.png');
    game.load.image('star', 'images/star.png');
    game.load.spritesheet('player', 'images/player.png', 19, 51);
}

var player;
var platforms;
var background;
var cursors;
var stars;
var score = 0;
var scoreText;
function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 1500, 4000);
    //  A simple background for our game
    background = game.add.sprite(0, 0, 'sky');
    background.scale.setTo(1.875, 7);
    createLevel();
    createPlayer();
    createElevators();

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    game.camera.follow(player);
}

function update() {
    //  Collisions
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    if (player.body.touching.down && hitPlatform) {
        player.isJumping = false;
        if (!cursors.left.isDown && !cursors.right.isDown) {
            player.animations.play(player.orientation);
        }
    }

    if (cursors.left.isDown) {
        player.orientation = 'left';
        if (player.isDucking) {
            player.animations.play('duck-' + player.orientation);
        } else if (player.isJumping) {
            //  Move to the right
            player.body.velocity.x = -player.speed;
            player.animations.play('jump-' + player.orientation);
        } else {
            //  Move to the right
            player.body.velocity.x = -player.speed;
            player.animations.play('go-' + player.orientation);
        }
    }
    if (cursors.right.isDown) {
        player.orientation = 'right';
        if (player.isDucking) {
            player.animations.play('duck-' + player.orientation);
        } else if (player.isJumping) {
            //  Move to the right
            player.body.velocity.x = player.speed;
            player.animations.play('jump-' + player.orientation);
        } else {
            //  Move to the right
            player.body.velocity.x = player.speed;
            player.animations.play('go-' + player.orientation);
        }
    }
    if (cursors.down.isDown && player.body.touching.down && hitPlatform) {
        //  Ducking left
        player.isDucking = true;
        player.animations.play('duck-' + player.orientation);

    }
    if (cursors.up.isDown) {
        if (player.isDucking) {
            player.isDucking = false;
            player.animations.play(player.orientation);
        } else if (player.body.touching.down && hitPlatform && !player.isDucking) {
            player.isJumping = true;
            player.body.velocity.y = -player.jumpSpeed;
            player.animations.play('jump-' + player.orientation);
        }
    }

    if (player.isJumping) {
        //in jump
        player.animations.play('jump-' + player.orientation);
    }
    if (player.isDucking) {
        //in duck
        player.animations.play('duck-' + player.orientation);
    }
}

function createLevel() {
    var FLOOR_HEIGHT = 120;

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
    for (var i = 100; i < 4000; i = i + FLOOR_HEIGHT) {
        //left
        var wall = platforms.create(470, i, 'wall');
        wall.body.immovable = true;
        wall.scale.setTo(1, 1.5);
        ground = platforms.create(470, i, 'ground');
        ground.scale.setTo(2.5, 1);
        ground.body.immovable = true;

        //right
        wall = platforms.create(1030, i, 'wall');
        wall.body.immovable = true;
        wall.scale.setTo(1, 1.5);
        ground = platforms.create(780, i, 'ground');
        ground.scale.setTo(2.5, 1);
        ground.body.immovable = true;
    }

}

function createPlayer() {
// The player and its settings
    player = game.add.sprite(500, 5, 'player');
    player.orientation = 'left';
    player.isJumping = false;
    player.isDucking = false;
    player.speed = 150;
    player.lives = 2;
    player.jumpSpeed = 350;
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0;
    player.body.gravity.y = 1200;
    player.body.collideWorldBounds = true;

    //stand still
    player.animations.add('left', [0], 10, false);
    player.animations.add('right', [1], 10, false);
    //walk
    player.animations.add('go-left', [12, 14], 10, true);
    player.animations.add('go-right', [13, 15], 10, true);
    //shoot
    player.animations.add('shoot-left', [6, 0], 10, false);
    player.animations.add('shoot-right', [7, 1], 10, false);
    //duck
    player.animations.add('duck-left', [4], 10, false);
    player.animations.add('duck-right', [5], 10, false);
    //jump
    player.animations.add('jump-left', [2], 10, true);
    player.animations.add('jump-right', [3], 10, true);
}

function createElevators() {
    var elevator = platforms.create(720, 100, 'elevator');
    elevator.scale.setTo(0.6, 1);
    elevator.body.immovable = true;
    //setInterval(function () {
    game.physics.arcade.moveToXY(elevator, elevator.body.position.x, elevator.body.position.y + 10, 100, 100);
    console.log(elevator.body.position.y + 150);
    //}, 2000);
}
