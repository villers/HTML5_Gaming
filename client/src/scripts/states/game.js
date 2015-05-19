class Game {


    create(game) {
        this.color = ['#999999', '#CCCCCC', '#00FF00', '#0000FF', '#FF0000', '#FFFF00'];
        this.nbParticule = 250;
        this.game.physics.startSystem(Phaser.Physics.BOX2D);

        this.game.stage.backgroundColor = '#000';
        this.game.physics.box2d.restitution = 0.8;
        this.game.world.setBounds(0, 0, 5000, 5000);
        this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'grid');

        /*this.ball = this.game.add.sprite(this.game.world.randomX, this.game.world.randomY, 'ball');
        this.ball.speed = 10;
        this.ball.width = 25;
        this.ball.height = 25;
        this.ball.mass = 5;
        this.game.physics.box2d.enable(this.ball);*/
        this.createPlayer(game);

        this.game.camera.bounds.setTo(-this.game.width/2, -this.game.height/2, this.game.world.width + this.game.width, this.game.world.height + this.game.height);
        this.game.camera.follow(this.ball);

        this.particules = this.game.add.group();
        this.particules.enableBody = true;
        this.particules.physicsBodyType = Phaser.Physics.BOX2D;

        for (var i = 0; i < this.nbParticule; i++)
        {
            this.createParticle();
        }
        this.ball.body.setCategoryContactCallback(2, this.enemyCallback, this);

    }

    createPlayer(game){
        // Create BitmapData
        var bmd = game.add.bitmapData(50,50);

        // Draw circle
        bmd.ctx.fillStyle = this.color[this.game.rnd.integerInRange(0, 5)];
        bmd.ctx.beginPath();
        bmd.ctx.arc(25, 25, 25, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();

        // Put BitmapData in a Sprite
        this.ball = this.game.add.sprite(this.game.world.randomX, this.game.world.randomY, bmd);
        this.ball.speed = 10;
        this.ball.mass = 5;
        this.game.physics.box2d.enable(this.ball);
        this.game.camera.follow(this.ball);
    }

    createParticle(){
        var bmd = this.game.add.bitmapData(20,20);

        // Draw circle
        //bmd.ctx.fillStyle = '#999999';
        bmd.ctx.fillStyle = this.color[this.game.rnd.integerInRange(0, 5)];
        bmd.ctx.beginPath();
        bmd.ctx.arc(10, 10, 10, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();

        var sprite = this.particules.create(this.game.world.randomX, this.game.world.randomY, bmd);
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

    update() {
        this.ball.body.setCircle(this.ball.width / 2);
        //this.game.physics.arcade.moveToPointer(this.ball, this.ball.speed, this.game.input.activePointer, this.ball.speed);

        if (this.game.physics.arcade.distanceToPointer(this.ball, this.game.input.activePointer) > this.ball.width / 2)
        {
            this.game.physics.arcade.moveToPointer(this.ball, (1000 / this.ball.speed) + 100);
        }
        else
        {
            this.game.physics.arcade.moveToPointer(this.ball, 0);
        }
        //this.game.debug.box2dWorld();

        if(this.particules.children.length < this.nbParticule) {
            this.createParticle();
        }
    }

    render() {

    }
}

export default Game;
