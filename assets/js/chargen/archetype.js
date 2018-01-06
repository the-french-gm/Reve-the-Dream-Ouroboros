/*
 *
 */
function generateArchetype(is_dreamer = null, skills) {
    var all_skills = [];

    $.each(skills, function(key, value) {

        // We don't give draconic skills to characters that are not high-dreamers.
        if(key == "draconic" && !is_dreamer) {
            return;
        }

        $.each(value[1], function(index, value) {
            all_skills.push(value);
        });
    });

    /*
     * We assign the archetype skills
     */
    var i = 11;
    var count = 0;
    
    while(all_skills.length != 0) {
        var max_count = (12 - i)
        count++;

        var index = getRandomInt(0, all_skills.length - 1);
        var skill = all_skills[index];

        $("#arch-"+skill).text("+"+i);
        all_skills = removeItemFromArray(all_skills, skill);

        if(count >= max_count) {
            i--;
            count = 0;
        }
    }
}