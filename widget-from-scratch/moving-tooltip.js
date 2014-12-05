$.fn.addMovingToolTip = function (str) {
    var keyCodeForP = 80;
    var tooltip, tooltipX, tooltipY, tooltipTimeout;
    var elem = this;
    var isPinned = false;
    this.mousemove(function (event) {
        tooltipX = event.pageX;
        tooltipY = $(tooltip).parent().offset().top+20;
        if(!isPinned){
            tooltip.offset({
                top: tooltipY,
                left: tooltipX
            });
        }
    });
    this.mouseenter(function () {
        if(!tooltip){
            tooltip = $("<div><div>")
                .addClass("tooltip")
                .appendTo(elem)
                .html(str + "<br><font size=\"1\">Press 'P' to Pin</font>")
                .css("visibility", "hidden")
                .offset({
                    top: tooltipY,
                    left: tooltipX})
                .on("mousemove mouseenter mouseleave", function(event){ event.stopPropagation();});
            tooltipTimeout = setTimeout(showToolTip, 1000);
        }
    });
    this.mouseleave(function (){
        if(tooltip.css("visibility") === "hidden"){
            clearTimeout(tooltipTimeout);
            removeToolTip();
            return;
        }
        if(!isPinned) removeToolTip();
    });

    var showToolTip = function () {
        $(tooltip).css("visibility", "visible").addClass("readyToBePinned");
    };
    var removeToolTip = function(){
        tooltip.remove();
        isPinned = false;
        tooltip = null;
    }

    $(document).keydown( function(){
        if(tooltip && tooltip.hasClass("readyToBePinned") && event.which === keyCodeForP) { 
            tooltip.removeClass("readyToBePinned")
            tooltip.html(str + "<br><font size=\"1\">Click to Dismiss</font>");
            isPinned = true;
            tooltip.click(removeToolTip);
        }                   
    });

};