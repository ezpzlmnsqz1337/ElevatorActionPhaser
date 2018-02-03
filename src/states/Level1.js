import Phaser from 'phaser'
import Door from '../sprites/Door'
import Elevator from '../sprites/Elevator'
import Player from '../sprites/Player'
import Enemy from '../sprites/Enemy'
import Controls from '../Controls'
import d from '../dimensions'

export default class Level1 extends Phaser.State {

    init() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 1280, 3600);

        this.maxEnemies = 10
        this.background = game.add.group()
        this.doors = game.add.group()
        this.mainGroup = game.add.group()
        this.platforms = game.add.group()
        this.bullets = []
        this.enemies = []
        this.player = new Player({ game: this.game, x: 500, y: 0 })
        this.mainGroup.add(this.player)
        this.controls = new Controls({ game: this.game, player: this.player })
        this.elevators = []

    }

    preload() {

    }

    create() {
        this.createBackground()
        this.platforms.enableBody = true
        // Here we create the ground.
        let ground = this.platforms.create(0, game.world.height - 15, 'ground')
        ground.scale.setTo(15, 2)
        //  This stops it from falling away when you jump on it
        ground.body.immovable = true
        //floors
        //first 10 floors
        let lastY = 0
        for (let i = 0; i < 9; i++) {
            let y = 100 + (i * d.FLOOR_HEIGHT)
            //left
            this.createGround(d.LEFT_GROUND_X, y, 2.9)
            this.createWalls(d.LEFT_WALL_X, y) //left
            this.createWalls(d.RIGHT_WALL_X - 20, y) //right
            let doorY = y + 60
            //create doors
            this.createDoors(doorY)
            //right
            this.createGround(d.RIGHT_GROUND_X, y, 2.9)
            lastY = y
            //next 20 floors are wider
            lastY = lastY + d.FLOOR_HEIGHT
            for (let i = 0; i < 20; i++) {
                let y = lastY + (i * d.FLOOR_HEIGHT)
                //left
                this.createGround(d.LEFT_WALL_X20, y, 6.1)
                if (i < 19) {
                    this.createWalls(d.LEFT_WALL_X20, y) //left
                    this.createWalls(d.RIGHT_WALL_X20 - 20, y) //right
                }
                //right
                this.createGround(d.RIGHT_GROUND_X, y, 6.1)
            }

        }
        this.createElevators()
        this.createEnemy()
    }

    update() {
        this.controls.update();
    }

    createBackground() {
        let background = this.background
        //  A simple background for our game
        let sky = background.create(0, 0, 'sky')
        sky.scale.setTo(2, 7)
        //building bg
        let top10FloorsBg = background.create(d.LEFT_WALL_X, 100, 'building-bg')
        top10FloorsBg.scale.setTo(64, 110)
        let bottom20FloorsBg = background.create(d.LEFT_WALL_X20, 10 * d.FLOOR_HEIGHT, 'building-bg')
        bottom20FloorsBg.scale.setTo(128, 228)
    }

    createWalls(x, y) {
        let wall = this.platforms.create(x, y, 'wall')
        wall.scale.setTo(1, 1.3)
        wall.body.immovable = true
    }

    createDoors(doorY) {
        this.doors.add(new Door({ game: this.game, x: d.LEFT_GROUND_X + 90, y: doorY, color: 'blue', direction: 'left' }))
        this.doors.add(new Door({ game: this.game, x: d.LEFT_GROUND_X + 175, y: doorY, color: 'blue', direction: 'left' }))
        this.doors.add(new Door({ game: this.game, x: d.RIGHT_GROUND_X + 80, y: doorY, color: 'blue', direction: 'right' }))
        this.doors.add(new Door({ game: this.game, x: d.RIGHT_GROUND_X + 165, y: doorY, color: 'blue', direction: 'right' }))
    }

    createGround(x, y, width) {
        let ground = this.platforms.create(x, y, 'ground')
        ground.scale.setTo(width, 1)
        ground.body.immovable = true
    }

    createElevators() {
        console.log(this.elevators)
        this.elevators.push(new Elevator({ game: this.game, x: 610, y: 100, floors: 10 }))
        console.log(this.elevators)
    }

    createEnemy() {
        setInterval(() => {
            if (this.enemies.length < this.maxEnemies) {
                let doors = this.doors;

                let i = Math.floor(Math.random() * (doors.length - 0 + 1));

                let door = doors.getAt(i);

                this.enemies.push(new Enemy({ game: this.game, x: door.position.x, y: door.position.y }));
                door.open();
            }
        }, 3000);
    }
}