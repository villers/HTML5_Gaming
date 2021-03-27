import { io } from "socket.io-client";

import Enemy from "../entity/enemy";
import Player from "../entity/player";
import Particules from "../entity/particles";

class Game extends Phaser.Stage {
  create() {
    this.socket = io.connect(window.location.host);
    this.players = [];
    this.particules = [];

    this.color = [
      "#999999",
      "#CCCCCC",
      "#00FF00",
      "#0000FF",
      "#FF0000",
      "#FFFF00",
    ];

    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.setImpactEvents(true);
    this.game.physics.p2.restitution = 0.8;

    this.game.stage.backgroundColor = "#000";
    this.game.world.setBounds(0, 0, 5000, 5000);
    this.game.add.tileSprite(
      0,
      0,
      this.game.world.width,
      this.game.world.height,
      "grid"
    );

    this.game.camera.bounds.setTo(
      -this.game.width / 2,
      -this.game.height / 2,
      this.game.world.width + this.game.width,
      this.game.world.height + this.game.height
    );

    const groupPlayer = this.game.physics.p2.createCollisionGroup();
    const groupPlayers = this.game.physics.p2.createCollisionGroup();
    const groupParticule = this.game.physics.p2.createCollisionGroup();
    this.groupColision = [groupPlayer, groupPlayers, groupParticule];
    this.game.physics.p2.updateBoundsCollisionGroup();

    this.groupParticules = this.game.add.group();
    this.groupParticules.enableBody = true;
    this.groupParticules.physicsBodyType = Phaser.Physics.P2JS;

    this.groupEnemy = this.game.add.group();
    this.groupEnemy.enableBody = true;
    this.groupEnemy.physicsBodyType = Phaser.Physics.P2JS;

    this.setEventHandlers(this.game);
  }

  setEventHandlers() {
    this.socket.on("connect", () => {
      this.player = new Player(this.game, this.socket, this.groupColision);
      this.socket.emit("new_player", this.player.toJson());

      // particules
      this.socket.on("getParticules", (particles) => {
        for (let particle of particles) {
          this.particules[particle.id] = new Particules(
            this.game,
            particle,
            this.groupColision
          );
        }
      });

      this.socket.on("update_particles", (particle) => {
        this.particules[particle.id].move(particle);
      });

      // new player
      this.socket.on("new_player", (enemy) => {
        this.players[enemy.id] = new Enemy(
          this.game,
          enemy,
          this.groupColision
        );
      });

      // Player
      this.socket.on("move_player", (enemy) => {
        if (this.players[enemy.id]) {
          this.players[enemy.id].move(enemy);
        }
      });

      this.socket.on("kill_player", (user) => {
        if (this.player.id === user.id) {
          this.player.sprite.kill();
          this.player.x = this.game.world.randomX;
          this.player.y = this.game.world.randomY;
          this.player.mass = 20;
          this.player.generateSprite();
        }
      });

      this.socket.on("logout", (id) => {
        this.players[id].sprite.kill();
        delete this.players[id];
      });
    });
  }

  update() {
    if (this.player) {
      this.player.update(this.game);
    }

    this.game.debug.cameraInfo(this.game.camera, 32, 32);
    this.game.debug.text("fps: " + this.game.time.fps || "--", 32, 140);
  }
}

export default Game;
