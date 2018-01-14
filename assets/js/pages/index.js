$(document).ready(function($) {
    jQuery('#banner-slider').slippry({
        // general elements & wrapper
        slippryWrapper: '<div class="sy-box pictures-slider" />',

        // options
        adaptiveHeight: false, // height of the sliders adapts to current slide
        captions: false, // Position: overlay, below, custom, false

        // pager
        pager: false,
        
        // controls
        controls: false,
        autoHover: false,

        // transitions
        transition: 'kenburns', // fade, horizontal, kenburns, false
        kenZoom: 500,
        speed: 5000 // time the transition takes (ms)
    });

    //for each element that is classed as 'pull-down', set its margin-top to the difference between its own height and the height of its parent
    $('.pull-down').each(function() {
        var $this = $(this);
        $this.css('margin-top', $this.parent().height() - $this.height())
    });
});