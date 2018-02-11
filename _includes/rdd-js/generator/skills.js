(function() {

    var skills = function() {
    };

    
    skills.skill_points;
    skills.spell_points;
    skills.character_skills = 0;
    skills.remaining_points;

    /*
     *
     */
    skills.prototype = {
        getRemainingPoints: function() {
            return this.remaining_points;
        },

        /*
         *
         */
        generateSpells: function() {
            var draconics = {};
            var acquired_spells = [];

            /*
            * We only buy spells from Ways that the character
            * is versed into.
            */
            $.each(this.character_skills, function(index, value) {
                if(['oneiros', 'narcos', 'hypnos', 'thanatos'].indexOf(index) > -1) {
                    draconics[index] = value;
                }
            });
            
            /*
            * We now assign spells randomly to the character.
            */
            var length;
            while((length = Object.keys(draconics).length) > 0) {
                var index = RDDJS.utils.getRandomInt(0, length - 1);
                var draconic = Object.keys(draconics)[index];
                var level = draconics[draconic];
                var d_spells = RDDJS.utils.shuffleArray(RDDJS.spells[draconic]);
                
                var spell;

                while(d_spells.length > 0) {
                    spell = d_spells.pop();

                    var difficulty = parseInt(spell[2].replace('D', ''));
                    var cost = Math.abs(difficulty * 10);

                    if(!cost) {
                        spell = null;
                        //todo: hunt for problematic spells
                        continue;
                    }

                    /*
                    * The character does not learn the same spell twice.
                    */
                    if(acquired_spells.indexOf(spell[0]) > -1) {
                        spell = null;
                        continue;
                    }
                    
                    /*
                    * A character that has -X in Oneiros cannot, initially,
                    * learn spells below -5.
                    */
                    if((level < 0) && (difficulty < -5)) {
                        spell = null;
                        continue;
                    }

                    /*
                    * A character with +2 in Hypnos cannot, initially,
                    * learn spells below -7.
                    */
                    if((level > 0) && (difficulty < (-5 - level))) {
                        spell = null;
                        continue;
                    }

                    /*
                    * A character with +3 in Hypnos, who wants to buy
                    * a spell at -8, would need to pay (8x10) + (3x20)
                    * in additional cost.
                    */
                    if(difficulty < -5) {
                        var additional_cost = Math.abs(difficulty + 5);
                        cost += additional_cost;
                    }

                    /*
                    * Thanatos spells cost double.
                    */
                    if(draconic == 'thanatos') {
                        cost = cost * 2;
                    }

                    if((this.spell_points-cost) > 0) {
                        spell = [draconic].concat(spell.concat(cost));
                        this.spell_points -= cost;
                        acquired_spells.push(spell);
                        break;
                    }
                }

                if(d_spells.length == 0) {
                    delete draconics[draconic];
                }
            }

            this.remaining_points += this.spell_points;
            
            return acquired_spells;
        },
                
        /*
         * Searches the list of skills for the one the
         * algorithm is looking for. That's because
         * skills are stored in a large array.
         */
        getSkill: function(skills, skill) {
            var ret = null;

            $.each(skills, function(index, value) {
                var arr = skills[index];
                if(arr[0] == skill) {
                    ret = arr;
                    return false;
                }
            });

            return ret;
        },

        /*
         *
         */
        assignSkillPointsAndXP: function assignSkillPointsAndXP(settings, points, skills, is_dreamer) {
            var acquired_skills = {};
            var max_skill = parseInt(settings['max-skill']);
            var draconics = ['thanatos', 'oneiros', 'hypnos', 'narcos'];
            
            /*
             * We assign the points are per the template
             */
            if(settings['template']) {
                
                // We shuffle the arrays to add more randomness
                settings['template']['primary-skills'] = RDDJS.utils.shuffleArray(settings['template']['primary-skills']);
                
                if(settings['template']['secondary-skills']) {
                    settings['template']['secondary-skills'] = RDDJS.utils.shuffleArray(settings['template']['secondary-skills']);
                }
                
                /*
                 * Primary and secondary skills assignment.
                 */
                var important_skills = [
                    settings['template']['primary-skills'],
                    settings['template']['secondary-skills']
                ]
                var base = this;
                $.each(important_skills, function(index, value) {
                    $.each(value, function(index, skill) {
                        var skill = base.getSkill(skills, skill);
                        
                        if(!skill) {
                            return;
                        }
        
                        var difficulty = skill[1];
                        var cost;

                        if(settings[skill[0]]) {
                            level = settings[skill[0]];
                            cost = RDDJS.calculator.calculateBaseCost(difficulty, level);
                            
                            if((points-cost) > 0) {
                                points -= cost;
                                acquired_skills[skill[0]] = level;
                                skills = RDDJS.utils.removeItemFromArray(skills, skill);
                                return;
                            }
                        }

                        for(level = max_skill; level > -1; level--) {
                            cost = RDDJS.calculator.calculateBaseCost(difficulty, level);
                            
                            if((points-cost) > 0) {
                                points -= cost;
                                acquired_skills[skill[0]] = level;
                                skills = RDDJS.utils.removeItemFromArray(skills, skill);
                                break;
                            }
                        }
                    });
                });
            }
            
            /*
             * If the character is a dreamer, she must at least have one
             * draconic way.
             */
            if(is_dreamer) {
                var index = RDDJS.utils.getRandomInt(0, draconics.length-1);
                var draconic_way = draconics[index];
                var cost = RDDJS.calculator.calculateBaseCost(-11, max_skill);

                if((!acquired_skills[draconic_way]) && ((points-cost) > 0)) {
                    acquired_skills[draconic_way] = 3;
                }
            }
            
            /*
             * We assign all remaining points randomly.
             */
            var xx = 0;
            while(((points / 10) >= 1) && (skills.length > 0) && (xx < 300)) {
                xx++; // there's a infinite loop condition here that I haven't found any other way to get rid of.
                var index = RDDJS.utils.getRandomInt(0, skills.length-1);
                var skill = skills[index];
                
                var difficulty = skill[1];

                /*
                * We ignore skills that have already been prepopulated by templates
                */
                if(acquired_skills[skill[0]]) {
                    continue;
                }

                /*
                * We ignore skills that are excluded by templates
                */
                if(settings['template'] && settings['template']['exclude'] && settings['template']['exclude'].indexOf(skill[0]) > -1) {
                    continue;
                }

                /*
                * Random skill generation
                */
                var index = []
                
                for(i = -10; i < (max_skill+1); i++) {
                    index.push(i);
                }

                if(is_dreamer && draconics.includes(skill[0])) {
                    var level = RDDJS.utils.getRandomInt(index.length-2, index.length);
                }
                else if(!is_dreamer && draconics.includes(skill[0])) {
                    continue;
                }
                else {
                    var level = RDDJS.utils.getRandomInt(6, index.length);
                }

                level = index[level];

                /*
                * We skip acquiring purchasing advanced skills if the
                * proposed level is too low.
                */
                if((difficulty == -4) && (level < -1)) {
                    continue;
                }
                
                if((difficulty == -6) && (level < 0)) {
                    continue;
                }

                if(((difficulty == -11) || (difficulty == -8)) && (level < 2)) {
                    continue;
                }

                /*
                * We calculate the cost of acquiring the skill
                */
                var i;
                var cost;

                for(i = level; i >= -10; i--) {
                    cost = RDDJS.calculator.calculateBaseCost(difficulty, i);
                    
                    if((points-cost) > 0) {
                        points -= cost;
                        acquired_skills[skill[0]] = level;
                        break;
                    }
                }
            }

            /*
            * We assign the remaining points to the experience section
            * of a random skill.
            */
            if(points != 0) {
                this.remaining_points = points;
            }
            
            return acquired_skills;
        },

        /*
         * Splits the skill points between skills to be acquired, and spells
         * to be acquired.
         */
        distributeSkillPoints: function(settings) {
            this.skill_points = settings['skill-points'];
            this.spell_points = 0;

            if(settings['high-dreamer'] && (this.skill_points > 100)) {
                this.spell_points = RDDJS.utils.getRandomInt(100, (this.skill_points / 4));
                this.skill_points -= this.spell_points;
            }
        },

        /*
         *
         */
        generateSkills: function(settings) {
            if(!this.skill_points) {
                this.distributeSkillPoints(settings);
            }
            
            /*
             * Create a global skills list to make it easier
             * for the generator to find and select skills.
             * 
             * In the same code, we empty all the skill values
             * from the UI.
             */
            var skills_list = [];

            $.each(RDDJS.skills, function(key, value) {
                difficulty = value[0];
                $.each(value[1], function(index, skill) {
                    skills_list.push([skill, difficulty]);
                });
            });
            
            this.character_skills = this.assignSkillPointsAndXP(
                settings,
                this.skill_points,
                skills_list,
                settings['high-dreamer']
            );

            return this.character_skills;
        }
    }

    $.extend(RDDJS.generator.skills, new skills());

}());