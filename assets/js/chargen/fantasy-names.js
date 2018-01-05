// https://github.com/felladrin/fantasy-name-generator/blob/gh-pages/generator.js
function generateFantasyName()
{
    var letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    var consonant = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];

    var vowel = ['a', 'e', 'i', 'o', 'u'];

    var name = [];

    // Number of letters of the name to be generated.
    var numLetters = getRandomInt(4, 8);
    
    var selected;

    for (var i = 0; i < numLetters; i++)
    {
        selected = Math.floor(Math.random() * 26);

        if (name.length > 2)
        {
            var lastLetter = name.length - 1;
            var penultLetter = name.length - 2;

            // If the last two letters are equal, the next one should be different.
            while (name[lastLetter] == selected && name[penultLetter] == selected)
                selected = Math.floor(Math.random() * 26);

            // If the last two letters are consonants, the next one must be a vowel.
            if (consonant.indexOf(name[lastLetter]) != -1 && consonant.indexOf(name[penultLetter]) != -1)
            {
                selected = Math.floor(Math.random() * 5);
                name[i] = vowel[selected];
                continue;
            }
        }
        else
        {
            // If the first letter is a vowel, the second must be a consonant, and vice versa.
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

    // Name must not finish with two consonants.
    if (consonant.indexOf(name[name.length - 1]) != -1 && consonant.indexOf(name[name.length - 2]) != -1)
    {
        selected = Math.floor(Math.random() * 5);
        name[name.length - 1] = vowel[selected];
    }

    // Converts the array into a string.
    name = name.join('');

    // Capitalizes the first letter .
    name = name.substr(0, 1).toUpperCase() + name.substr(1);

    return name;
}