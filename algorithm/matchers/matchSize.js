var calc = require('../calculators');

module.exports = function(memOneSize, memTwoSize) {
    if (calc.someMatch(memOneSize, memTwoSize) === true) {
        return 1;
    } else {
        return (0);
    }
};