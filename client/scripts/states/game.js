'use strict';

import Sprite from 'scripts/class/sprite';
import Player from 'scripts/class/player';
import Particules from 'scripts/class/particles';

class Game {
    create(game) {
        this.socket = io.connect(window.location.host);
        //this.socket = io.connect('10.12.181.36:3000');
        this.players = [];

        this.color = ['#999999', '#CCCCCC', '#00FF00', '#0000FF', '#FF0000', '#FFFF00'];
        game.physics.startSystem(Phaser.Physics.BOX2D);

        game.stage.backgroundColor = '#000';
        game.physics.box2d.restitution = 0.8;
        game.world.setBounds(0, 0, 5000, 5000);
        game.add.tileSprite(0, 0, game.world.width, game.world.height, 'grid');

        game.camera.bounds.setTo(-game.width/2, -game.height/2, game.world.width + game.width, game.world.height + game.height);

        this.particules = game.add.group();
        this.particules.enableBody = true;
        this.particules.physicsBodyType = Phaser.Physics.BOX2D;

        this.setEventHandlers(game);
    }

    setEventHandlers(game){
        this.socket.on("connect", (data) => {
            this.player = new Player(game, this.socket);
            this.player.sprite.bringToTop();
            game.camera.follow(this.player.sprite);
            this.socket.emit('login', this.player.toJson());

            this.socket.on("getParticules", (particles) => {
                for (var particle of particles) {
                    new Particules(game, particle, this.particules);
                }
            });

            this.socket.on("update_particles", (particle) => {
                console.log(this.particules.children.length)
                console.log(this.particules.children[particle.id].id);

                this.particules.children.filter(function(item) {
                    if(item.id === particle.id){
                        item.body.destroy();
                        item.destroy();
                        return;
                    }
                });

                new Particules(game, particle, this.particules);
            });
        });
    }

    /*login(game){
        var color = this.color[game.rnd.integerInRange(0, 5)];
        var bmd = game.add.bitmapData(50,50);

        // Draw circle
        bmd.ctx.fillStyle = color;
        bmd.ctx.beginPath();
        bmd.ctx.arc(25, 25, 25, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();

        // Put BitmapData in a Sprite
        this.player = new Sprite(game.add.sprite(game.world.randomX, game.world.randomY, bmd));

        // Define attribute
        this.player.username = 'Ghota';
        this.player.speed = 10;
        this.player.mass = 5;
        this.player.color = color;

        game.physics.box2d.enable(this.player.sprite);
        game.camera.follow(this.player.sprite);

        console.log('Connexion ...');
        this.socket.emit('login', this.player.toString());

        this.socket.on('logged', (user, particles) => {
            this.player.id = user.id;

            for (var particle of particles) {
                this.createParticle(particle);
            }
            console.log('Connexion réussi');
        });

        this.socket.on('emitPlayer', (user) => {
            if(this.players[user.id]){
                this.players[user.id].fromObj(user);
            }
        });

        this.socket.on('logout', (user) => {
            this.players[user.id].sprite.destroy();
            delete this.players[user.id];
        });


        this.socket.on('newUser', (player) => {
            var bmd = game.add.bitmapData(50,50);

            // Draw circle
            bmd.ctx.fillStyle = player.color;
            bmd.ctx.beginPath();
            bmd.ctx.arc(25, 25, 25, 0, Math.PI*2, true);
            bmd.ctx.closePath();
            bmd.ctx.fill();
            this.players[player.id] = new Sprite(game.add.sprite(player.x, player.y, bmd));

            // Define attribute
            this.players[player.id].username = player.username;
            this.players[player.id].speed = player.speed;
            this.players[player.id].mass = player.mass;
            this.players[player.id].color = player.color;

            //game.physics.box2d.enable(this.players[player.id].sprite);
            //this.players[player.id].sprite.body.static = true;
            //this.players[player.id].sprite.body.setCircle(this.players[player.id].width / 2);
            //this.players[player.id].sprite.body.setCollisionCategory(3);
            console.log('New user');
        });
    }*/


    update(game) {
        if (this.player) {
            this.player.update(game);
            game.debug.text('speed: '+ this.player.speed, 32, 120);
            game.debug.text('mass:'+ this.player.mass, 32, 150);
            game.physics.arcade.moveToPointer(this.player.sprite, this.player.speed);
        }

        game.debug.box2dWorld();
        game.debug.cameraInfo(game.camera, 32, 32);
    }

    render(game) {
        //this.socket.emit('myPlayer', this.player.toString());
    }
}

export default Game;
