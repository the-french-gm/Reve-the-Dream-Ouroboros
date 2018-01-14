(function() {

    var calculator = function() {
    };

    /*
     *
     */
    calculator.prototype = {
        /*
         * Calculate the damage multiplier of the character.
         */
        getDamageModifier: function(size, strength) {
            var dm = RDDJS.utils.average_round_down(size, strength);

            if(dm <= 7) {
                return '-1';
            }

            if(dm <= 11) {
                return 0;
            }

            if(dm <= 13) {
                return '+1';
            }

            if(dm <= 15) {
                return '+2'
            }

            return '+'+(2 + Math.floor((dm-15)/2));
        },

        /*
         * Calculate the height of the character.
         */
        getHeight: function(size) {
            var height = 1.52 + (0.05 * (size-6));
            height += (Math.random() * 0.04);
            height = height.toFixed(2);
            height = height+"m"
            return height;
        },

        /*
         *
         */
        getSustenance: function(size) {
            if(size <= 9) {
                return 2;
            }

            if(size <= 13) {
                return 3;
            }

            if(size <= 15) {
                return 4;
            }
        },

        /*
         *
         */
        getConstitutionThreshold: function(constitution) {
            if(constitution <= 8) {
                return 2;
            }

            if(constitution <= 11) {
                return 3;
            }

            if(constitution <= 14) {
                return 4;
            }

            if(constitution == 15) {
                return 5;
            }
        },

        /*
         *
         */
        getBeauty: function(beauty) {
            if(beauty >= 16) {
                return 'Stunning';
            }

            var values = {
                10 : 'Common',
                11 : 'Not Bad',
                12 : 'Attractive',
                13 : 'Cute',
                14 : 'Beautiful',
                15 : 'Very Beautiful',
                16 : 'Stunning'   
            }

            return values[beauty];
        },

        /*
        * @param difficult - the difficulty level of the skill
        * @param level - the skill level desired
        */
        calculateBaseCost: function(difficulty, level) {
            var indexes = {
                '-11' : 0,
                '-8' : 1,
                '-6' : 2,
                '-4' : 3
            }

            var cost_table = {
                '-10' : [5],
                '-9' : [10],
                '-8' : [15],
                '-7' : [25, 10],
                '-6' : [35, 20],
                '-5' : [45, 30, 10],
                '-4' : [55, 40, 20],
                '-3' : [70, 55, 35, 15],
                '-2' : [85, 70, 50, 30],
                '-1' : [100, 85, 65, 45],
                '0' : [115, 100, 80, 60],
                '1' : [135, 120, 100, 80],
                '2' : [155, 140, 120, 100],
                '3' : [175, 160, 140, 120],
                '4' : [195, 180, 160, 140],
                '5' : [225, 210, 190, 170],
                '6' : [255, 240, 230, 200],
                '7' : [295, 280, 270, 240],
                '8' : [335, 320, 310, 280],
                '9' : [395, 380, 370, 340],
                '10': [455, 440, 330, 400]
            }

            if(level <= 10) {
                return cost_table[level][indexes[difficulty]];
            }
            else {
                var cost = cost_table[10][indexes[difficulty]]
                cost += ((level-10)*100)
                return cost;
            }
        },

        calculateResolution: function(characteristic, skill, competency) {
            var sign = (competency <= 0) ? '-' : '+';
            var resolution = {}
            resolution[skill] = characteristic;

            var multiplier = 1;

            for(i = -7; i <= competency; i++) {
                multiplier += 0.5;
                resolution[skill] = characteristic * multiplier;
            }
            
            resolution[skill] = Math.round(resolution[skill]).toString()+'% ('+sign+competency+')';

            return resolution;
        }
    }

    $.extend(RDDJS.calculator, new calculator());

}());