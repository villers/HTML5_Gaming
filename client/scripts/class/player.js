/**
 * Created by viller_m on 19/05/15.
 */
class Player {
    constructor(game, socket) {
        this.socket = socket;
        this.game = game;
        this.id = socket.io.engine.id;
        this.color = '#FF00FF';
        this.mass = 20;
        this.speed_base = 5000;
        this.speed = this.speed_base / this.mass;


        var x = game.world.randomX;
        var y = game.world.randomY;


        var bmd = game.add.bitmapData(50,50);
        bmd.ctx.fillStyle = this.color;
        bmd.ctx.beginPath();
        bmd.ctx.arc(25, 25, 25, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();

        this.sprite = game.add.sprite(x, y, bmd);
        game.physics.box2d.enable(this.sprite);

        this.sprite.body.setCategoryContactCallback(2, this.particulesCallback, this);
        this.sprite.body.setCategoryContactCallback(3, this.enemyCallback, this);
    }

    particulesCallback(body1, body2, fixture1, fixture2, begin){
        if (!begin)
        {
            return;
        }

        this.sprite.width += body2.sprite.mass;
        this.sprite.height += body2.sprite.mass;
        this.speed = this.speed_base / this.mass;
        this.mass += body2.sprite.mass;

        var id = body2.sprite.id;
        body2.sprite.destroy();
        body2.destroy();

        this.socket.emit('delete_particule', id);
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

    toJson () {
        return {
            id: this.id,
            username: this.username,
            speed: this.speed,
            mass: this.mass,
            color: this.color,
            x: this.sprite.x,
            y: this.sprite.y,
            height: this.sprite.height,
            width: this.sprite.width
        };
    }

    update(game) {
        this.sprite.body.setCircle(this.sprite.width / 2);
    }
}

export default Player;