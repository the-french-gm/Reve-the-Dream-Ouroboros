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
function getHeight(character_size) {
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

    return height[character_size-6];
}

/*
 *
 */
function generateCharacteristics(is_dreamer = false) {
    var total_points = 160;

    var base_characteristics = [
        ['size', 0],
        ['appearance', 0],
        ['constitution', 0],
        ['strength', 0],
        ['agility', 0],
        ['dexterity', 0],
        ['sight', 0],
        ['hearing', 0],
        ['smell-taste', 0],
        ['will', 0],
        ['intellect', 0],
        ['empathy', 0],
        ['dream', 0],
        ['luck', 0],
        ['melee', 0],
        ['missile', 0],
        ['throw', 0],
        ['stealth', 0],
        ['life', 0],
        ['endurance', 0],
        ['sustenance', 0],
        ['damage-modifier', 0],
        ['encumbrance', 0],
        ['birth-hour', generateBirthHour()],
        ['gender', ''],
        ['age', getRandomInt(18, 40)],
        ['height', 0],
        ['beauty', 10],
        ['handedness', generateHandedness()]
    ]

    // first round of assigning values to characteristics
    // the algorithm is to assign between 6 and 10 
    $.each(base_characteristics, function(index, value) {
        var characteristic_points = 0;

        if(index > 13) {
            return;
        }

        if((value[0] == "dream") && !is_dreamer) {
            characteristic_points = getRandomInt(6, 10);
        }
        else if((value[0] == "dream") && is_dreamer) {
            characteristic_points = getRandomInt(12, 15);
        }
        else if((value[0] == "strength")) {
            // strength cannot be higher than size + 4
            characteristic_points = getRandomInt(9, base_characteristics[0][1]+4);
        }
        else {
            characteristic_points = getRandomInt(8, 11);
        }

        if(total_points - characteristic_points < 0) {
            return;
        }

        base_characteristics[index][1] = characteristic_points;
        total_points = total_points - characteristic_points;
    });

    /*
     * We randomly add any remaining points to the primary characteristics
     */
    while(total_points != 0) {
        index = getRandomInt(0, 13);
        inc = base_characteristics[index][1] + 1;

        if(inc <= 15) {
            base_characteristics[index][1] = inc;
            total_points--;
        }
    }

    // melee is the average of strength and agility, rounded down
    var melee = average_round_down(base_characteristics[3][1], base_characteristics[4][1]);
    base_characteristics[14][1] = melee;

    // missile is the average of sight and dexterity, rounded down
    var missile = average_round_down(base_characteristics[5][1], base_characteristics[6][1]);
    base_characteristics[15][1] = missile;

    // throw is the average of missile and strength, rounded down
    var throw_ = average_round_down(missile, base_characteristics[3][1]);
    base_characteristics[16][1] = throw_;

    // stealth is the average of agility + (21-size), rounded down
    var stealth = average_round_down(base_characteristics[4][1], (21 - base_characteristics[0][1]));
    base_characteristics[17][1] = stealth;

    // get the height based on the size
    base_characteristics[26][1] = getHeight(base_characteristics[0][1]);

    /*
     * Display the value in the HTML table
     */
    $.each(base_characteristics, function(index, value) {
        var characteristic = $('#'+value[0]);
        
        if(characteristic.length) {
            characteristic.text(value[1]);
        }
    });
}