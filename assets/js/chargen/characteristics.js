/*
 *
 */
function generateName(settings, gender) {
    /*
     * We adapt the data based on the genre of the game
     */
    if(settings['genre'] == 'contemporary') {
        return generateContemporaryName(gender);
    }

    if(settings['genre'] == 'fantasy') {
        return generateFantasyName();
    }
}

/*
 *
 */
function generateHandedness() {
    if(Math.random() >= 0.25) {
        return 'Right Handed';
    } else {
        return 'Left Handed';
    }
}

/*
 *
 */
function generateBirthHour() {
    birth_hours = [
        "Vessel",
        "Siren",
        "Falcon",
        "Crown",
        "Dragon",
        "Swords",
        "Lyre",
        "Serpent",
        "Flying Fish",
        "Spider",
        "Reed",
        "Sleeping Castle"
    ]

    return birth_hours[getRandomInt(0, birth_hours.length - 1)]
}

/*
 *
 */
function getHeight(size) {
    height = [
        "1.52m / 4'11\"",
        "1.57m / 5'1\"",
        "1.62m / 5'3\"",
        "1.67m / 5'5\"",
        "1.72m / 5'7\"",
        "1.77m / 5'9\"",
        "1.82m / 5'11\"",
        "1.87m / 6'1\"",
        "1.92m / 6'3\"",
        "1.97m / 6'5\""
    ]

    return height[size-6];
}

/*
 *
 */
function getSustenance(size) {
    if(size <= 9) {
        return 2;
    }

    if(size <= 13) {
        return 3;
    }

    if(size <= 15) {
        return 4;
    }
}

/*
 *
 */
function getGender() {
    var chance = getRandomInt(1, 100);

    if(chance <= 1) {
        return 'bigender';
    }

    if(chance <= 2) {
        return 'androgyne';
    }

    if(chance <= 3) {
        return 'neutrois';
    }

    if(chance <= 4) {
        return 'agender';
    }

    if(chance <= 5) {
        return 'demiman';
    }

    if(chance <= 6) {
        return 'demiwoman';
    }

    if(chance <= 7) {
        return 'genderqueer';
    }

    if(chance <= 8) {
        return 'polygender';
    }

    if(chance <= 9) {
        return 'epicene';
    }

    if(chance <= 10) {
        return 'genderfluid';
    }

    if(chance <= 11) {
        return 'transgender';
    }

    if(chance <= 56) {
        return 'female';
    }

    if(chance <= 100) {
        return 'male';
    }
}


/*
 *
 */
function getConstitutionThreshold(constitution) {
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
}

/*
 *
 */
function getBeauty(beauty) {
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
}

/*
 *
 */
function getDamageModifier(size, strength) {
    var dm = average_round_down(size, strength);

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
}

/*
 *
 */
function generateCharacteristics(settings) {
    var total_points = parseInt(settings['characteristic-points']);
    var max_points = parseInt(settings['max-characteristic-points']);
    var min_points = 6;
    
    if(max_points < min_points) {
        max_points = min_points;
    }

    var characteristics = {
        'size' : min_points,
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

    total_points -= (min_points * 14);

    /*
     * High dreamers are maxed out on Dream.
     */
    if(settings['high-dreamer']) {
        characteristics['dream'] = max_points;
    }

    /*
     * We apply the template
     */
    if(settings['template']) {
        $.each(settings['template']['characteristics'], function(index, characteristic) {
            // dream points have already been applied for high dreamers
            if(settings['high-dreamer'] && characteristic == "dream") {
                return;
            }

            var value = getRandomInt(Math.floor(max_points / 1.5), max_points);

            // we do not decrement the number of total points if beauty is below 10
            if((characteristic == "beauty") && (value < 10)) {
                characteristics['beauty'] = 10;
                return;
            }

            if((characteristic == "beauty") && (value > 10)) {
                characteristics['beauty'] = value;
                value -= 10;
            }

            // strength cannot be higher than size + 4.
            // this also means that size must always be calculated before strength!!
            if((characteristic == "strength") && value >= (characteristics['size'] + 4)) {
                value = (characteristics['size'] + 4);
            }

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
    var chars = Object.keys(characteristics);
    
    while((total_points != 0)) {
        key = chars[getRandomInt(0, chars.length - 1)];
        current_value = characteristics[key];
        
        // we reduce the chances of spending points on beauty by half
        if((key == "beauty") && (Math.random() >= 0.50)) {
            continue;
        }

        // strength cannot be higher than size + 4
        if(key == "strength") {
            if(current_value == (characteristics['size'] + 4)) {
                chars = removeItemFromArray(chars, "strength");
                continue;
            }
        }

        // size cannot be more than 15
        var max_size;
        if((key == "size") && current_value == 15) {
            chars = removeItemFromArray(chars, "size");
            continue;
        }

        if(current_value == max_points) {
            chars = removeItemFromArray(chars, key);
            continue;
        }

        characteristics[key]++;
        total_points--;

        // there is a small chance that size is final
        var odd = (Math.random() <= 0.15)
        if((key == "size") && odd) {
            chars = removeItemFromArray(chars, "size");
        }
    }

    // melee is the average of strength and agility, rounded down
    var melee = average_round_down(characteristics['strength'], characteristics['agility']);
    characteristics['melee'] = melee;

    // missile is the average of sight and dexterity, rounded down
    var missile = average_round_down(characteristics['sight'], characteristics['dexterity']);
    characteristics['missile'] = missile;

    // throw is the average of missile and strength, rounded down
    var throw_ = average_round_down(missile, characteristics['strength']);
    characteristics['throw'] = throw_;

    // stealth is the average of agility + (21-size), rounded down
    var stealth = average_round_down(characteristics['agility'], (21 - characteristics['size']));
    characteristics['stealth'] = stealth;

    // life is the average of size and constitution, rounded up
    var life = average_round_up(characteristics['size'], characteristics['constitution']);
    characteristics['life'] = life;

    // Encumbrance is the average of size and strength, rounded down
    var encumbrance = average_round_down(characteristics['size'], characteristics['strength']);
    characteristics['encumbrance'] = encumbrance;

    // Endurance is either Size + Constitution, or Will + Life, whichever is better
    var endurance_1 = characteristics['size'] + characteristics['constitution'];
    var endurance_2 = characteristics['will'] + characteristics['life'];
    characteristics['endurance'] = (endurance_1 >= endurance_2) ? endurance_1 : endurance_2;

    // Damage modifier
    var dm = getDamageModifier(characteristics['size'], characteristics['strength']);
    characteristics['damage-modifier'] = dm;

    // Calculate height
    var size_for_height = (characteristics['size'] > 15) ? 15 : characteristics['size'];
    characteristics['height'] = getHeight(size_for_height);

    // Other Characteristics
    characteristics['gender'] = getGender();
    characteristics['name'] = generateName(settings, characteristics['gender']);
    characteristics['sustenance'] = getSustenance(characteristics['size']);
    characteristics['birth-hour'] = generateBirthHour();
    characteristics['age'] = getRandomInt(18, 40);
    characteristics['handedness'] = generateHandedness();
    characteristics['high-dreamer'] = settings['high-dreamer'];
    characteristics['constitution-threshold'] = getConstitutionThreshold(characteristics['constitution']);
    characteristics['beauty'] = getBeauty(characteristics['beauty']) + ' (' + characteristics['beauty'] + ')';

    return characteristics;
}