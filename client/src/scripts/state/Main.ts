/// <reference path="../typings/tsd.d.ts"/>

module html5gaming.State {
  export class Main extends Phaser.State {

    create() {
      var thing:String = 'code !';
      this.add.text(10, 10, `Let's ${thing}`, { font: '65px Arial' });
    }
  }
}
