'use strict';

class Boot {
    preload() {
        this.load.image('preloader', 'assets/preloader.gif');
    }

    create() {
        this.game.stage.backgroundColor = "#000";
        this.game.state.start('preload');
    }
}

export default Boot;
