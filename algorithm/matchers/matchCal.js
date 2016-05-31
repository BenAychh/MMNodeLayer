var calc = require('../calculators');

module.exports = function(memOneCal, memTwoCal) {
    if (calc.someMatch(memOneCal, memTwoCal) === true) {
        return 1;
    } else {
        return (0);
    }
};