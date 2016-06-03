var calc = require('../calculators');

module.exports = function(memOneTraits, memTwoTraits) {
    if (calc.someMatch(memOneTraits, memTwoTraits) === true) {
        var count = calc.countNumOfMatches(memOneTraits, memTwoTraits);
        return calc.findDecimal(count, memOneTraits.length);
    } else {
        return (0);
    }
};