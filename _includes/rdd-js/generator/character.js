(function() {

    var character = function() {
    };

    /*
     *
     */
    character.prototype = {
        /*
         *
         */
        generateHandedness: function() {
            if(Math.random() >= 0.25) {
                return 'Right Handed';
            } else {
                return 'Left Handed';
            }
        },

        /*
         *
         */
        generateBirthHour: function() {
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

            return birth_hours[RDDJS.utils.getRandomInt(0, birth_hours.length - 1)]
        },

        /*
         * Generates a random gender for the character
         */
        randomGender: function() {
            var chance = RDDJS.utils.getRandomInt(1, 100);

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

            if(chance <= 56) {
                return 'female';
            }

            if(chance <= 100) {
                return 'male';
            }
        },

        /*
         * Generate a random fantasy name for the character
         * https://github.com/felladrin/fantasy-name-generator/blob/gh-pages/generator.js
         */
        generateFantasyName: function()
        {
            var letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
            var consonant = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
            var vowel = ['a', 'e', 'i', 'o', 'u'];
            var name = [];
            var numLetters = RDDJS.utils.getRandomInt(4, 8);
            var selected;

            for (var i = 0; i < numLetters; i++)
            {
                selected = Math.floor(Math.random() * 26);

                if (name.length > 2)
                {
                    var lastLetter = name.length - 1;
                    var penultLetter = name.length - 2;

                    while (name[lastLetter] == selected && name[penultLetter] == selected)
                        selected = Math.floor(Math.random() * 26);

                    if (consonant.indexOf(name[lastLetter]) != -1 && consonant.indexOf(name[penultLetter]) != -1)
                    {
                        selected = Math.floor(Math.random() * 5);
                        name[i] = vowel[selected];
                        continue;
                    }
                }
                else
                {
                    if (vowel.indexOf(name[0]) != -1)
                    {
                        selected = Math.floor(Math.random() * 21);
                        name[i] = consonant[selected];
                        continue;
                    }
                    else if (consonant.indexOf(name[0]) != -1)
                    {
                        selected = Math.floor(Math.random() * 5);
                        name[i] = vowel[selected];
                        continue;
                    }
                }

                name[i] = letter[selected];
            }

            if (consonant.indexOf(name[name.length - 1]) != -1 && consonant.indexOf(name[name.length - 2]) != -1)
            {
                selected = Math.floor(Math.random() * 5);
                name[name.length - 1] = vowel[selected];
            }

            name = name.join('');
            name = name.substr(0, 1).toUpperCase() + name.substr(1);

            return name;
        },

        /*
         * Generate a random contemporary name for the character
         * using chancejs.
         */
        generateContemporaryName: function(gender) {
            var female = Math.random() >= 0.5;
            gender = gender.toLowerCase();

            if((gender == "female") || female) {
                return chance.name({ gender: "female" });
            }

            return chance.name({ gender: "male" });
        },

        /*
         * Generate a name for the character based on the
         * genre of selected.
         */
        generateName: function(settings, gender) {
            if(!settings['genre']) {
                settings['genre'] = 'fantasy';
            }

            if(settings['genre'] == 'contemporary') {
                return this.generateContemporaryName(gender);
            }

            if(settings['genre'] == 'fantasy') {
                return this.generateFantasyName();
            }
        },

        /*
         * Generates a new character
         */
        generate: function(settings) {
            var character = {};

            character["gender"] = this.randomGender();
            character["name"] = this.generateName(settings, character["gender"]);
            character["age"] = RDDJS.utils.getRandomInt(18, 60);
            character["birth-hour"] = this.generateBirthHour();
            character["handedness"] = this.generateHandedness();
            character["high-dreamer"] = settings["high-dreamer"];
            
            return character;
        }
    }

    $.extend(RDDJS.generator.character, new character());

}());