$.fn.addMovingToolTip = function (str, height, width) {
    var tooltipTimeout;
    var length = str.length;
    var tooltipHeight = height || Math.floor(length / 80 + 1);
    var tooltipWidth = width || 4 / 3 * height;
    var tooltip, tooltipX, tooltipY;
    this.mousemove(function (event) {
        tooltipX = event.pageX;
        tooltipY = $(tooltip).parent().offset().top + 30; 
        $(tooltip).offset({
            top: tooltipY,
            left: tooltipX 
        });
        //event.stopPropagation();
    });
    this.hover(function () {
        tooltip = $("<div><div>")
            .addClass("tooltip")
            .appendTo("body")
            .width(tooltipWidth)
            .height(tooltipHeight)
            .hide()
            .html(str)
            .offset({
                top: tooltipY,
                left: tooltipX
            });
        tooltipTimeout = setTimeout(showToolTip, 500);
    },function () {
        tooltip.fadeOut().remove();
        tooltip = null;
    });

    var showToolTip = function () {
        tooltip.show();
    };
    var hideToolTip = function () {
        console.log(tooltip);
        tooltip.fadeOut().remove();
    };

};



$("#test").addMovingToolTip("Just some string", 50, 100);
