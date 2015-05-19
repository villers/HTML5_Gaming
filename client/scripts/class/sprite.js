/**
 * Created by viller_m on 19/05/15.
 */
class Sprite {
    constructor(sprite) {
        this.sprite = sprite;
    }

    toString(){
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

    fromObj(json){
        this.id = json.id;
        this.username = json.username;
        this.speed = json.speed;
        this.mass = json.mass;
        this.color = json.color;
        this.sprite.x = json.x;
        this.sprite.y = json.y;
        this.sprite.height = json.height;
        this.sprite.width = json.width;
    }
}

export default Sprite;