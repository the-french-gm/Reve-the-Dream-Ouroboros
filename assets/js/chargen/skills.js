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
    while((points / 10) >= 1) {
        var index = getRandomInt(0, skills.length-1);
        var skill = skills[index];
        var difficulty = skill[1];

        /*
         * Random skill generation
         */
        var index = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3]
        if(is_dreamer && ['thanatos', 'oneiros', 'hypnos', 'narcos'].includes(skill[0])) {
            console.log("test")
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
}

/*
 *
 */
function generateSkills(skills, is_dreamer = false) {
    var total_points = 3000;
    var spells_points = getRandomInt(0, total_points / 3.5);
    var skills_points = total_points - spells_points;

    var skills_list = [];
    
    $.each(skills, function(key, value) {
        difficulty = value[0];
        $.each(value[1], function(index, skill) {
            skills_list.push([skill, difficulty]);
        });
    });

    assignSkillPointsAndXP(skills_points, skills_list, is_dreamer);
    $("#spell_points").text(spells_points);
}