function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

(function() {
    /*
     * We add a unique() function to Array
     */
    Array.prototype.unique = function() {
        return this.filter(function (value, index, self) { 
        return self.indexOf(value) === index;
        });
    }

    // Define our constructor
    this.RDDJS = function() {
        this.settings = {};

        this.defaults = {
            "high-dreamer" : (Math.random() <= 0.25) ? true : false,
            "characteristic-points" : 160,
            "skill-points" : 3000,
            "max-characteristic-points" : 15,
            "max-skill" : +3
        }
    }

    /*
     * Public objects and variables
     */
    RDDJS.utils = {};
    RDDJS.calculator = {};
    RDDJS.generator = {};
    RDDJS.generator.character = {};
    RDDJS.generator.characteristics = {};
    RDDJS.generator.skills = {};
    RDDJS.generator.archetype = {};

    /*
     * Reve de Dragon's Skills
     */
    RDDJS.skills;
    {% include rdd-js/templates/skills.js %}

    /*
     * Reve de Dragon's Spells
     */
    RDDJS.spells;
    {% include rdd-js/templates/spells.js %}

    /*
     * Character Templates
     */
    RDDJS.templates = {};

    {% include rdd-js/templates/classes/archer.js %}
    {% include rdd-js/templates/classes/assassin.js %}
    {% include rdd-js/templates/classes/barbarian.js %}
    {% include rdd-js/templates/classes/cyan.js %}
    {% include rdd-js/templates/classes/droll.js %}
    {% include rdd-js/templates/classes/faun.js %}
    {% include rdd-js/templates/classes/feracat.js %}
    {% include rdd-js/templates/classes/giant.js %}
    {% include rdd-js/templates/classes/gnome.js %}
    {% include rdd-js/templates/classes/healer.js %}
    {% include rdd-js/templates/classes/hounder.js %}
    {% include rdd-js/templates/classes/mercenary.js %}
    {% include rdd-js/templates/classes/mockturtle.js %}
    {% include rdd-js/templates/classes/ogre.js %}
    {% include rdd-js/templates/classes/proudarm.js %}
    {% include rdd-js/templates/classes/repvile.js %}
    {% include rdd-js/templates/classes/sailor.js %}
    {% include rdd-js/templates/classes/saurian.js %}
    {% include rdd-js/templates/classes/scholar.js %}
    {% include rdd-js/templates/classes/snork.js %}
    {% include rdd-js/templates/classes/soldier.js %}
    {% include rdd-js/templates/classes/street-artist.js %}
    {% include rdd-js/templates/classes/sylvan.js %}
    {% include rdd-js/templates/classes/thanatos-mage.js %}
    {% include rdd-js/templates/classes/traveler.js %}
    {% include rdd-js/templates/classes/villager.js %}
    {% include rdd-js/templates/classes/warrior.js %}
    {% include rdd-js/templates/classes/white-mage.js %}
    
    /*
     * Location Templates
     */
    RDDJS.locations = {};
    
    {% include rdd-js/templates/locations/artic.js %}
    {% include rdd-js/templates/locations/city.js %}
    {% include rdd-js/templates/locations/desert.js %}
    {% include rdd-js/templates/locations/forest.js %}
    {% include rdd-js/templates/locations/mountain.js %}
    {% include rdd-js/templates/locations/ocean.js %}
    {% include rdd-js/templates/locations/outdoor.js %}
    {% include rdd-js/templates/locations/swamp.js %}
    {% include rdd-js/templates/locations/underground.js %}

    /*
     *
     */
    RDDJS.prototype.getSettings = function() {
        var settings;

        if(Object.keys(this.settings).length != 0) {
            settings = this.settings;
        } else {
            settings = this.defaults;
        }

        /* 
         * We apply the template's settings if present.
         */
        if(settings["template"]) {
            settings["build"] = settings["template"];
            settings["template"] = RDDJS.templates[settings["template"]];
            var template_settings = settings["template"]["settings"];

            if(template_settings) {
                $.each(template_settings, function(index, value) {
                    settings[index] = value;
                });
            }
        }

        /*
         * We apply the location settings and template is specified
         */
        if(settings["location"]) {
            var location = RDDJS.locations[settings["location"]]
    
            if(location) {
                if(!settings["template"]) {
                    settings["template"] = {
                        "settings": {},
                        "characteristics": [],
                        "primary-skills": [],
                        "secondary-skills": []
                    };
                }
    
                settings["template"]["primary-skills"] = settings["template"]["primary-skills"].concat( location["primary-skills"]).unique();
                
                if(settings["template"]["secondary-skills"]) {
                    settings["template"]["secondary-skills"] = settings["template"]["secondary-skills"].concat(location["secondary-skills"]);
                }
            }
        }

        return settings;
    }

    /*
     *
     */
    RDDJS.prototype.caculateResolutions = function(character) {
        var resolutions = {};

        $.each(['draconic', 'melee', 'mt'], function(index, value) {
            var characteristic;
            var skills = RDDJS.skills[value][1];
            
            if(value == 'draconic') {
                characteristic = 'dream'
            }
            else if(value == 'mt') {
                characteristic = 'missile'
            }
            else {
                characteristic = value;
            }

            characteristic = character["characteristics"][characteristic];

            $.each(skills, function(index, skill) {
                var competency = character['skills'][skill];

                if(competency) {
                    var odds = RDDJS.calculator.calculateResolution(
                        characteristic,
                        skill,
                        competency
                        );

                    $.extend(resolutions, odds);
                }
            });
        });

        return resolutions;
    }

    /*
     * Generate a new character
     */
    RDDJS.prototype.generateCharacter = function() {
        var settings = this.getSettings();
        
        var character = RDDJS.generator.character.generate(settings);
        character["skills"] = {};
        character["spells"] = {};
        character["characteristics"] = RDDJS.generator.characteristics.generate(settings);
        RDDJS.generator.skills.distributeSkillPoints(settings);
        character["skill-points"] = RDDJS.generator.skills.skill_points;
        character["spell-points"] = RDDJS.generator.skills.spell_points;
        character["skills"] = RDDJS.generator.skills.generateSkills(settings);
        character["spells"] = RDDJS.generator.skills.generateSpells(settings);
        character["archetype"] = RDDJS.generator.archetype.generate(settings);

        character["remaining-points"] = RDDJS.generator.skills.getRemainingPoints() || 0;
        character["build"] = this.settings["build"] || '';
        character["resolutions"] = this.caculateResolutions(character);
        
        return character;
    }

    /*
     * Load a new template
     */
    RDDJS.prototype.loadTemplate = function(name, configuration) {
        this.templates[name] = configuration;
    }
    
    /*
     * Load a new template
     */
    RDDJS.prototype.setSettings = function(settings) {
        this.settings = settings;
    }

}());

{% include rdd-js/utils.js %}
{% include rdd-js/calculator.js %}
{% include rdd-js/generator/character.js %}
{% include rdd-js/generator/characteristics.js %}
{% include rdd-js/generator/skills.js %}
{% include rdd-js/generator/archetype.js %}