$(document).ready(function () {
    $.fn.addMovingToolTip = function (str, height, width) {
        var tooltipTimeout;
        var length = str.length;
        //var tooltipHeight = height || Math.floor(length / 80 + 1)*10;
        //var tooltipWidth = width || 4 / 3 * height;
        var tooltip, tooltipX, tooltipY;
        var elem = $(this);
        this.mousemove(function (event) {
            tooltipX = event.pageX;
            tooltipY = $(tooltip).parent().offset().top + 30;
            tooltip.offset({
                top: tooltipY,
                left: tooltipX
            });
        });
        this.hover(function () {
            tooltip = $("<div><div>")
                .addClass("tooltip")
                .appendTo(elem)
                //.width(tooltipWidth)
                //.height(tooltipHeight)
                .html(str)
                .css("visibility", "hidden")
                .offset({
                top: tooltipY,
                left: tooltipX
            });
            tooltipTimeout = setTimeout(showToolTip, 1000);
        }, function () {
            tooltip.remove();
        });

        var showToolTip = function () {
            $(tooltip).css("visibility", "visible");

        };

    };

    $("#test").addMovingToolTip("");

});