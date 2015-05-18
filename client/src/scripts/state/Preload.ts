/// <reference path="../typings/tsd.d.ts"/>

module html5gaming.State {
  export class Preload extends Phaser.State {
    private preloadBar:Phaser.Sprite;

    preload() {
      this.preloadBar = this.add.sprite(290, 290, 'preload-bar');
      this.load.setPreloadSprite(this.preloadBar);
    }

    create() {
      this.game.state.start('main');
    }
  }
}
