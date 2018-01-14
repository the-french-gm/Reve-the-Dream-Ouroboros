RDDJS.templates["faun"] = {
    "settings" : {
        "high-dreamer" : false,
        "max-characteristic-points" : 17,
        "max-size" : 19,
        "size" : getRandomInt(17, 19),
        "dream" : 0,
        "lance" : +5,
        "dodging" : +5,
        "vigilance" : +5,
        "forest-survival" : +5
    },

    "characteristics" : [
        "size",
        "constitution",
        "strength"
    ],

    "primary-skills" : [
        "lance",
        "shield",
        "dodging",
        "vigilance",
        "forest-survival"
    ],

    "excluded" : [
        "oneiros",
        "thanatos",
        "hypnos",
        "narcos",
        "masonry",
        "city-survival",
        "naviguation",
        "locksmithing",
        "jewelrysmithing"
    ]
}