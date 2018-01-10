(function() {
    
    var utils = function() {
    };

    /*
     *
     */
    utils.prototype = {
        /*
         * Generate a random integer between min and max.
         */
        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        /*
         * Remove an item from an array.
         */
        removeItemFromArray: function(array, element) {
            return array.filter(e => e !== element);
        },

        /*
         * Average two integers, round down.
         */
        average_round_down: function(int1, int2) {
            return Math.floor((int1 + int2) / 2);
        },

        /*
         * Average two integers, round up.
         */
        average_round_up: function(int1, int2) {
            return Math.ceil((int1 + int2) / 2);
        },

        /*
         * Shuffles an array. Returns results in a new array.
         */
        shuffleArray: function(o) {
            var o = o.slice();
            for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }
    }

    $.extend(RDDJS.utils, new utils());

}());