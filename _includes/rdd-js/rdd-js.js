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
    RDDJS.generator.plot = {};

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

    {% include rdd-js/templates/humanoids/archer.js %}
    {% include rdd-js/templates/humanoids/assassin.js %}
    {% include rdd-js/templates/humanoids/barbarian.js %}
    {% include rdd-js/templates/humanoids/cyan.js %}
    {% include rdd-js/templates/humanoids/droll.js %}
    {% include rdd-js/templates/humanoids/faun.js %}
    {% include rdd-js/templates/humanoids/feracat.js %}
    {% include rdd-js/templates/humanoids/giant.js %}
    {% include rdd-js/templates/humanoids/gnome.js %}
    {% include rdd-js/templates/humanoids/healer.js %}
    {% include rdd-js/templates/humanoids/hounder.js %}
    {% include rdd-js/templates/humanoids/mercenary.js %}
    {% include rdd-js/templates/humanoids/mockturtle.js %}
    {% include rdd-js/templates/humanoids/ogre.js %}
    {% include rdd-js/templates/humanoids/proudarm.js %}
    {% include rdd-js/templates/humanoids/repvile.js %}
    {% include rdd-js/templates/humanoids/sailor.js %}
    {% include rdd-js/templates/humanoids/saurian.js %}
    {% include rdd-js/templates/humanoids/scholar.js %}
    {% include rdd-js/templates/humanoids/snork.js %}
    {% include rdd-js/templates/humanoids/soldier.js %}
    {% include rdd-js/templates/humanoids/street-artist.js %}
    {% include rdd-js/templates/humanoids/sylvan.js %}
    {% include rdd-js/templates/humanoids/thanatos-mage.js %}
    {% include rdd-js/templates/humanoids/traveler.js %}
    {% include rdd-js/templates/humanoids/villager.js %}
    {% include rdd-js/templates/humanoids/warrior.js %}
    {% include rdd-js/templates/humanoids/white-mage.js %}
    
    /*
     * Creature Templates
     */
    RDDJS.animals = {};

    {% include rdd-js/templates/animals/alligate.js %}
    {% include rdd-js/templates/animals/bane.js %}
    {% include rdd-js/templates/animals/bellow.js %}
    {% include rdd-js/templates/animals/boarn.js %}
    {% include rdd-js/templates/animals/cackler.js %}
    {% include rdd-js/templates/animals/camule.js %}
    {% include rdd-js/templates/animals/centibeast.js %}
    {% include rdd-js/templates/animals/chrasm.js %}
    {% include rdd-js/templates/animals/drakkule.js %}
    {% include rdd-js/templates/animals/felorn.js %}
    {% include rdd-js/templates/animals/flider.js %}
    {% include rdd-js/templates/animals/furlong.js %}
    {% include rdd-js/templates/animals/ghul.js %}
    {% include rdd-js/templates/animals/gleepzook.js %}
    {% include rdd-js/templates/animals/gong.js %}
    {% include rdd-js/templates/animals/grindling.js %}
    {% include rdd-js/templates/animals/grizzle.js %}
    {% include rdd-js/templates/animals/harpy.js %}
    {% include rdd-js/templates/animals/jabberwock.js %}
    {% include rdd-js/templates/animals/jackalid.js %}
    {% include rdd-js/templates/animals/killerbeast.js %}
    {% include rdd-js/templates/animals/laughing-reaver.js %}
    {% include rdd-js/templates/animals/lycan.js %}
    {% include rdd-js/templates/animals/necrat.js %}
    {% include rdd-js/templates/animals/necromorph.js %}
    {% include rdd-js/templates/animals/oracle-bird.js %}
    {% include rdd-js/templates/animals/panthler.js %}
    {% include rdd-js/templates/animals/razorfly.js %}

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
                characteristic = 'dream';
            }
            else if(value == 'mt') {
                characteristic = 'missile';
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
     * Generate a new character
     */
    RDDJS.prototype.generateScenario = function(settings = null) {
        return RDDJS.generator.plot.generate(settings);
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
{% include rdd-js/generator/plot.js %}