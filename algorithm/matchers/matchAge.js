var calc = require('../calculators');

module.exports = function(memOneAge, memTwoAge) {
    if (calc.someMatch(memOneAge, memTwoAge) === true) {
        var count = calc.countNumOfMatches(memOneAge, memTwoAge);
        return calc.findDecimal(count, memOneAge.length);
    } else {
        return (-1);
    }
};