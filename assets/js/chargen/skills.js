/*
 * @param difficult - the difficulty level of the skill
 * @param level - the skill level desired
 */
function calculateCost(difficulty, level) {
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
        '3' : [175, 160, 140, 120]
    }

    return cost_table[level][indexes[difficulty]];
}

/*
 *
 */
function assignSkillPointsAndXP(points, skills, is_dreamer) {

    var acquired_skills = {};

    while((points / 10) >= 1) {
        var index = getRandomInt(0, skills.length-1);
        var skill = skills[index];
        var difficulty = skill[1];

        /*
         * Random skill generation
         */
        var index = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3]
        if(is_dreamer && ['thanatos', 'oneiros', 'hypnos', 'narcos'].includes(skill[0])) {
            var level = getRandomInt(5, 13);
        }
        else if(!is_dreamer && ['thanatos', 'oneiros', 'hypnos', 'narcos'].includes(skill[0])) {
            var level = getRandomInt(0, 5);
        }
        else {
            var level = getRandomInt(0, 13);
        }

        level = index[level];

        /*
         * We calculate the cost of acquiring the skill
         */
        var i = 0;
        var cost;

        while(cost = calculateCost(difficulty, (level-i))) {
            if((points-cost) < 0) {
                i++;
            } else {
                break;
            }
        }

        if(cost) {
            points -= cost;
            acquired_skills[skill[0]] = level;
            $("#"+skill[0]).text(level);
        }
    }

    /*
     * We assign the remaining points to the experience section
     * of a random skill.
     */
    if(points != 0) {
        var index = getRandomInt(0, skills.length-1);
        var skill = skills[index];
        $("#exp-"+skill[0]).text(points);
    }

    return acquired_skills;
}

/*
 * Adds the spell to the UI.
 */
function displaySpell(spell) {
    var html = '';
    var table = $('#spells-table');

    if(!table) {
        console.log("error: spells table is missing");
        return;
    }

    if(spell.length != 6) {
        console.log("error: the spell should be an array with 6 items");
        return;
    }

    html += '<tr>'
    html += '<td>'+spell[0]+'</td>'
    html += '<td>'+spell[1]+'</td>'
    html += '<td>'+spell[2]+'</td>'
    html += '<td>'+spell[3]+'</td>'
    html += '<td>'+spell[4]+'</td>'
    html += '<td>'+spell[5]+'</td>'
    html += '</tr>'

    table.append(html);
}

/*
 *
 */
function assignSpellPointsAndXP(skills, spells_points, spells) {
    var draconics = {};
    var acquired_spells = [];

    $.each(skills, function(index, value) {
        if(['oneiros', 'narcos', 'hypnos', 'thanatos'].indexOf(index) > -1) {
            draconics[index] = value;
        }
    });

    var length;

    while((length = Object.keys(draconics).length) > 0) {
        var index = getRandomInt(0, length - 1);
        var draconic = Object.keys(draconics)[index];
        var level = draconics[draconic];
        var d_spells = shuffleArray(spells[draconic]);

        var spell;

        while(d_spells.length > 0) {
            spell = d_spells.pop();

            var difficulty = parseInt(spell[2].replace('D', ''));
            var cost = Math.abs(difficulty * 10);

            if(!cost) {
                spell = null;
                //todo: hunt for problematic spells
                continue;
            }

            /*
             * The character does not learn the same spell twice.
             */
            if(acquired_spells.indexOf(spell[0]) > -1) {
                spell = null;
                continue;
            }
            
            /*
             * A character that has -X in Oneiros cannot, initially,
             * learn spells below -5.
             */
            if((level < 0) && (difficulty < -5)) {
                spell = null;
                continue;
            }

            /*
             * A character with +2 in Hypnos cannot, initially,
             * learn spells below -7.
             */
            if((level > 0) && (difficulty < (-5 - level))) {
                spell = null;
                continue;
            }

            /*
             * A character with +3 in Hypnos, who wants to buy
             * a spell at -8, would need to pay (8x10) + (3x20)
             * in additional cost.
             */
            if(difficulty < -5) {
                var additional_cost = Math.abs(difficulty + 5);
                cost += additional_cost;
            }

            /*
             * Thanatos spells cost double.
             */
            if(draconic == 'thanatos') {
                cost = cost * 2;
            }

            if((spells_points-cost) > 0) {
                spells_points -= cost;
                spell = [draconic].concat(spell.concat(cost));
                displaySpell(spell);
                break;
            }
        }

        if(d_spells.length == 0) {
            delete draconics[draconic];
        }
    }
}

/*
 *
 */
function generateSkills(skills, spells, is_dreamer = false) {
    var total_points = 3000;
    var spells_points = getRandomInt(0, total_points / 3.5);
    var skills_points = total_points - spells_points;

    var skills_list = [];
    
    $.each(skills, function(key, value) {
        difficulty = value[0];
        $.each(value[1], function(index, skill) {
            skills_list.push([skill, difficulty]);
            $("#exp-"+skill).text("  ");
            $("#"+skill).text("  ");
        });
    });

    var skills = assignSkillPointsAndXP(skills_points, skills_list, is_dreamer);
    var spells = assignSpellPointsAndXP(skills, spells_points, spells);

    $("#skills_points").text(skills_points);
    $("#spells_points").text(spells_points);
}