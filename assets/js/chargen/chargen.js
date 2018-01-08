//
var global_skills;
var global_spells;

/*
 *
 */
function getSettings() {
    var settings = {};

    /*
     * Language Settings
     */
    settings['language'] = $('.lang-btn').text();

    if(settings['language'] == 'Français') {
        settings['language'] = 'en';
    }
    else {
        settings['language'] = 'fr';
    }

    /*
     * Generator Settings
     */
    settings['characteristic-points'] = $('.setting-characteristic-points').val();
    settings['max-characteristic-points'] = $('.setting-max-characteristic-points').val();
    settings['skill-points'] = $('.setting-skill-points').val();
    settings['build'] = $('.setting-build option:selected').val().toLowerCase();
    settings['location'] = $('.setting-location option:selected').val().toLowerCase();
    settings['high-dreamer'] = $('.setting-high-dreamer option:selected').val();
    settings['genre'] = $('.setting-genre option:selected').val().toLowerCase();

    /*
     *
     */
    if(settings['high-dreamer'] == 'random') {
        settings['high-dreamer'] = (Math.random() <= 0.25) ? true : false;
    }
    else if(settings['high-dreamer'] == 'yes') {
        settings['high-dreamer'] = true;
    }
    else {
        settings['high-dreamer'] = false;
    }

    /*
     *
     */
    if(settings['build'] != 'none') {
        settings['template'] = character_templates[settings['build']];
        settings['build'] = true;
    }
    else {
        settings['template'] = false;
        settings['build'] = false;
    }

    if(settings['location'] != 'random') {
        var location = location_templates[settings['location']]

        if(location) {
            if(!settings['template']) {
                settings['template'] = {
                    "settings": {},
                    "characteristics": [],
                    "primary-skills": [],
                    "secondary-skills": []
                };
                
                settings['build'] = true;
            }

            $.extend(settings['template']['primary-skills'], location['primary-skills']);
            $.extend(settings['template']['secondary-skills'], location['secondary-skills']);

            
        }
    }

    /*
     *
     */
    var template_settings = settings['template']['settings'];

    if(template_settings) {
        $.each(template_settings, function(index, value) {
            settings[index] = value;
        });
    }

    return settings;
}

/*
 *
 */
function generateCharacter(skills) {
    /*
     * We save global variable.
     * I know that's an ugly solution, but what the hell!
     * That way we avoid possible bugs.
     */
    if(!skills) {
        skills = global_skills;
    }
    else {
        global_skills = skills;
    }

    if(!spells) {
        spells = global_spells;
    }
    else {
        global_spells = spells;
    }
    
    /*
     * Generate the character :)
     */
    var settings = getSettings();
    var characteristics = generateCharacteristics(settings);
    //var archetype = generateArchetype(settings, skills);
    var skills = generateSkills(settings, skills, spells);

    /*
     * Display the characteristics in the HTML table
     */ 
    $.each(characteristics, function(key, value) {
        var characteristic = $('#'+key);
        
        if(characteristic.length) {
            characteristic.text(value);
        }
    });
}