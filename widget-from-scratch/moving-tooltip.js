$(document).ready( function() {
    $.fn.addMovingToolTip = function (str, height, width) {
        var tooltipTimeout;
        var length = str.length;
        var tooltipHeight = height || Math.floor(length / 80 + 1);
        var tooltipWidth = width || 4 / 3 * height;
        var tooltip, tooltipX, tooltipY;
        var elem = $(this);
        this.mousemove(function (event) {
            tooltipX = event.pageX;
            tooltipY = $(tooltip).parent().offset().top + 30; 
            console.log("(move) has x: " + tooltipX + " and y: " + tooltipY);
            tooltip.offset({
                top: tooltipY,
                left: tooltipX 
            });
            //event.stopPropagation();
            console.log("(move)", tooltip.offset()); // JD: Added...compare to tooltipX and tooltipY
        });
        this.hover(function () {
            console.log("Appearing has x: " + tooltipX + " and y: " + tooltipY)
            tooltip = $("<div><div>")
                .addClass("tooltip")
                .appendTo(elem)
                .width(tooltipWidth)
                .height(tooltipHeight)
                .hide()
                .html(str)
                .offset({
                    top: tooltipY,
                    left: tooltipX 
                });
                console.log("(hover)", tooltip.offset()); // JD: Also added to compare to tooltipX and tooltipY
                tooltipTimeout = setTimeout(showToolTip, 500); // JD: Why are you delaying the show()?
        },function () {
            tooltip.remove();
        });

        var showToolTip = function () {
            tooltip.show();
            console.log(tooltip.offset().top);
            console.log(tooltip.offset().left);
        };
        var hideToolTip = function () {
            console.log(tooltip.offset().top);
            console.log(tooltip.offset().left);
            tooltip.remove();
        };

    };



    $("#test").addMovingToolTip("Just some string", 50, 100);

});
