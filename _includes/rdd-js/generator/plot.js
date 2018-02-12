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
        generateRandomCharacter: function() {
            var settings = this.generateRandomSettings();
            settings['template'] = this.selectRandomTemplate();
            RDDJS.prototype.setSettings(settings);

            return RDDJS.prototype.generateCharacter();
        },

        /*
         * Generate a simple plot for a Reve de Dragon's game.
         */
        generate: function() {
            /*
             * The template for the plot
             */
            var plot = {
                'adventure-type' : '<b>'+this.generateAdventureType()+'</b>',
                'story' : '',
                'main-protagonists' : [],
                'supporting-characters' : [],
                'twists' : []
            };

            /*
             * Randomly generate main protagonists
             */
            var max = RDDJS.utils.getRandomInt(1, 3);

            for(var i = 1; i <= max; i++) {
                plot['main-protagonists'].push(this.generateRandomCharacter());
            }
            
            /*
             * Randomly generate characters and creatures that the PC will
             * meet.
             */
            var max = RDDJS.utils.getRandomInt(2, 6);

            for(var i = 0; i <= max; i++) {
                plot['supporting-characters'].push(this.generateRandomCharacter());
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

            plot['story'] += '<b>'+this.generateMotivation()+'</b>';
            plot['story'] += ' badly, but is having a hard time getting it because '
            plot['story'] += '<b>'+this.generateProblem()+'</b>';

            /*
             * Generate twists
             */
            var max = RDDJS.utils.getRandomInt(2, 6);

            for(var i = 0; i <= max; i++) {
                var twist = this.generateTwist();

                if(!plot['twists'].includes(twist)) {
                    plot['twists'].push(twist);
                }
            }

            return plot;
        },

        /*
         */
        generateMotivation: function() {
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
                'the gods to pay for what they\'ve done'
            ];

            var index = RDDJS.utils.getRandomInt(0, motivations.length-1);

            return motivations[index];
        },

        /*
         *
         */
        generateProblem: function() {
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
                'rebels are plotting to overthrow the government'
            ];

            var index = RDDJS.utils.getRandomInt(0, problems.length-1);

            return problems[index];
        },

        /*
         *
         */
        generateAdventureType: function() {
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
                'Discovery'
            ];

            var index = RDDJS.utils.getRandomInt(0, adventures.length-1);

            return adventures[index];
        },

        /*
         *
         */
        generateTwist: function() {
            var twists = [
                'Allies traveling with characters leave suddenly',
                'A player character\'s major power/ability is weakening',
                'A player character\'s major power/ability is functioning unreliably',
                'The opposition has discovered one of the player character\'s weaknesses',
                'A player character or key ally has developed an addiction',
                'The adventure area or a key encounter area has a limited supply or air'
            ];

            var index = RDDJS.utils.getRandomInt(0, twists.length-1);

            return twists[index];
        }
    }

    $.extend(RDDJS.generator.plot, new plot());
    
}());