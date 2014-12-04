$.fn.addMovingToolTip(str, height, width){
    var mouseX, mouseY;
    this.mousemove( function(event) {
        $(".tooltip").offset({
            top: event.pageY + 20,
            left: event.pageX
        });        
    });
    var tooltipTimeout;
    var length = str.length;
    var tooltipHeight = height || Math.floor(length/80 + 1);
    var tooltipWidth =  width || 4/3*height;
    var tooltip = $("<div><div>")
        .addClass("tooltip")
        .css("visibility", "hidden")
        .width(tooltipWidth)
        .height(tooltipHeight)
        .html(str);    
    this.hover( function() {
        tooltipTimeout = setTimeout(tooltip.css("visibility", "visible"), 500);
    }, 
    tooltip.css("visibility", "hidden"));
}
