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

    if(chance <= 45) {
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
function generateCharacteristics(is_dreamer = null) {
    if(is_dreamer == null) {
        is_dreamer = Math.random() >= 0.5;
    }

    var total_points = 160;

    var characteristics = {
        'size' : 0,
        'appearance' : 0,
        'constitution' : 0,
        'strength' : 0,
        'agility' : 0,
        'dexterity' : 0,
        'sight' : 0,
        'hearing' : 0,
        'smell-taste' : 0,
        'will' : 0,
        'intellect' : 0,
        'empathy' : 0,
        'dream' : 0,
        'luck' : 0,
        'beauty' : 10
    }

    // first round of assigning values to characteristics
    // the algorithm is to assign between 6 and 10 
    $.each(characteristics, function(key, value) {
        var characteristic_points = 0;

        if((key == "dream") && !is_dreamer) {
            characteristic_points = getRandomInt(6, 10);
        }
        else if((key == "dream") && is_dreamer) {
            characteristic_points = getRandomInt(12, 15);
        }
        else if(key == "strength") {
            // strength cannot be higher than size + 4
            characteristic_points = getRandomInt(9, characteristics['size'] + 4);
        }
        else if(key == "beauty") {
            return;
        }
        else {
            characteristic_points = getRandomInt(7, 11);
        }

        if(total_points - characteristic_points < 0) {
            return;
        }

        characteristics[key] = characteristic_points;
        total_points = total_points - characteristic_points;
    });

    /*
     * We randomly add any remaining points to the primary characteristics
     */
    while(total_points != 0) {
        key = Object.keys(characteristics)[getRandomInt(0, Object.keys(characteristics).length - 1)];

        // we reduce the chances of spending points on beauty by half
        if((key == "beauty") && (Math.random() >= 0.50)) {
            continue;
        }

        inc = characteristics[key] + 1;

        if(inc <= 15) {
            characteristics[key] = inc;
            total_points--;
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

    // Other Characteristics
    characteristics['height'] = getHeight(characteristics['size']);
    characteristics['sustenance'] = getSustenance(characteristics['size']);
    characteristics['birth-hour'] = generateBirthHour();
    characteristics['gender'] = getGender();
    characteristics['age'] = getRandomInt(18, 40);
    characteristics['handedness'] = generateHandedness();
    characteristics['high-dreamer'] = (is_dreamer ? 'Yes' : 'No');
    characteristics['constitution-threshold'] = getConstitutionThreshold(characteristics['constitution']);
    characteristics['beauty'] = getBeauty(characteristics['beauty']) + ' (' + characteristics['beauty'] + ')';

    return characteristics;
}