var calc = require('../calculators');

module.exports = function(memOneState, memTwoState) {
    if (calc.someMatch(memOneState, memTwoState) === true) {
        return 1;
    } else {
        return (-1);
    }
};