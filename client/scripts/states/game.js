'use strict';

import Enemy from 'scripts/class/enemy';
import Player from 'scripts/class/player';
import Particules from 'scripts/class/particles';

class Game {
    create(game) {
        this.socket = io.connect(window.location.host);
        //this.socket = io.connect('10.12.181.36:3000');
        this.players = [];

        this.color = ['#999999', '#CCCCCC', '#00FF00', '#0000FF', '#FF0000', '#FFFF00'];

        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0.8;

        game.stage.backgroundColor = '#000';
        game.world.setBounds(0, 0, 5000, 5000);
        game.add.tileSprite(0, 0, game.world.width, game.world.height, 'grid');

        game.camera.bounds.setTo(-game.width/2, -game.height/2, game.world.width + game.width, game.world.height + game.height);

        var groupPlayer = game.physics.p2.createCollisionGroup();
        var groupPlayers = game.physics.p2.createCollisionGroup();
        var groupParticule = game.physics.p2.createCollisionGroup();
        this.groupColision = [groupPlayer, groupPlayers, groupParticule];
        game.physics.p2.updateBoundsCollisionGroup();

        this.groupParticules = game.add.group();
        this.groupParticules.enableBody = true;
        this.groupParticules.physicsBodyType = Phaser.Physics.P2JS;

        this.groupEnemy = game.add.group();
        this.groupEnemy.enableBody = true;
        this.groupEnemy.physicsBodyType = Phaser.Physics.P2JS;

        this.setEventHandlers(game);
    }

    setEventHandlers(game){
        this.socket.on('connect', (data) => {
            this.player = new Player(game, this.socket, this.groupColision);
            this.socket.emit('new_player', this.player.toJson());

            // particules
            this.socket.on('getParticules', (particles) => {
                for (var particle of particles) {
                    new Particules(game, particle, this.groupColision, this.groupParticules);
                }
            });

            this.socket.on('update_particles', (particle) => {
                this.groupParticules.children.filter(function(item) {
                    if(item.id === particle.id){
                        item.kill();
                        return;
                    }
                });
                new Particules(game, particle, this.groupColision, this.groupParticules);
            });

            // new player
            this.socket.on('new_player', (enemy) => {
                new Enemy(game, enemy, this.groupColision, this.groupEnemy);
            });

            // Player
            this.socket.on('move_player', (enemy) => {
                this.groupEnemy.children.filter(function(item) {
                    if(item.id === enemy.id){
                        item.kill();
                        return;
                    }
                });
                new Enemy(game, enemy, this.groupColision, this.groupEnemy);
            });

            this.socket.on('kill_player', (user) => {
                if(this.player.id == user.id) {
                    this.player.generateSprite();
                }

            });

            this.socket.on('logout', (id) => {
                this.groupEnemy.children.filter(function(item) {
                    if(item.id === id){
                        item.kill();
                    }
                });
            });
        });
    }

    update(game) {
        if (this.player) {
            game.physics.arcade.moveToPointer(this.player.sprite, this.player.sprite.speed);
            game.debug.text('speed: ' + this.player.sprite.speed, 32, 120);
            game.debug.text(this.player.sprite.mass, this.player.sprite.x - game.camera.x - 10, this.player.sprite.y - game.camera.y+ 5);
        }

        game.debug.cameraInfo(game.camera, 32, 32);

    }

    render(game) {
        if (this.player) {
            this.player.render(game);
        }
    }
}

export default Game;
