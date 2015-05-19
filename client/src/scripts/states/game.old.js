class Game {


    create() {
        this.nbParticule = 250;
        this.game.physics.startSystem(Phaser.Physics.BOX2D);

        this.game.stage.backgroundColor = '#124184';
        this.game.physics.box2d.restitution = 0.8;
        this.game.world.setBounds(0, 0, 5000, 5000);
        console.log(this.game.world.width);

        this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'grid');


        this.circleBmd = game.add.bitmapData(32, 32);
        this.circleBmd.circle(16, 16, 16, '#000');

        this.ball = this.game.add.sprite(this.game.world.randomX, this.game.world.randomY, 'ball');
        this.ball.speed = 500;
        this.ball.width = 25;
        this.ball.height = 25;
        this.game.physics.box2d.enable(this.ball);

        this.game.camera.follow(this.ball);


        this.particules = this.game.add.group();
        this.particules.enableBody = true;
        this.particules.physicsBodyType = Phaser.Physics.BOX2D;

        for (var i = 0; i < this.nbParticule; i++)
        {
            this.createParticle();
        }
        this.ball.body.setCategoryContactCallback(2, this.enemyCallback, this);

        console.log(this.particules);
    }

    createParticle(){
        var sprite = this.particules.create(this.game.world.randomX, this.game.world.randomY, 'balls-1', this.game.rnd.integerInRange(0, 5));
        sprite.body.setCircle(sprite.width / 2);
        sprite.body.static = true;
        sprite.body.setCollisionCategory(2); // this is a bitmask
        sprite.body.sensor = true;
    }

    enemyCallback(body1, body2, fixture1, fixture2, begin){
        if (!begin)
        {
            return;
        }

        this.ball.width += body2.sprite.width / 5;
        this.ball.height += body2.sprite.height / 5;
        this.ball.speed -=  (this.ball.speed / this.ball.width) + 5;

        body2.sprite.destroy();
        body2.destroy();
    }

    update() {
        this.ball.body.setCircle(this.ball.width / 2);
        //this.game.physics.arcade.moveToPointer(this.ball, this.ball.speed, this.game.input.activePointer, this.ball.speed);

        /*if (this.game.physics.arcade.distanceToPointer(this.ball, this.game.input.activePointer) > this.ball.width)
        {
            this.game.physics.arcade.moveToPointer(this.ball, this.ball.speed);
        }
        else
        {
            this.game.physics.arcade.moveToPointer(this.ball, 0);
        }*/

        var angle = this.game.physics.arcade.angleBetween(this.ball, this.game.input);
        // Convert the angle to degrees and then reverse the angle
        angle = angle * (180 / Math.PI) - 180;
        // Get the distance
        var distance = this.game.physics.arcade.distanceBetween(this.ball, this.game.input);
        // Calculate the velocity, higher if closer
        var velocity = Math.max(0, 150 - distance);
        // Apply the angle and velocity to the sprite
        this.game.physics.arcade.velocityFromAngle(angle, velocity, this.ball.body.velocity);

        this.game.debug.box2dWorld();

        if(this.particules.children.length < this.nbParticule) {
            this.createParticle();
        }
    }

    render() {

    }
}

export default Game;
