var calc = require('../calculators');

module.exports = function(memOneLoc, memTwoLoc) {
    if (calc.someMatch(memOneLoc, memTwoLoc) === true) {
        return 1;
    } else {
        return (0);
    }
};