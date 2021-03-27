import Boot from "./states/boot";
import Preload from "./states/preload";
import Menu from "./states/menu";
import Game from "./states/game";

class Games extends Phaser.Game {
  constructor() {
    super({
      width:
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth,
      height:
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight,
      transparent: false,
      enableDebug: true,
    });

    this.state.add("boot", Boot);
    this.state.add("preload", Preload);
    this.state.add("menu", Menu);
    this.state.add("game", Game);

    this.state.start("boot");
  }
}

new Games();
