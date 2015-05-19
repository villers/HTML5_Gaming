import Boot from 'scripts/states/boot';
import Preload from 'scripts/states/preload';
import Menu from 'scripts/states/menu';
import Game from 'scripts/states/game';

class Games extends Phaser.Game {
    constructor() {
        super({
            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
            transparent: false,
            enableDebug: true
        });

        this.state.add('boot', Boot);
        this.state.add('preload', Preload);
        this.state.add('menu', Menu);
        this.state.add('game', Game);

        this.state.start('boot');
    }
}

export default Games;
