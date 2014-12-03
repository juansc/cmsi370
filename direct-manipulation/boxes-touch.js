var BoxesTouch = {
    /**
     * Sets up the given jQuery collection as the drawing area(s).
     */
    setDrawingArea: function (jQueryElements) {
        // Set up any pre-existing box elements for touch behavior.
        jQueryElements
            .addClass("drawing-area")
            
            // Event handler setup must be low-level because jQuery
            // doesn't relay touch-specific event properties.
            .each(function (index, element) {
                element.addEventListener("touchstart", BoxesTouch.startDraw, false);                
                element.addEventListener("touchmove", BoxesTouch.trackDrag, false);
                element.addEventListener("touchend", BoxesTouch.endDrag, false);
            })

            .find("div.box").each(function (index, element) {
                element.addEventListener("touchstart", BoxesTouch.startMove, false);
                element.addEventListener("touchend", BoxesTouch.unhighlight, false);
            });

        BoxesTouch.topBound = $("#drawing-area").offset().top;
        BoxesTouch.leftBound = $("#drawing-area").offset().left;
        BoxesTouch.rightBound = $("#drawing-area").width() + $("#drawing-area").offset().left;
        BoxesTouch.bottomBound = $("#drawing-area").height() + $("#drawing-area").offset().top;
    },

    startDraw: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            touch.anchorX = touch.pageX;
            touch.anchorY = touch.pageY;
            touch.drawingBox = $("<div></div>")
                .appendTo($("#drawing-area"))
                .addClass("box new-box")
                .offset({ left: touch.pageX, top: touch.pageY });
            BoxesTouch.setupDragState($(touch.drawing));
        });
    },

    setupDragState: function (element) {
        element
            .unbind("touchstart")
            .unbind("touchmove")
            .unbind("touchend");        
    },
    /**
     * Tracks a box as it is rubberbanded or moved across the drawing area.
     */

    trackDrag: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Don't bother if we aren't tracking anything.
            //console.log(touch);
            if (touch.drawingBox) {
                if(!(touch.pageX > BoxesTouch.rightBound || touch.pageX < BoxesTouch.leftBound || touch.pageY < BoxesTouch.topBound || touch.pageY > BoxesTouch.bottomBound) ){  
                    var newOffset = {
                        left: (touch.anchorX < touch.pageX) ? touch.anchorX : touch.pageX,
                        top: (touch.anchorY < touch.pageY) ? touch.anchorY : touch.pageY
                    };

                    touch.drawingBox
                        .offset(newOffset)
                        .width(Math.abs(touch.pageX - touch.anchorX))
                        .height(Math.abs(touch.pageY - touch.anchorY));
                }
            }else if (touch.target.movingBox) {
                // Mark it if out of bounds.
                if(BoxesTouch.isOutOfBounds(touch.target.movingBox)){ 
                    touch.target.movingBox.addClass("box-out-of-bounds");
                } else{
                    touch.target.movingBox.removeClass("box-out-of-bounds");
                }

                // Reposition the object.
                touch.target.movingBox.offset({
                    left: touch.pageX - touch.target.deltaX,
                    top: touch.pageY - touch.target.deltaY
                });
            }
        });
        
        // Don't do any touch scrolling.
        event.preventDefault();
    },

    /**
     * Concludes a drawing or moving sequence.
     */
    endDrag: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            if (touch.drawingBox) {
                $(touch.drawingBox).bind("touchstart", BoxesTouch.startMove, false);
                $(touch.drawingBox).bind("touchend", BoxesTouch.unhighlight, false);
                $(touch.drawingBox).removeClass("new-box");
                touch.drawingBox = null;
            }else if (touch.target.movingBox) {
                // If out of bounds, remove.
                if(BoxesTouch.isOutOfBounds(touch.target.movingBox)) touch.target.movingBox.remove();
                // Change state to "not-moving-anything" by clearing out
                // touch.target.movingBox. 
                touch.target.movingBox = null;
            }
        });
    },

    /**
     * Indicates that an element is unhighlighted.
     */
    unhighlight: function () {
        $(this).removeClass("box-highlight");
    },

    /**
     * Begins a box move sequence.
     */
    startMove: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Highlight the element.
            $(touch.target).addClass("box-highlight");

            // Take note of the box's current (global) location.
            console.log($(touch.target));

            var jThis = $(touch.target),
                startOffset = jThis.offset();

            // Set the drawing area's state to indicate that it is
            // in the middle of a move.
            touch.target.movingBox = jThis;
            touch.target.width = jThis.width;
            touch.target.height = jThis.height;
            touch.target.deltaX = touch.pageX - startOffset.left;
            touch.target.deltaY = touch.pageY - startOffset.top;
        });

        // Eat up the event so that the drawing area does not
        // deal with it.
        event.stopPropagation();
    },

    isOutOfBounds: function( element ){
        return element.offset().left < BoxesTouch.leftBound || (element.offset().left + element.width()) > BoxesTouch.rightBound || element.offset().top < BoxesTouch.topBound || (element.offset().top + element.height()) > BoxesTouch.bottomBound;
    },

};
