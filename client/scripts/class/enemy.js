/**
 * Created by viller_m on 19/05/15.
 */
class Enemy {
    constructor(game, enemy, groupColision, groupEnemy) {
        this.game = game;

        var bmd = game.add.bitmapData(50,50);
        bmd.ctx.fillStyle = enemy.color;
        bmd.ctx.beginPath();
        bmd.ctx.arc(25, 25, 25, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();

        this.sprite = groupEnemy.create(enemy.x, enemy.y, bmd);
        game.physics.p2.enable(this.sprite, false);
        this.sprite.body.setCircle(enemy.width / 2);
        this.sprite.body.fixedRotation = false;

        this.sprite.body.setCollisionGroup(groupColision[1]);
        this.sprite.body.static = true;

        this.sprite.body.collides([groupColision[0], groupColision[2]]);
        this.sprite.id = enemy.id;
        this.sprite.username = '';
        this.sprite.color = enemy.color;
        this.sprite.mass = enemy.mass;
        this.sprite.speed_base = 5000;
        this.sprite.speed = enemy.speed;
        this.sprite.width = enemy.width;
        this.sprite.height = enemy.height;
        this.sprite.killed = enemy.killed;
    }
}

export default Enemy;