    $.fn.addMovingToolTip = function (str) {
        var keyCodeForP = 80;
        var tooltipTimeout;
        var length = str.length;
        var tooltip, tooltipX, tooltipY;
        var elem = $(this);
        var isPinned = false;
        this.mousemove(function (event) {
            tooltipX = event.pageX;
            tooltipY = $(tooltip).parent().offset().top+20;
            if(!isPinned && tooltip){
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
                    left: tooltipX
                }).mousemove(function(event){
                    event.stopPropagation();                
                }).mouseenter(function(event){
                    event.stopPropagation();
                }).mouseleave(function(event){
                    event.stopPropagation();
                });
                tooltipTimeout = setTimeout(showToolTip, 1000);
            }
        });
        this.mouseleave(function (){
            if(tooltip.css("visibility") === "hidden"){
                clearTimeout(tooltipTimeout);
                tooltip.unbind();
                tooltip = null;
                return;
            }
            console.log("calling it here");
            if(!isPinned) removeToolTip();
        });

        var showToolTip = function () {
            $(tooltip).css("visibility", "visible").addClass("visibleToolTip");
        };
        var removeToolTip = function(){
            tooltip.unbind();
            tooltip.remove();
            isPinned = false;
            tooltip = null;
        }

        $(document).keydown( function(){
            if(tooltip && event.which == keyCodeForP && tooltip.hasClass("visibleToolTip")){
                console.log(tooltip);
                tooltip.html(str + "<br><font size=\"1\">Click to Dismiss</font>");
                isPinned = true;
                tooltip.click(removeToolTip);
            }                   
        });

    };

    $("#test").addMovingToolTip("Hello, there!!");
    $("#test2").addMovingToolTip("I hate you...");


