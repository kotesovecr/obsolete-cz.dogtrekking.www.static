$(function () {
    var $masonry = $('#container').masonry({
        itemSelector: '.item',
        columnWidth: 200
    });
    $masonry.imagesLoaded().progress( function() {
        $grid.masonry('layout');
    });
});