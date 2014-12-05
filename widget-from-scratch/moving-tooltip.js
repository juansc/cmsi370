$(document).ready(function () {
    $.fn.addMovingToolTip = function (str) {
        var tooltipTimeout;
        var length = str.length;
        var tooltip, tooltipX, tooltipY;
        var elem = $(this);
        this.mousemove(function (event) {
            tooltipX = event.pageX;
            tooltipY = $(tooltip).parent().offset().top+20;
            tooltip.offset({
                top: tooltipY,
                left: tooltipX
            });
        });
        this.mouseenter(function () {
            if(!tooltip){
                tooltip = $("<div><div>")
                    .addClass("tooltip")
                    .appendTo(elem)
                    .html(str + "<br><font size=\"1\">Click to dismiss</font>")
                    .css("visibility", "hidden")
                    .offset({
                    top: tooltipY,
                    left: tooltipX
                }).mousemove(function(event){
                    event.stopPropagation();                
                }).mouseenter(function(event){
                    event.stopPropagation();
                }).click(function(event){
                    tooltip.remove();
                    tooltip = null;                    
                });
                tooltipTimeout = setTimeout(showToolTip, 1000);
            }
            console.log(tooltip.css("visibility"));
        });
        this.mouseleave(function (){
            if(tooltip.css("visibility") === "hidden"){
                clearTimeout(tooltipTimeout);
                tooltip = null;
            }
        });

        var showToolTip = function () {
            $(tooltip).css("visibility", "visible");
        };

    };

    $("#test").addMovingToolTip("Hello, there!!");
    $("#test2").addMovingToolTip("I hate you...");

});

