/**
 * Created by viller_m on 19/05/15.
 */
class Enemy {
    constructor(game, socket, enemy) {
        this.socket = socket;
        this.game = game;

        this.lastmass = 0;

        var bmd = game.add.bitmapData(50,50);
        bmd.ctx.fillStyle = enemy.color;
        bmd.ctx.beginPath();
        bmd.ctx.arc(25, 25, 25, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();



        this.sprite = game.add.sprite(enemy.x, enemy.y, bmd);
        this.sprite.id = enemy.id;
        this.sprite.username = '';
        this.sprite.color = enemy.color;
        this.sprite.mass = enemy.mass;
        this.sprite.speed_base = 5000;
        this.sprite.speed = enemy.speed;

        game.physics.box2d.enable(this.sprite);
        this.sprite.body.static = true;
        this.sprite.body.setCollisionCategory(3);
    }

    toJson () {
        return {
            id: this.sprite.id,
            username: this.sprite.username,
            speed: this.sprite.speed,
            mass: this.sprite.mass,
            color: this.sprite.color,
            x: this.sprite.x,
            y: this.sprite.y,
            height: this.sprite.height,
            width: this.sprite.width
        };
    }

    update(game, enemy) {
        if(this.lastmass != this.sprite.mass){
            this.lastmass = this.sprite.mass;
            this.sprite.body.setCircle(this.sprite.width / 2);
        }
        this.sprite.color = enemy.color;
        this.sprite.mass = enemy.mass;
        this.sprite.speed = enemy.speed;
        this.sprite.height = enemy.height;
        this.sprite.width = enemy.width;
        this.sprite.x = enemy.x;
        this.sprite.y = enemy.y;
    }
}

export default Enemy;