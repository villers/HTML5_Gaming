/**
 * Created by viller_m on 19/05/15.
 */
class Player {
    constructor(game, socket, groupColision) {
        this.game = game;
        this.socket = socket;
        this.id = socket.io.engine.id;
        this.lastmass = 0;

        this.lastx = 0;
        this.lasty = 0;

        var color = ['#999999', '#CCCCCC', '#00FF00', '#0000FF', '#FF0000', '#FFFF00'];
        color = color[game.rnd.integerInRange(0, 5)];

        var x = game.world.randomX;
        var y = game.world.randomY;


        var bmd = game.add.bitmapData(50,50);
        bmd.ctx.fillStyle = color;
        bmd.ctx.beginPath();
        bmd.ctx.arc(25, 25, 25, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();

        this.sprite = game.add.sprite(x, y, bmd);
        game.physics.p2.enable(this.sprite, true);
        this.sprite.body.setCircle(this.sprite.width / 2);
        this.sprite.body.fixedRotation = true;

        this.sprite.body.setCollisionGroup(groupColision[0]);
        this.sprite.body.collides(groupColision[1], this.enemyCallback, this);
        this.sprite.body.collides(groupColision[2], this.particulesCallback, this);

        this.sprite.id = this.id;
        this.sprite.color = color;
        this.sprite.mass = 20;
        this.sprite.speed_base = 5000;
        this.sprite.speed = this.sprite.speed_base / this.sprite.mass;

        game.camera.follow(this.sprite);
    }

    enemyCallback(body1, body2){
        console.log(body1, body2);


        if(body2.sprite && this.sprite.mass > body2.sprite.mass){
            body2.sprite.mass--;
            body2.sprite.width--;
            body2.sprite.height--;
            this.sprite.mass++
            this.sprite.width++;
            this.sprite.height++;

            if(body2.sprite.mass < 20)
            {
                body2.sprite.kill();
                body2.destroy();
            }
        }
        else if(this.sprite && this.sprite.mass < body2.sprite.mass) {
            this.sprite.mass--;
            this.sprite.width--;
            this.sprite.height--;
            body2.sprite.mass++;
            body2.sprite.width++;
            body2.sprite.height++;


            if(this.sprite.mass < 20)
            {
                this.sprite.kill();
                this.sprite.body.destroy();
            }
        }
    }

    particulesCallback(body1, body2){
        this.sprite.width += body2.sprite.mass;
        this.sprite.height += body2.sprite.mass;
        this.sprite.speed = this.sprite.speed_base / this.sprite.mass;
        this.sprite.mass += body2.sprite.mass;

        var id = body2.sprite.id;
        body2.sprite.destroy();
        //body2.destroy();

        this.socket.emit('delete_particule', id);
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

    render(){
        if(this.lastmass != this.sprite.mass || Math.round(this.sprite.x) != Math.round(this.lastx) || Math.round(this.sprite.y) != Math.round(this.lasty)){
            this.lastx = this.sprite.x;
            this.lasty = this.sprite.y;
            this.lastmass = this.sprite.mass;
            this.socket.emit('move_player', this.toJson());
        }
    }
}

export default Player;