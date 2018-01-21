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