var mapData;
var screenWidth = 15;
var screenHeight = 8;
var TILE_D = 32;
var bitmaps;
var entities;


function tickMap(delta) {
    gameContainer.removeAllChildren();

    var layerData = mapData.layers[0];
    var d = TILE_D;

    var cordX = ((player.x / d) | 0);
    var cordY = ((player.y / d) | 0);
    var modX = d - (player.x % d);
    var modY = d - (player.y % d);

    benchmark("d:tiles", function(){
        for (var iy = cordY - 1 - screenHeight; iy < cordY + 1 + screenHeight; iy++) {
            for (var ix = cordX - 1 - screenWidth; ix < cordX + 1 + screenWidth; ix++) {
                // create a new Bitmap for each cell
                var cellBitmap;
                // layer data has single dimension array
                var idx = ix + iy * layerData.width;
                // tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)

                cellBitmap = bitmaps[layerData.data[idx] - 1].clone();

                // isometrix tile positioning based on X Y order from Tiled
                cellBitmap.x = ix * d - d + modX - (cordX - 1 - screenWidth) * d;
                cellBitmap.y = iy * d - d + modY - (cordY - 1 - screenHeight) * d;

                gameContainer.addChild(cellBitmap);
            }
        }
    });

    benchmark("d:entities", function(){
        // loop to reposition all entities and then draw them
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            var display = entity.getDisplay();
            display.setTransform(
                entity.x - (entity.x - entity.width() / 2 - screenWidth * d),
                entity.y - (entity.y - entity.height() / 2 - screenHeight * d)
            );
            gameContainer.addChild(display);
        }
    });

    benchmark("d:minimap", function(){
        var minimap = getMinimapDisplay();
        minimap.setTransform(stage.canvas.width - minimap.getBounds().width - 10, 10);
        gameContainer.addChild(minimap);
    });

    benchmark("d:hudbar", function(){
        var hudbar = getHudbarDisplay();
        hudbar.setTransform(10, 10);
        gameContainer.addChild(hudbar);
    });


    benchmark("d:update", function(){
        stage.update();
    });

    benchmark("debug", function(){
        // overlay for debug mode
        if (debugMode) {
            var overlayStr = "";
            var LBREAK = "<br>";

            var measuredFpsStr = createjs.Ticker.getMeasuredFPS().toFixed(2);
            overlayStr += "fps: " + measuredFpsStr;

            overlayStr += LBREAK;
            overlayStr += "coords: " + cordX + "," + cordY;

            overlayStr += LBREAK;
            overlayStr += "exact: " + player.x + "," + player.y;

            if (player.isNoCollide) {
                overlayStr += LBREAK;
                overlayStr += "no collision"
            }
            $("#debugBox").html(overlayStr);
            $("#debugBox").removeClass("hidden");
        } else {
            $("#debugBox").addClass("hidden");
        }
    });
}


// MINIMAP SETTINGS
// minimap colors for tiles [r, g, b]
// note: array shouldn't be accessed directly, use getMinimapColor() instead
var minimapColors = [
    [63, 191, 63], // grass
    [191, 63, 63] // brick
]

var minimapCrosshairColor = [0, 0, 128]; // color for crosshair [r, g, b]
var minimapOpacity = 255; // how visible is minimap? (0-255)

var minimapWidth = 48; // width of minimap (in tiles)
var minimapHeight = 48; // height of minimap (in tiles)
var minimapTileSize = 2; // size of tiles on minimap (in px)

var minimapBitmap;

/**
 * Gets a DisplayObject representing the minimap
 * pixel drawing technique based on http://community.createjs.com/discussions/easeljs/1291-bitmap-pixel-manipulation
 */
function getMinimapDisplay() {
    var layerData = mapData.layers[0];
    var miniD = minimapTileSize;

    var minimapWidthPx = minimapWidth * minimapTileSize;
    var minimapHeightPx = minimapHeight * minimapTileSize;

    var miniCordX = ((player.x / TILE_D) | 0);
    var miniCordY = ((player.y / TILE_D) | 0);

    minimapBitmap.sourceRect = new createjs.Rectangle(
        (miniCordX * minimapTileSize - minimapWidth), 
        (miniCordY * minimapTileSize - minimapWidth), 
        minimapWidthPx, 
        minimapHeightPx
    );

    return minimapBitmap;
}

function initMinimap() {
    renderMinimap();
}

/**
 * Pre-renders minimap
 */
function renderMinimap() {
    var layerData = mapData.layers[0];
    var miniD = minimapTileSize;

    var canvas = document.createElement("canvas");
    canvas.width  = mapData.width * miniD;
    canvas.height = mapData.height * miniD;
    var ctx = canvas.getContext("2d");
    var id = ctx.createImageData(miniD, miniD);
    var data = id.data;

    for (var iy = 0; iy < mapData.height; iy++) {
        for (var ix = 0; ix < mapData.width; ix++) {

            var idx = ix + iy * layerData.width;
            var tid = layerData.data[idx] - 1;
            var color = getMinimapColor(tid);

            for (var i = 0; i < data.length; i += 4) {
                data[i] = color[0];
                data[i + 1] = color[1];
                data[i + 2] = color[2];
                data[i + 3] = minimapOpacity;
            }

            ctx.putImageData(id, ix * miniD, iy * miniD);
        }
    }

    minimapBitmap = new createjs.Bitmap(canvas);
}

/**
 * Gets the color for a particular tile, or black if tile doesn't exist
 * Color given as an array [r, g, b, a]
 */
function getMinimapColor(tid) {
    if (tid >= 0 && tid < minimapColors.length) {
        return minimapColors[tid];
    }
    return [0, 0, 0, 255];
}





// HUDBAR SETTINGS
var hudbarWidth = 192; // hudbar width (in px)
var hudbarHeight = 24; // hudbar height (in px)

var hudbarBorder = 3; // border inside the hudbar (in px)
  
// dimensions of inner hudbar (e.g. excluding border)
var hudbarInnerWidth = hudbarWidth - hudbarBorder * 2;
var hudbarInnerHeight = hudbarHeight - hudbarBorder * 2;

var hudbarIconSize = 24; // width of hudbar icon (in px)
var hudbarIconPadding = 4; // separation width between icon and hudbar (in px)

// HEALTHBAR SETTINGS
var healthbarColorFill = "#e00"; // color of available health
var healthbarColorEmpty = "#aaa"; // color of missing health
var healthbarColorBorder = "#222"; // color of hudbar border
var healthbarIconPath = "img/sprites/heart8_24.png"; // square of size hudbarIconSize

var healthbarGraphics, healthbarIcon;


/**
 * Gets a DisplayObject representing the hudbars like health and stuff
 */
function getHudbarDisplay() {

    // create images;
    var hudbar = new createjs.Container();
    var healthbar = new createjs.Shape(healthbarGraphics.clone());

    var healthPct = player.health / player.maxHealth; // fraction representing player health


    // draw filled section of healthbar
    healthbar.graphics.f(healthbarColorFill);
    healthbar.graphics.r(
        hudbarBorder, hudbarBorder, 
        Math.floor(hudbarInnerWidth * healthPct), 
        hudbarInnerHeight
    );

    // add health bar icon to hudbar
    hudbar.addChild(healthbarIcon);

    // add health bar to hudbar
    healthbar.setTransform(hudbarIconSize + hudbarIconPadding, 0);
    hudbar.addChild(healthbar);

    return hudbar;
}

/**
 * Prepares hudbars for first draw
 */
function initHudbar() {
    healthbarGraphics = new createjs.Graphics();

    // draw border of health bar
    healthbarGraphics.f(healthbarColorBorder);
    healthbarGraphics.r(
        0, 0, 
        hudbarWidth, 
        hudbarHeight
    );

    // draw background of health bar
    healthbarGraphics.f(healthbarColorEmpty);
    healthbarGraphics.r(
        hudbarBorder, hudbarBorder, 
        hudbarInnerWidth, 
        hudbarInnerHeight
    );

    healthbarIcon = new createjs.Bitmap(healthbarIconPath);
}