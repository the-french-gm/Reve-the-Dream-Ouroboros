/*
 *
 */
function generateCharacter() {
    characteristics = generateCharacteristics();
    
    if(characteristics['high-dreamer'] == 'Yes') {
        is_dreamer = true;
    } else {
        is_dreamer = false;
    }

    archetype = generateArchetype(is_dreamer, skills);
    
    /*
     * We adapt the data based on the genre of the game
     */
    if(settings['genre'] == 'contemporary') {
        characteristics['name'] = chance.name({ gender: "male" });
    }

    if(settings['genre'] == 'fantasy') {
        characteristics['name'] = generateFantasyName();
    }

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