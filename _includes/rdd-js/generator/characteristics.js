(function() {

    var characteristic_generator = function() {
    };

    /*
     *
     */
    characteristic_generator.prototype = {
        /*
         *
         */
        generate: function(settings) {

            var total_points = parseInt(settings['characteristic-points']);
            var max_points = parseInt(settings['max-characteristic-points']);
            var min_points = Math.floor(total_points / 14);

            if(max_points < min_points) {
                max_points = min_points;
            }

            var characteristics = {
                'size' : settings['size'] || min_points,
                'appearance' : min_points,
                'constitution' : min_points,
                'strength' : min_points,
                'agility' : min_points,
                'dexterity' : min_points,
                'sight' : min_points,
                'hearing' : min_points,
                'smell-taste' : min_points,
                'will' : min_points,
                'intellect' : min_points,
                'empathy' : min_points,
                'dream' : min_points,
                'luck' : min_points,
                'beauty' : 10
            }

            var chars = Object.keys(characteristics);
            
            /*
             * We remove all the points already added in the default template.
             */
            total_points -= (min_points * 14);
            
            /*
             * High dreamers are maxed out on Dream.
             */
            if(settings['high-dreamer']) {
                total_points += characteristics['dream'];
                characteristics['dream'] = max_points;
                total_points -= max_points;
            }

            if(total_points < 0) {
                console.log("error: improper value received for the total_points");
                return characteristics;
            }
            
            /*
             * We apply the template
             */
            if(settings['template']) {
                $.each(settings['template']['characteristics'], function(index, characteristic) {
                    var value;

                    // dream points have already been applied for high dreamers
                    if(settings['high-dreamer'] && characteristic == "dream") {
                        return;
                    }

                    if(settings[characteristic]) {
                        value = settings[characteristic];
                        chars = RDDJS.utils.removeItemFromArray(chars, settings[characteristic]);
                    }
                    else {
                        value = RDDJS.utils.getRandomInt(Math.floor(max_points / 1.5), max_points);
                    }
                    
                    // we do not decrement the number of total points if beauty is below 10
                    // beauty cannot be above 16
                    if((characteristic == "beauty") && (value < 10)) {
                        characteristics['beauty'] = 10;
                        return;
                    }

                    if((characteristic == "beauty") && (value > 10)) {
                        characteristics['beauty'] = value;
                        value -= 10;
                    }

                    if((characteristic == "beauty" && (value > 16))) {
                        value = 16;
                    }

                    // strength cannot be higher than size + 4.
                    // this also means that size must always be calculated before strength!!
                    if((characteristic == "strength") && value >= (characteristics['size'] + 4)) {
                        value = (characteristics['size'] + 4);
                    }

                    total_points += characteristics[characteristic]

                    while((total_points-value) <= 0) {
                        value--;
                    }

                    characteristics[characteristic] = value;
                    total_points -= value;
                });
            }

            /*
             * We randomly add any remaining points to the primary characteristics
             */
            while((total_points != 0)) {
                key = chars[RDDJS.utils.getRandomInt(0, chars.length - 1)];
                current_value = characteristics[key];
                
                if(key == "beauty") {
                    // we reduce the chances of spending points on beauty by half
                    if(Math.random() >= 0.50) {
                        continue;
                    }
                    // beauty cannot be more than 16
                    if(current_value >= 16) {
                        continue;
                    }
                }
                
                // strength cannot be higher than size + 4
                if(key == "strength") {
                    if(current_value == (characteristics['size'] + 4)) {
                        chars = RDDJS.utils.removeItemFromArray(chars, "strength");
                        continue;
                    }
                }

                // size cannot be more than 15 or max-size
                var max_size;
                if(key == "size") {
                    if(current_value == 15 && !settings['max-size']) {
                        chars = RDDJS.utils.removeItemFromArray(chars, "size");
                        continue;
                    }
                    
                    if(current_value == parseInt(settings['max-size'])) {
                        chars = RDDJS.utils.removeItemFromArray(chars, "size");
                        continue;
                    }
                }

                if(current_value == max_points) {
                    chars = RDDJS.utils.removeItemFromArray(chars, key);
                    continue;
                }

                characteristics[key]++;
                total_points--;

                // there is a small chance that size is final
                var odd = (Math.random() <= 0.15)
                if((key == "size") && odd) {
                    chars = RDDJS.utils.removeItemFromArray(chars, "size");
                }
            }

            // melee is the average of strength and agility, rounded down
            var melee = RDDJS.utils.average_round_down(characteristics['strength'], characteristics['agility']);
            characteristics['melee'] = melee;

            // missile is the average of sight and dexterity, rounded down
            var missile = RDDJS.utils.average_round_down(characteristics['sight'], characteristics['dexterity']);
            characteristics['missile'] = missile;

            // throw is the average of missile and strength, rounded down
            var throw_ = RDDJS.utils.average_round_down(missile, characteristics['strength']);
            characteristics['throw'] = throw_;

            // stealth is the average of agility + (21-size), rounded down
            var stealth = RDDJS.utils.average_round_down(characteristics['agility'], (21 - characteristics['size']));
            characteristics['stealth'] = stealth;

            // life is the average of size and constitution, rounded up
            var life = RDDJS.utils.average_round_up(characteristics['size'], characteristics['constitution']);
            characteristics['life'] = life;

            // Encumbrance is the average of size and strength, rounded down
            var encumbrance = RDDJS.utils.average_round_down(characteristics['size'], characteristics['strength']);
            characteristics['encumbrance'] = encumbrance;

            // Endurance is either Size + Constitution, or Will + Life, whichever is better
            var endurance_1 = characteristics['size'] + characteristics['constitution'];
            var endurance_2 = characteristics['will'] + characteristics['life'];
            characteristics['endurance'] = (endurance_1 >= endurance_2) ? endurance_1 : endurance_2;

            // Damage modifier
            var dm = RDDJS.calculator.getDamageModifier(characteristics['size'], characteristics['strength']);
            characteristics['damage-modifier'] = dm;
            
            // Calculate height
            characteristics['height'] = RDDJS.calculator.getHeight(characteristics['size']);
            
            characteristics['sustenance'] = RDDJS.calculator.getSustenance(characteristics['size']);
            characteristics['constitution-threshold'] = RDDJS.calculator.getConstitutionThreshold(characteristics['constitution']);
            characteristics['beauty'] = RDDJS.calculator.getBeauty(characteristics['beauty']) + ' (' + characteristics['beauty'] + ')';

            return characteristics;
        }
        
    }

    $.extend(RDDJS.generator.characteristics, new characteristic_generator());

}());