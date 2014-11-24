function Randos(x, y) {
    this.x = x;
    this.y = y;
}

Randos.prototype = new Entity(this.x, this.y, 16, 48);

Randos.prototype.deltaX = function(elapsedTime) {
    return 0;
};

Randos.prototype.deltaY = function(elapsedTime) {
    return 0;
};

Randos.prototype.tick = function(delta) {
    var xDist = this.x - player.x;
    var yDist = this.y - player.y;
    var distance = Math.sqrt(xDist * xDist + yDist * yDist);

    var isCollision = (new Collider(this.x, this.y, this.width, this.height).contains(player.x, player.y, player.width, player.height));

   if (isCollision) {
        var indexOfBlob = entities.indexOf(this);
        if (indexOfBlob > -1) {
            entities.splice(indexOfBlob, 1);
            if (player.health - 10 >= 0) {
                player.health -= 10;
                Messenger().post({
                    parentLocations:['.theGame'],
                    message: "You lost 10 health. Don't touch the randos",
                    type: "error", // info error or success. Use error for negative, success positive, and info neutral
                    hideAfter: "3"
                })
            } else{
                 Messenger().post({
                    message: "You died to randos",
                    type: "error", // info error or success. Use error for negative, success positive, and info neutral
                    hideAfter: "3"
                })
            }
        }
        var audio = new Audio('..\/audio\/getHurt.mp3');
        audio.volume=audio.volume*.2;
        audio.play();
    }
};

Randos.prototype.move = function(delta) {

};

Randos.prototype.getDisplay = function() {
    var sprite = new createjs.Bitmap("img/rando.png");
	return sprite;
};

/*
 * We need to delete the below methods.  These create OFFSETS of the location which makes calculations completely different.
 * Use .trueWidth and .trueHeight for now.  If these methods are deleted, you can revert back to using just .width and .height
 *
 */
Randos.prototype.width = function() {
    return 0;
};

Randos.prototype.height = function() {
    return 0;
};
