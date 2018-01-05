// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//
function average_round_down(int1, int2){
    return Math.floor((int1 + int2) / 2);
}