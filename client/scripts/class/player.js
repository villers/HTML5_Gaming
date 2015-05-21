/**
 * Created by viller_m on 19/05/15.
 */
class Player {
    constructor(game, socket, groupColision) {
        this.game = game;
        this.socket = socket;
        this.groupColision = groupColision;
        this.id = socket.io.engine.id;

        this.generateSprite();
    }

    generateSprite(){
        var color = this.generateColor();
        var bmd = this.generateCircle(color);

        this.sprite = this.game.add.sprite(this.game.world.randomX, this.game.world.randomY, bmd);
        this.game.physics.p2.enable(this.sprite, false);

        this.setColision();

        this.sprite.id = this.id;
        this.sprite.color = color;
        this.sprite.mass = 20;
        this.sprite.speed_base = 5000;
        this.sprite.speed = this.sprite.speed_base / this.sprite.mass;
        this.sprite.killed = 0;

        this.game.camera.follow(this.sprite);
    }

    generateColor(){
        var color = ['#999999', '#CCCCCC', '#00FF00', '#0000FF', '#FF0000', '#FFFF00'];
        return color[this.game.rnd.integerInRange(0, 5)];
    }

    generateCircle(color){
        var bmd = this.game.add.bitmapData(50,50);
        bmd.ctx.fillStyle = color;
        bmd.ctx.beginPath();
        bmd.ctx.arc(25, 25, 25, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();
        return bmd;
    }

    setColision(){
        this.sprite.body.setCircle(this.sprite.width / 2);
        this.sprite.body.fixedRotation = false;

        this.sprite.body.setCollisionGroup(this.groupColision[0]);
        this.sprite.body.collides(this.groupColision[1], this.enemyCallback, this);
        this.sprite.body.collides(this.groupColision[2], this.particulesCallback, this);
    }

    enemyCallback(body1, body2){
        if(!body2.sprite.killed && this.sprite.mass - (this.sprite.mass * 0.2) > body2.sprite.mass){
            body2.sprite.killed = 1;

            this.sprite.width += body2.sprite.mass;
            this.sprite.height += body2.sprite.mass;
            this.sprite.mass += body2.sprite.mass;
            this.sprite.speed = this.sprite.speed_base / this.sprite.mass;

            this.setColision();

            var enemy = {
                id: body2.sprite.id,
                username: body2.sprite.username,
                speed: body2.sprite.speed,
                mass: body2.sprite.mass,
                color: body2.sprite.color,
                x: body2.sprite.x,
                y: body2.sprite.y,
                height: body2.sprite.height,
                width: body2.sprite.width,
                killed: body2.sprite.killed
            };

            body2.sprite.kill();
            body2.sprite.x = -1000;
            body2.sprite.y = -1000;
            this.socket.emit('kill_player', enemy);
        }
        else if(!this.sprite.killed && body2.sprite.mass - (body2.sprite.mass * 0.2) > this.sprite.mass){
            this.sprite.killed = 1;

            this.sprite.kill();
            this.sprite.x = -1000;
            this.sprite.y = -1000;
            this.socket.emit('kill_player', this.toJson());
        }
    }

    particulesCallback(body1, body2){
        if(!body2.sprite.killed){
            body2.sprite.killed = 1;

            this.sprite.width += body2.sprite.mass;
            this.sprite.height += body2.sprite.mass;
            this.sprite.mass += body2.sprite.mass;
            this.sprite.speed = this.sprite.speed_base / this.sprite.mass;

            this.setColision();

            this.socket.emit('update_particles', body2.sprite.id);
        }
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

    render(game){
        this.socket.emit('move_player', this.toJson());
    }
}

export default Player;