(function() {
    
    var plot = function() {
    };

    plot.prototype = {
        /*
         *
         */
        generateRandomSettings: function() {
            var settings = {};

            settings['characteristic-points'] = RDDJS.utils.getRandomInt(160, 190);
            settings['skill-points'] = RDDJS.utils.getRandomInt(3000, 4000);
            settings['max-characteristic-points'] = 15;
            settings['max-skill'] = RDDJS.utils.getRandomInt(3, 5);

            return settings;
        },

        /*
         *
         */
        selectRandomTemplate: function() {
            var creatures = Object.keys(RDDJS.templates);
            var index = RDDJS.utils.getRandomInt(0, creatures.length-1);
            var creature = creatures[index];
            
            return creature;
        },

        /*
         *
         */
        generateRandomCharacter: function(settings = null) {
            if(!settings) {
                var settings = this.generateRandomSettings();
            }

            settings['template'] = this.selectRandomTemplate();
            RDDJS.prototype.setSettings(settings);

            return RDDJS.prototype.generateCharacter();
        },

        /*
         * Generate a simple plot for a Reve de Dragon's game.
         */
        generate: function(settings = null) {
            /*
             * The template for the plot
             */
            var plot = {
                'adventure-type' : this.selectRandomAdventureType(),
                'story' : '',
                'start' : '',
                'main-protagonists' : [],
                'humanoids' : [],
                'twists' : [],
                'genres' : '',
                'landscapes' : [],
                'weathers' : [],
                'creatures' : [],
                'additional-components' : [],
                'keywords' : []
            };

            /*
             * Randomly generate main protagonists
             */
            var max = RDDJS.utils.getRandomInt(1, 3);

            for(var i = 1; i <= max; i++) {
                var protagonist = this.generateRandomCharacter(settings);
                plot['main-protagonists'].push(protagonist);
                plot['keywords'].push(protagonist['build']);
            }
            
            /*
             * Randomly generate characters and creatures that the PC will
             * meet.
             */
            var max = RDDJS.utils.getRandomInt(1, 3);

            for(var i = 1; i <= max; i++) {
                var character = this.generateRandomCharacter(settings);
                character['alignment'] = (Math.random() <= 0.5) ? 'Ennemy' : 'Ally';
                character['build'] = RDDJS.utils.jsUcfirst(character['build']);
                plot['humanoids'].push(character);
                plot['keywords'].push(character['build']);
            }
            
            /*
             * Randomly generate a plot
             */
            max = plot['main-protagonists'].length;

            for(var i = 0; i < max; i++) {
                var protagonist = plot['main-protagonists'][i];

                plot['story'] += '<b><u>'+protagonist['name']+'</u></b> the <b>'+RDDJS.utils.jsUcfirst(protagonist['build'])+'</b>'

                if((max != 1) && (i == (max-2))) {
                    plot['story'] += ' and ';
                    continue;
                }

                if(i < max-2) {
                    plot['story'] += ', ';
                }
                else {
                    plot['story'] += ' ';
                }
            }

            if(max == 1) {
                plot['story'] += 'wants '
            }
            else {
                plot['story'] += 'want '
            }

            plot['story'] += '<b>'+this.selectRandomMotivation()+'</b>';
            plot['story'] += ', but he/she/they is/are having a hard time getting/doing it because '
            plot['story'] += '<b>'+this.selectRandomProblem()+'</b>';

            /*
             * Generate how the scenario starts
             */
            plot['start'] = this.selectRandomStart();

            /*
             * Generate twists
             */
            var max = RDDJS.utils.getRandomInt(2, 4);

            for(var i = 0; i <= max; i++) {
                var twist = this.selectRandomTwist();

                if(!plot['twists'].includes(twist)) {
                    plot['twists'].push(twist);
                }
            }

            /*
             * Generate genres
             */
            plot['genres'] = this.selectRandomGenres();

            /*
             * Generate the landscapes
             */
            var max = RDDJS.utils.getRandomInt(1, 4);

            for(var i = 1; i <= max; i++) {
                var landscape = this.selectRandomLandscape() + ' in ' + this.selectRandomSeason();

                if(!plot['landscapes'].includes(landscape)) {
                    plot['landscapes'].push(landscape);
                    plot['keywords'].push(landscape.split(' in '));
                }
            }

            /*
             * Generate the Weather / Environmental Challenges
             */
            for(var i = 1; i <= plot['landscapes'].length; i++) {
                var weather = this.selectRandomWeather();

                if(!plot['weathers'].includes(weather)) {
                    plot['weathers'].push(weather);
                    plot['keywords'].push(weather);
                }
            }


            /*
             * Generate the creature that the PCs will confront
             */
            var creatures = Object.keys(RDDJS.animals);

            var max = RDDJS.utils.getRandomInt(1, 4);

            for(var i = 1; i <= max; i++) {
                var j = RDDJS.utils.getRandomInt(0, creatures.length);
                var creature = creatures[j];
                
                if(!plot['creatures'].includes(creature)) {
                    plot['creatures'].push(creature);
                    plot['keywords'].push(creature);
                }
            }

            /*
             * Filters the keywords
             */
            plot['keywords'] = RDDJS.utils.shuffleArray(plot['keywords'].unique());

            $.each(plot['keywords'], function(index, value) {
                if(!value) {
                    plot['keywords'][index] = '';
                }
                else if(Array.isArray(value)) {
                    $.each(value, function(index2, keyword) {
                        plot['keywords'][index][index2] = keyword.toLowerCase().replace(' ', '-');
                    });
                }
                else {
                    plot['keywords'][index] = value.toLowerCase().replace(' ', '-');
                }
            });

            /*
             * There's a 10% chance that the scenario contains
             * an entity
             */
            if((Math.random() <= 0.1)) {
                var entities = Object.keys(RDDJS.entities);
                var index = RDDJS.utils.getRandomInt(0, entities.length-1);
                
                plot['additional-components'].push(['entity', entities[index]]);
            }

            /*
             * There's a 10% chance that the PCs could catch a disease
             */
            if((Math.random() <= 0.1)) {
                var index = RDDJS.utils.getRandomInt(0, RDDJS.diseases.length-1);
                
                plot['additional-components'].push(['disease', RDDJS.diseases[index]]);
            }

            return plot;
        },

        /*
         */
        selectRandomMotivation: function() {
            var motivations = [
                'to fulfill a prophecy',
                'to help everyone, all the time',
                'to reproduce with the fittest mate possible',
                'to repay debts as soon as possible so as to not owe a villain',
                'to protect another, vulnerable, character',
                'to find a meaningful place in the world',
                'only power and will do anything to achieve it',
                'something someone else has, and resents them for it',
                'to achieve perfection in a certain moral virtue',
                'to protect someone',
                'to live up to their family name, and bring credit to their family',
                'to spread joy and cheer',
                'to make scientific discoveries, even if they have no real practical purposes',
                'do evil because they love evil',
                'to find love, in any form',
                'to be remembered and will commit atrocities in order to achieve that',
                'money to pay for medical treatment',
                'to remain or become beautiful',
                'freedom from some sort of bondage',
                'to help someone because that person saved their life',
                'the person they love to be happy, even at the risk of their own happiness',
                'to find a lost or kidnapped loved one, whatever the cost',
                'a society destroyed and/or abandoned under the impression that it is beyond saving',
                'a particular form of wealth and will do anything to obtain it',
                'to accomplish a good goal, even if that means being evil, and loses sight of the goal over time',
                'to be human, or to regain their humanity',
                'what\'s worst for others',
                'the gods to pay for what they\'ve done',
                'to create a better world but will go to extreme lengths to achieve it',
                'someone to acknowledge them'
            ];

            var index = RDDJS.utils.getRandomInt(0, motivations.length-1);

            return motivations[index];
        },

        /*
         *
         */
        selectRandomProblem: function() {
            var problems = [
                'it is, or they are, lost in a maze',
                'they have been imprisoned in another dream',
                'astronomical alignment favors black magic',
                'eclipse or comet provokes outburst of superstitious fear',
                'a forgotten crime comes back to haunt them',
                'they are under a spell/curse',
                'invasion or occupation by foreigners',
                'they have been falsely accused of a capital crime',
                'a plague is spreading in the vicinity',
                'rebels are plotting to overthrow the government',
                'it\'s in a boiling lake that melts people',
                'a gang/terrorist organization wages war against a local city',
                'undead threaten cities across the nation',
                'mysteriously, the entire city has lost its inhabitants overnight',
                'anybody not born into a religion gets killed',
                'the object they need has gone missing'
            ];

            var index = RDDJS.utils.getRandomInt(0, problems.length-1);

            return problems[index];
        },

        /*
         *
         */
        selectRandomAdventureType: function() {
            var adventures = [
                'Escape/Survival',
                'Find Someone or Something',
                'Harm or Kill Someone',
                'Kidnap or Capture Someone',
                'Prevent Something',
                'Protect Someone or Something',
                'Reconnaissance/Surveillance',
                'Rescue Someone',
                'Solve a Mystery',
                'Steal (or Destroy) Something',
                'Transport Something or Someone',
                'Discovery',
                'Blackmail',
                'Breaking and Entering',
                'Manhunt',
                'Pandora\'s Box',
                'Exploration'
            ];

            var index = RDDJS.utils.getRandomInt(0, adventures.length-1);

            return adventures[index];
        },

        /*
         *
         */
        selectRandomTwist: function() {
            var twists = [
                'Allies traveling with characters leave suddenly',
                'A player character\'s major power/ability is weakening',
                'A player character\'s major power/ability is functioning unreliably',
                'The opposition has discovered one of the player character\'s weaknesses',
                'A player character or key ally has developed an addiction',
                'The adventure area or a key encounter area has a limited supply or air',
                'Unexpected Allies arrive to support the player characters or the opposition',
                'An important Ally is captured by the opposition',
                'A key ally has lost their memory',
                'A key person the characters must rely on has a bad reputation',
                'An important Ally is killed by the opposition',
                'Part of the adventuring area is flooded',
                'Local authorities arrive to arrest one of more of the player characters or one of their allies',
                'A large section of the encounter area begins to fall in',
                'Just as the adventure gets underway the characters witness a bad omen',
                'A player character or key ally is badly injured in an accident',
                'A player character is discovered to have a birthmark important to the goals of the adventure',
                'The adventure area is filled with bobby-traps',
                'While traveling to the adventure the player character\'s transportation fails at a very unfortunate location',
                'A player character is offered a significant bribe to give up the goal of the adventure',
                'A bridge, road or other transpiration resource has been destroyed',
                'The player characters have been specifically instructed not to hurt a key opposition member',
                'One of more of the player characters or an ally is captured by the opposition',
                'Player character items behave in an unreliable and unexpected way in parts of the encounter area',
                'The enemy has fled and player characters must give chase',
                'A useless item acquired in the adventure turns out to be very valuable',
                'The adventure begins with a comet shooting across the sky or other odd natural event',
                'A player character or an ally is controlled by the opposition',
                'A member of the opposition includes a corrupt official that will block the player characters at every turn',
                'A member of the opposition has abilities from one or more races, professions or animal sources',
                'A player character or ally is under a curse',
                'A series of dangerous tests must be completed to successfully end the adventure',
                'A player character or ally is trying to conceal a dark secret',
                'A large section of the encounter area is under artificial darkness',
                'Throughout the encounter area there are several deathtraps',
                'Locks encountered are exceptionally difficult to pick',
                'The main objective of the adventure must be achieved with diplomacy',
                'Honorable characters will be required to commit dishonorable acts to achieve success',
                'One of the encounters of the adventure is a diversion rather than a major event',
                'A key ally is actually a double agent',
                'The opposition has advance warning of the objectives and tactics of the player characters',
                'The opposition has an item that the player characters need to continue on in the adventure',
                'An enemy killed by the player characters has returned in a new body',
                'An enemy that is encountered has unexpectedly enhanced abilities or powers',
                'An important piece of equipment in the adventure does not work',
                'Key equipment for the adventure has been sabotaged',
                'An enemy thought to be evil is actually good',
                'Weather becomes a major obstacle during the adventure',
                'The treasure taken from the adventure turns out to be fake',
                'The area investigated is not the real goal of the adventure',
                'A trail or road followed is not the real trail to the adventure objective',
                'Player characters are called back to the starting point of the adventure for a new objective',
                'A Player character is falsely accused of being a member of the opposition',
                'A family member of a player character is killed by the opposition',
                'The encounter area has been set on fire by the opposition',
                'A member of the opposition that escaped has returned to encounter the player characters again',
                'A key Non-player character must follow a strict code of conduct',
                'Food or drink given to the player characters has been drugged by the opposition',
                'A key non-player character speaks a language that none of the characters understands',
                'A player character or ally has been framed for a crime that was committed by the opposition',
                'Friendly Allies know to the player characters are also working to complete the same adventure objective',
                'Achieving the goals of the adventure requires traveling a great distance',
                'A key adventure objective is guarded by an animal or special creature',
                'A valuable employee/servant leaves for a new employer',
                'The opposition has taken hostages and they are being held in the encounter area',
                'A player character\'s identity has been stolen by a member of the opposition',
                'Someone in the party is secretly a half-wolf'
            ];

            var index = RDDJS.utils.getRandomInt(0, twists.length-1);

            return twists[index];
        },

        /*
         *
         */
        selectRandomLandscape: function() {
            var landscapes = [
                'Desert', 
                'Plains', 
                'Taiga', 
                'Tundra', 
                'Wetland', 
                'Mountain', 
                'Mountain Range', 
                'Cliff', 
                'Coast', 
                'Littoral Zone', 
                'Glacier', 
                'Polar Regions', 
                'Shrubland', 
                'Forest', 
                'Rainforest', 
                'Woodland', 
                'Jungle', 
                'Moors',
                'Cave',
                'Underground City',
                'Forgotten City',
                'City',
                'Under the Sea',
                'Ocean',
                'Crystal Cave',
                'Island',
                'Volcano',
                'Castle'
            ];

            var index = RDDJS.utils.getRandomInt(0, landscapes.length-1);

            return landscapes[index];
        },

        /*
         *
         */
        selectRandomSeason: function() {
            var seasons = [
                'Winter',
                'Summer',
                'Spring',
                'Autumn'
            ];

            var index = RDDJS.utils.getRandomInt(0, seasons.length-1);

            return seasons[index];
        },

        /*
         *
         */
        selectRandomWeather: function() {
            var weathers = [
                'Rainy',
                'Stormy',
                'Sunny',
                'Cloudy',
                'Hot',
                'Cold',
                'Dry',
                'Wet',
                'Windy',
                'Hurricanes',
                'Typhoons',
                'Sandstorms',
                'Snowstorms',
                'Tornados',
                'Humid',
                'Foggy',
                'Snow',
                'Thundersnow',
                'Hail',
                'Sleet',
                'Drought',
                'Wildfire',
                'Blizzard',
                'Avalanche',
                'Mist'
            ];

            var index = RDDJS.utils.getRandomInt(0, weathers.length-1);

            return weathers[index];
        },

        /*
         *
         */
        selectRandomStart: function() {
            var starts = [
                'You start off dead. You have been resurrected by a Thanatos mage and now must do his/her bidding',
                'You start in a prison',
                'You are the personal guard of an NPC but he/she gets assassinated and you are framed for his/her murderr',
                'You are escorting a caravan',
                'You have been kidnapped',
                'You hear of a prophecy that involves you',
                'You start in a combat zone',
                'You start on a ship that is sinking',
                'You start in a refugee camp',
                'You start off by being sold as a gladiator',
                'You face off a natural disaster (e.g. flood, wildfire etc.)',
                'You start off in a cave. Ennemis enter every second-round to try and kill you',
                'You start off as ghosts',
                'You start off cursed',
                'You start off with a life-threatening disease',
                'You start off turned into a genie, imprisoned in a lamp and marooned in a remote uninhabited location',
                'You start off as a spy',
                'You witness the police killing an innocent person',
                'You wake up unable to recognise your surroundings or the people you are living with',
                'You start off disguised as something, and you can\'t remember what you were meant to do',
                'Many years ago, you were given an object by a family member. You find out that a Villain wants it badly too',
                'You are attacked by a counter-force from an unexpected source'
            ];

            var index = RDDJS.utils.getRandomInt(0, starts.length-1);

            return starts[index];
        },

        /*
         *
         */
        selectRandomGenres: function() {
            var genre = 'Fantasy'

            var genres = [
                'Horror',
                'Comedy',
                'Science Fiction',
                'Steampunk',
                'Western',
                'Contemporary',
                'Mythology',
                'Romance',
                'Historical Fiction',
                'Supernatural',
                'Heroic',
                'Post Apocalyptic',
                'Dystopian',
                'Gothic',
                'Prehistoric'
            ];

            var max = RDDJS.utils.getRandomInt(1, 3);

            for(var i = 2; i <= max; i++) {
                var index = RDDJS.utils.getRandomInt(0, genres.length-1);
                genre += ' / ' + genres[index];
                genres = RDDJS.utils.removeItemFromArray(genres, genres[index]);
            }

            return genre;
        }
    }

    $.extend(RDDJS.generator.plot, new plot());
    
}());