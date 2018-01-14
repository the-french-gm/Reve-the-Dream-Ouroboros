RDDJS.templates["giant"] = {
    "settings" : {
        "high-dreamer" : false,
        "max-characteristic-points" : 19,
        "max-size" : 31,
        "size" : getRandomInt(23, 31),
        "dream" : 0,
        "climbing" : +5,
        "jumping" : +5,
        "vigilance" : +5,
        "mountain-survival" : +5
    },

    "characteristics" : [
        "size",
        "constitution",
        "strength",
        "agility"
    ],

    "primary-skills" : [
        "lance",
        "shield",
        "dodging",
        "vigilance",
        "forest-survival"
    ],

    "exclude" : [
        "oneiros",
        "thanatos",
        "hypnos",
        "narcos",
        "masonry",
        "riding",
        "city-survival",
        "naviguation",
        "jewelrysmithing",
        "locksmithing",
        "alchemy"
    ]
}