class Game {


    create(game) {
        this.color = ['#999999', '#CCCCCC', '#00FF00', '#0000FF', '#FF0000', '#FFFF00'];
        this.nbParticule = 250;
        game.physics.startSystem(Phaser.Physics.BOX2D);

        game.stage.backgroundColor = '#000';
        game.physics.box2d.restitution = 0.8;
        game.world.setBounds(0, 0, 5000, 5000);
        game.add.tileSprite(0, 0, game.world.width, game.world.height, 'grid');

        this.createPlayer(game);

        game.camera.bounds.setTo(-game.width/2, -game.height/2, game.world.width + game.width, game.world.height + game.height);

        this.particules = game.add.group();
        this.particules.enableBody = true;
        this.particules.physicsBodyType = Phaser.Physics.BOX2D;

        for (var i = 0; i < this.nbParticule; i++)
        {
            this.createParticle(game);
        }
        this.ball.body.setCategoryContactCallback(2, this.enemyCallback, this);

    }

    createPlayer(game){
        var bmd = game.add.bitmapData(50,50);

        // Draw circle
        bmd.ctx.fillStyle = this.color[game.rnd.integerInRange(0, 5)];
        bmd.ctx.beginPath();
        bmd.ctx.arc(25, 25, 25, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();

        // Put BitmapData in a Sprite
        this.ball = game.add.sprite(game.world.randomX, game.world.randomY, bmd);

        // Define attribute
        this.ball.speed = 10;
        this.ball.mass = 5;
        game.physics.box2d.enable(this.ball);
        game.camera.follow(this.ball);
    }

    createParticle(game){
        var bmd = game.add.bitmapData(20,20);

        // Draw circle
        bmd.ctx.fillStyle = this.color[game.rnd.integerInRange(0, 5)];
        bmd.ctx.beginPath();
        bmd.ctx.arc(10, 10, 10, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();

        // Put BitmapData in a Sprite
        var sprite = this.particules.create(game.world.randomX, game.world.randomY, bmd);

        // Define attribute
        sprite.body.setCircle(sprite.width / 2);
        sprite.mass = 1;
        sprite.body.static = true;
        sprite.body.setCollisionCategory(2); // this is a bitmask
        sprite.body.sensor = true;
    }

    enemyCallback(body1, body2, fixture1, fixture2, begin){
        if (!begin)
        {
            return;
        }

        this.ball.width += body2.sprite.mass;
        this.ball.height += body2.sprite.mass;
        this.ball.speed += body2.sprite.mass;
        console.log((1000 / this.ball.speed) + 100);

        body2.sprite.destroy();
        body2.destroy();
    }

    update(game) {
        this.ball.body.setCircle(this.ball.width / 2);

        if (game.physics.arcade.distanceToPointer(this.ball, game.input.activePointer) > this.ball.width / 2)
        {
            game.physics.arcade.moveToPointer(this.ball, (1000 / this.ball.speed) + 100);
        }
        else
        {
            game.physics.arcade.moveToPointer(this.ball, 0);
        }
        //game.debug.box2dWorld();

        if(this.particules.children.length < this.nbParticule) {
            this.createParticle(game);
        }
    }

    render() {

    }
}

export default Game;
