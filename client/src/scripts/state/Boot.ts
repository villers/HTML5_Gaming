/// <reference path="../typings/tsd.d.ts"/>

module html5gaming.State {
  export class Boot extends Phaser.State {
    preload() {
      this.load.image('preload-bar', 'assets/images/preloader.gif');
    }

    create() {
      this.game.stage.backgroundColor = 0xFFFFFF;

      this.input.maxPointers = 1;
      this.stage.disableVisibilityChange = true;

      this.game.state.start('preload');
    }
  }
}
