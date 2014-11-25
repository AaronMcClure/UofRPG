var storeItems = [
  {
    id: "jacket",
    displayName: "Jacket",
    isBuyable: true,
    price: 100,
    description: "Basic protection against the harsh winter",
    fileLarge: "img/sprites/letterman_jacket_64.png",
    fileSmall: "img/sprites/letterman_jacket_32.png",
    attributes: {
      health: 0,
      strength: 0,
      defense: 0,
      intelligence: 0,
      charisma: 0
    }
  }
];


$('#storeModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var modal = $(this);

  var itemContainer = modal.find('.store-modal-items');
  var itemsHtml = "";
  for (var i = 0; i < storeItems.length; i++) {
  	var item = storeItems[i];
    if (item.isBuyable && !player.isInInventory(item.id)) {
    	var html = "";
    	html += '<div class="col-xs-3 store-modal-item" data-storeid="' + item.id + '">';
    	html += '<div class="panel panel-default"><div class="panel-body">';
    	html += '<div class="store-modal-image"><img src="' + item.fileLarge + '"></div>';
    	html += '<div class="store-modal-caption">';
    	html +=	'<h4 class="store-modal-title">' + item.displayName + '</h4>';
    	html += '<p>' + item.description + '</p>';
    	// TODO display non-zero attributes
    	html += '<button type="button" class="btn btn-primary btn-xs btn-block store-modal-buy" data-index="' + i + '">';
    	html += 'Buy ($' + item.price + ')</button>';
    	html += '</div>';
    	html += '</div></div></div>';
    	itemsHtml += html;
    }
  }
  itemContainer.html(itemsHtml);
});

$('.store-modal-buy').click(function(){
  var button = $(this);
  var index = parseInt(button.attr('data-index');
  var item = storeItems[index];
  player.addToInventory(item.id);
  Messenger().post({
      parentLocations: ['.theGame'],
      message: "Item purchased!",
      type: "success",
      hideAfter: "3"
  });
});