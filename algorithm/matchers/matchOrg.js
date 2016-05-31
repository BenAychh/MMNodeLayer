var calc = require('../calculators');

module.exports = function(memOneOrg, memTwoOrg) {
    if (calc.someMatch(memOneOrg, memTwoOrg) === true) {
        return 1;
    } else {
        return (0);
    }
};