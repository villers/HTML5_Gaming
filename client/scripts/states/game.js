'use strict';

import Sprite from 'scripts/class/sprite';

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

        this.login(game);

        game.camera.bounds.setTo(-game.width/2, -game.height/2, game.world.width + game.width, game.world.height + game.height);

        this.particules = game.add.group();
        this.particules.enableBody = true;
        this.particules.physicsBodyType = Phaser.Physics.BOX2D;

        this.player.sprite.body.setCategoryContactCallback(2, this.particulesCallback, this);
        this.player.sprite.body.setCategoryContactCallback(3, this.enemyCallback, this);
    }

    login(game){
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
    }

    createParticle(particules){
        var game = this.game;
        var bmd = game.add.bitmapData(20,20);

        // Draw circle
        bmd.ctx.fillStyle = particules.color;
        bmd.ctx.beginPath();
        bmd.ctx.arc(10, 10, 10, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();

        // Put BitmapData in a Sprite
        var sprite = this.particules.create(particules.x, particules.y, bmd);

        // Define attribute
        sprite.mass = 1;
        sprite.body.static = true;
        sprite.body.setCircle(sprite.width / 2);
        sprite.body.setCollisionCategory(2); // this is a bitmask
        sprite.body.sensor = true;
    }

    particulesCallback(body1, body2, fixture1, fixture2, begin){
        if (!begin)
        {
            return;
        }

        this.player.sprite.width += body2.sprite.mass;
        this.player.sprite.height += body2.sprite.mass;
        this.player.speed += body2.sprite.mass;
        this.player.mass += body2.sprite.mass;
        //console.log((1000 / this.player.speed) + 100);

        body2.sprite.destroy();
        body2.destroy();
    }

    enemyCallback(body1, body2, fixture1, fixture2, begin){
        if (!begin)
        {
            return;
        }

        console.log(body1.mass, body2.mass);

        if(body1.mass > body2.mass){
            //body2.sprite.destroy();
            body1.mass += body2.mass;
            body2.destroy();
        }
        else if(body1.mass < body2.mass) {
            body2.mass += body1.mass;
            body1.destroy();
        }
    }


    update(game) {
        this.player.sprite.body.setCircle(this.player.sprite.width / 2);

        if (game.physics.arcade.distanceToPointer(this.player.sprite, game.input.activePointer) > this.player.sprite.width / 2)
        {
            game.physics.arcade.moveToPointer(this.player.sprite, (1000 / this.player.speed) + 100);
        }
        else
        {
            game.physics.arcade.moveToPointer(this.player.sprite, 0);
        }
        game.debug.box2dWorld();
        game.debug.cameraInfo(game.camera, 32, 32);
    }

    render(game) {
        this.socket.emit('myPlayer', this.player.toString());
    }
}

export default Game;
