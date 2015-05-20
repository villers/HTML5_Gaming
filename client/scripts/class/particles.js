/**
 * Created by viller_m on 19/05/15.
 */
class Particules {
    constructor(game, particules, group) {
        var bmd = game.add.bitmapData(20,20);
        // Draw circle
        bmd.ctx.fillStyle = particules.color;
        bmd.ctx.beginPath();
        bmd.ctx.arc(10, 10, 10, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();

        // Put BitmapData in a Sprite
        this.sprite = group.create(particules.x, particules.y, bmd);
        this.sprite.id = particules.id;
        this.sprite.mass = 1;

        // Define attribute
        this.sprite.body.static = true;
        this.sprite.body.setCircle(this.sprite.width / 2);
        this.sprite.body.setCollisionCategory(2); // this is a bitmask
        this.sprite.body.sensor = true;
    }
}

export default Particules;