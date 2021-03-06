function HealthBlobs(x, y) {
    this.x = x;
    this.y = y;
}

HealthBlobs.prototype = new Entity(this.x, this.y, 32, 32);

HealthBlobs.prototype.deltaX = function(elapsedTime) {
    return 0;
};

HealthBlobs.prototype.deltaY = function(elapsedTime) {
    return 0;
};

HealthBlobs.prototype.tick = function(delta) {
    var xDist = this.x - player.x;
    var yDist = this.y - player.y;
    var distance = Math.sqrt(xDist * xDist + yDist * yDist);

    var isCollision = (new Collider(this.x, this.y, this.width, this.height).contains(player.x, player.y, player.width, player.height));

    if (isCollision) {
        var indexOfBlob = entities.indexOf(this);
        if (indexOfBlob > -1) {
            entities.splice(indexOfBlob, 1);
            if (player.health + 10 <= player.maxHealth) {
                player.health += 10;
                Messenger().post({
                    parentLocations: ['.theGame'],
                    message: "You got 10 health!",
                    type: "success", // info error or success. Use error for negative, success positive, and info neutral
                    hideAfter: "3"
                })
            } else if (player.health != player.maxHealth) {
                player.health = player.maxHealth;
                Messenger().post({
                    parentLocations: ['.theGame'],
                    message: "You got 10 health!",
                    type: "success", // info error or success. Use error for negative, success positive, and info neutral
                    hideAfter: "3"
                })
            } else {
                Messenger().post({
                    message: "You already have full health!",
                    type: "info", // info error or success. Use error for negative, success positive, and info neutral
                    hideAfter: "3"
                })
            }
        }
        var audio = new Audio('..\/audio\/gainHealth.mp3');
        audio.volume = audio.volume * .2;
        audio.play();
    }
};

HealthBlobs.prototype.move = function(delta) {

};

HealthBlobs.prototype.getDisplay = function() {
    var sprite = new createjs.Bitmap("img/sprites/heart8_24.png");
    return sprite;
    /*
    var circle = new createjs.Shape();
    var circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, 16);
    return circle;
    */
};
