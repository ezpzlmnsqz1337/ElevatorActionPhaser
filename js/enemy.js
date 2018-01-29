function Enemy(x,y){
    // The player and its settings
    this.sprite = game.add.sprite(x, y, 'enemy');
    game.physics.arcade.enable(this.sprite);
    this.sprite.body.gravity.y = 1200;
    this.sprite.body.bounce.y = 0;


    this.speed = 80;

    // set up animations
    //stand still
    this.sprite.animations.add('left', [0], 10, false);
    this.sprite.animations.add('right', [1], 10, false);
    //walk
    this.sprite.animations.add('go-left', [12, 14], 10, true);
    this.sprite.animations.add('go-right', [13, 15], 10, true);
    //shoot
    this.sprite.animations.add('shoot-left', [6], 1, false);
    this.sprite.animations.add('shoot-right', [7], 1, false);
    //duck
    this.sprite.animations.add('duck-left', [4], 1, false);
    this.sprite.animations.add('duck-right', [5], 1, false);
    //duck shoot
    this.sprite.animations.add('duck-shoot-left', [10], 1, false);
    this.sprite.animations.add('duck-shoot-right', [11], 1, false);
    //jump
    this.sprite.animations.add('jump-left', [2], 1, false);
    this.sprite.animations.add('jump-right', [3], 1, false);
    //jump shoot
    this.sprite.animations.add('jump-shoot-left', [8], 1, false);
    this.sprite.animations.add('jump-shoot-right', [9], 1, false);
}

Enemy.prototype.update = function(platforms){
	var sprite = this.sprite;

	var x = sprite.position.x;
	var px = player.sprite.position.x;

    game.physics.arcade.collide(sprite, platforms);
    game.physics.arcade.overlap(sprite, player, this.colision, null, this);

	if ( x < px + 40 ) {
		sprite.body.velocity.x = this.speed;
		sprite.animations.play('go-right');
	} else if( x - 40 > px ) {
		sprite.body.velocity.x = -this.speed;
		sprite.animations.play('go-left');
	}
}

Enemy.prototype.colision = function(enemy, player){
	console.log(player.isJumping);
	if(player.isJumping){
		enemy.kill();
	}
}

Enemy.prototype.die = function(){
	var sprite = this.sprite;
}