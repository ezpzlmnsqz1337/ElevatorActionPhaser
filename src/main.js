import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import MenuState from './states/Menu'
import Level1 from './states/Level1'

import config from './config'

class Game extends Phaser.Game {
    constructor() {
        const width = config.gameWidth
        const height = config.gameHeight

        super(width, height, Phaser.AUTO, 'content', null)

        this.state.add('Boot', BootState, false)
        this.state.add('Splash', SplashState, false)
        this.state.add('Menu', MenuState, false)
        this.state.add('Level1', Level1, false)

        // with Cordova with need to wait that the device is ready so we will call the Boot state in another file
        if (!window.cordova) {
            this.state.start('Boot')
        }
    }
}

window.game = new Game()

if (window.cordova) {
    var app = {
        initialize: function () {
            document.addEventListener(
                'deviceready',
                this.onDeviceReady.bind(this),
                false
            )
        },

        // deviceready Event Handler
        //
        onDeviceReady: function () {
            this.receivedEvent('deviceready')

            // When the device is ready, start Phaser Boot state.
            window.game.state.start('Boot')
        },

        receivedEvent: function (id) {
            console.log('Received Event: ' + id)
        }
    }

    app.initialize()
}
