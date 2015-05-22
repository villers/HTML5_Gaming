/**
 * Created by viller_m on 19/05/15.
 */
class Particules {
    constructor(game, particule, groupColision, groupParticules) {
        this.game = game;
        this.particule = particule;
        this.groupColision = groupColision;
        this.groupParticules = groupParticules;
        this.generateSprite();
    }

    generateSprite(){
        var bmd = this.generateCircle(this.particule.color);

        this.sprite = this.game.add.sprite(this.particule.x, this.particule.y, bmd);
        this.game.physics.p2.enable(this.sprite, false);

        this.setColision();

        this.sprite.id = this.particule.id;
        this.sprite.mass = this.particule.mass;
    }

    generateCircle(color){
        var bmd = this.game.add.bitmapData(20,20);
        bmd.ctx.fillStyle = color;
        bmd.ctx.beginPath();
        bmd.ctx.arc(10, 10, 10, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();
        return bmd;
    }

    setColision(){
        this.sprite.body.static = true;
        this.sprite.body.setCircle(this.sprite.width / 2);
        this.sprite.body.fixedRotation = false;
        this.sprite.body.setCollisionGroup(this.groupColision[2]);
        this.sprite.body.collides([this.groupColision[0], this.groupColision[1]]);
    }

    move(particle){
        if(this.sprite.alive){
            this.sprite.kill();
        }
        this.particule = particle;
        this.generateSprite();
    }
}

export default Particules;