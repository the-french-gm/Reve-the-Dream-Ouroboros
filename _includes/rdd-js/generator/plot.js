(function() {
    
    var plot = function() {
    };

    plot.prototype = {

        /*
        */
        randomlySelectCreature: function() {
            var creatures = Object.keys(RDDJS.templates);
            var index = RDDJS.utils.getRandomInt(0, creatures.length-1);
            var creature = creatures[index].charAt(0).toUpperCase() + creatures[index].slice(1);

            return creature;
        },

        /*
         * Generate a simple plot for a Reve de Dragon's game.
         */
        generate: function() {
            var plot = {
                'story' : '',
                'protagonist-name' : '',
                'protagonist-type' : ''
            };

            /*
             * Randomly generate a protagonist
             */
            plot['protagonist-type'] = this.randomlySelectCreature();
            plot['protagonist-name'] = RDDJS.generator.character.generateName();

            plot['story'] += 'A <b>'+plot['protagonist-type']+'</b> called <b>'+plot['protagonist-name']+'</b> '
            plot['story'] += this.generateMotivation();
            
            return plot;
        },

        /*
         */
        generateMotivation: function() {
            var motivations = [
                'wants to fulfill a prophecy',
                'is compelled to help everyone, all the time',
                'wants to reproduce with the fittest mate possible',
                'wants to repay debts as soon as possible so as to not owe a villain',
                'wants to protect another, vulnerable, character (often a girl)',
                'wants to find a meaningful place in the world',
                'want only power and will do anything to achieve it',
                'wants something someone else has, and resents them for it',
                'is driven by the desire to achieve perfection in a certain moral virtue',
                'failed to protect someone once, and is determined not to fail again',
                'wants to live up to their family name, and bring credit to their family',
                'wants to spread joy and cheer',
                'wants to make scientific discoveries, even if they have no real practical purposes',
                'wants do evil because they love evil',
                'searches for love, in any form',
                'wants to be remembered and will commit atrocities in order to achieve that',
                'needs money to pay for medical treatment',
                'wants to remain or become beautiful',
                'wants freedom from some sort of bondage',
                'feels indebted to someone who saved their life',
                'wants the person they love to be happy, even at the risk of their own happiness',
                'wants to find a lost or kidnapped loved one, whatever the cost',
                'wants a society destroyed and/or abandoned under the impression that it is beyond saving',
                'is obsessed with a particular form of wealth and will do anything to obtain it',
                'uses evil means to accomplish a good goal and loses sight of the goal over time',
                'wants to be human, or to regain their humanity',
                'desires what\'s worst for others',
                'wants the gods to pay for what they\'ve done'
            ]

            var index = RDDJS.utils.getRandomInt(0, motivations.length-1);

            return motivations[index];
        }
    }

    $.extend(RDDJS.generator.plot, new plot());
    
}());