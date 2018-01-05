/*
 * Generate a random integer between min and max.
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
 * Average two integers, round down.
 */
function average_round_down(int1, int2) {
    return Math.floor((int1 + int2) / 2);
}

/*
 * Average two integers, round up.
 */
function average_round_up(int1, int2) {
    return Math.ceil((int1 + int2) / 2);
}