(function() {

    var archetype = function() {
    };

    /*
        *
        */
    archetype.prototype = {
        /*
            * Generates a new archetype
            */
        generate: function(settings) {
            var all_skills = [];
            var archetype = {};

            $.each(RDDJS.skills, function(key, value) {
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

                var index = RDDJS.utils.getRandomInt(0, all_skills.length - 1);
                var skill = all_skills[index];

                archetype[skill] = '+'+i;
                all_skills = RDDJS.utils.removeItemFromArray(all_skills, skill);

                if(count >= max_count) {
                    if(i > 0) {
                        i--;
                    }
                    count = 0;
                }
            }

            return archetype;
        }
    }

    $.extend(RDDJS.generator.archetype, new archetype());
}());