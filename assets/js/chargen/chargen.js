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
function generateCharacter() {
    var settings = getSettings();
    var characteristics = generateCharacteristics(settings);
    //var archetype = generateArchetype(settings, skills);
    //var skills = generateSkills(settings, skills, spells, is_dreamer);

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