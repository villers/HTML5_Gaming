class Preload extends Phaser.Stage {
  preload() {
    // Add preload sprite
    const tmpPreload = this.game.cache.getImage("preloader");
    this.loadingSprite = this.add.sprite(
      (this.game.width - tmpPreload.width) / 2,
      (this.game.height - tmpPreload.height) / 2,
      "preloader"
    );

    // run preload sprite
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.loadingSprite);

    // Load game assets here
    this.load.image("logo", "assets/logo.png");
    this.load.image("grid", "assets/grid.jpeg");

    this.game.time.advancedTiming = true;
  }

  onLoadComplete() {
    this.game.state.start("menu", true, false);
  }
}

export default Preload;
