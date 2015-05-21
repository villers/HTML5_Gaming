/**
 * Created by viller_m on 19/05/15.
 */
class Particules {
    constructor(game, particule, groupColision, groupParticules) {
        var bmd = game.add.bitmapData(20,20);
        // Draw circle
        bmd.ctx.fillStyle = particule.color;
        bmd.ctx.beginPath();
        bmd.ctx.arc(10, 10, 10, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();

        this.sprite = groupParticules.create(particule.x, particule.y, bmd);
        game.physics.p2.enable(this.sprite, false);
        this.sprite.body.setCircle(this.sprite.width / 2);
        this.sprite.body.fixedRotation = false;

        this.sprite.body.setCollisionGroup(groupColision[2]);
        this.sprite.body.static = true;

        this.sprite.body.collides([groupColision[0], groupColision[1]]);
        this.sprite.id = particule.id;
        this.sprite.mass = 1;
        this.sprite.killed = 0;
    }
}

export default Particules;