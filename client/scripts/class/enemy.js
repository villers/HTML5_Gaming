/**
 * Created by viller_m on 19/05/15.
 */
class Enemy {
    constructor(game, enemy, groupColision) {
        this.game = game;
        this.enemy = enemy;
        this.groupColision = groupColision;
        this.generateSprite();
    }

    generateSprite(){
        var bmd = this.generateCircle(this.enemy.color);

        this.sprite = this.game.add.sprite(this.enemy.x, this.enemy.y, bmd);
        this.game.physics.p2.enable(this.sprite, false);

        this.setColision();

        this.sprite.id = this.enemy.id;
        this.sprite.username = '';
        this.sprite.color = this.enemy.color;
        this.sprite.mass = this.enemy.mass;
        this.sprite.speed_base = 5000;
        this.sprite.speed = this.enemy.speed;
        this.sprite.width = this.enemy.width;
        this.sprite.height = this.enemy.height;
    }

    generateCircle(color){
        var bitmapSize = this.enemy.mass * 2
        var bmd = this.game.add.bitmapData(bitmapSize, bitmapSize);
        bmd.ctx.fillStyle = color;
        bmd.ctx.beginPath();
        bmd.ctx.arc(this.enemy.mass, this.enemy.mass, this.enemy.mass, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();
        return bmd;
    }

    setColision(){
        this.sprite.body.static = true;
        this.sprite.body.setCircle(this.sprite.width / 2);
        this.sprite.body.fixedRotation = false;
        this.sprite.body.setCollisionGroup(this.groupColision[1]);
        this.sprite.body.collides([this.groupColision[0], this.groupColision[2]]);
    }

    move(particle){
        if(this.sprite.alive){
            this.sprite.kill();
        }
        this.enemy = particle;
        this.generateSprite();
    }
}

export default Enemy;