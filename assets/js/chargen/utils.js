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

/*
 * Remove an item from an array.
 */
function removeItemFromArray(array, element) {
    return array.filter(e => e !== element);
}

/*
 * Search element by exact match.
 * 
 * $('p:textEquals("Hello World")');
 */
$.expr[':'].textEquals = function(el, i, m) {
    var searchText = m[3];
    var match = $(el).text().trim().match("^" + searchText + "$")
    return match && match.length > 0;
}

/*
 *
 */
function shuffleArray(o) {
	var o = o.slice();
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

/*
 *
 */
function generateContemporaryName(gender) {
	var female = Math.random() >= 0.5;
	gender = gender.toLowerCase();

	if((gender == "female") || female) {
		return chance.name({ gender: "female" });
	}

	return chance.name({ gender: "male" });
}

/*
 *
 */
Array.prototype.unique = function() {
	return this.filter(function (value, index, self) { 
	  return self.indexOf(value) === index;
	});
  }