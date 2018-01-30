function Bullet(game, x, y, direction) {
    this.speed = 300;

    this.sprite = game.add.sprite(x, y, 'bullet');
    game.physics.arcade.enable(this.sprite);
    this.sprite.body.immovable = true;
    if (direction === 'left') {
        this.sprite.body.velocity.x = -this.speed;
    } else {
        this.sprite.body.velocity.x = this.speed;
    }
}

Bullet.prototype.remove = function(bullet, platforms){
	bullet.kill();
}

Bullet.prototype.update = function(platforms){
	var sprite = this.sprite;

    //game.physics.arcade.collide(sprite, platforms);
    game.physics.arcade.overlap(sprite, platforms, this.remove, null, this);

	console.log(enemies);
    for (var i = 0; i < enemies.length; i++) {
    	game.physics.arcade.overlap(sprite, enemies[i].sprite, this.removeEnemey, null, this);
    }
}

Bullet.prototype.removeEnemey = function(bullet, enemy){
	bullet.kill();
	enemy.animations.play('jump-left');
	setTimeout( function() {
		enemy.kill(), 1000
	});
}