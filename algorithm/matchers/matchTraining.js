var calc = require('../calculators');

module.exports = function(memOneTr, memTwoTr) {
    if (calc.someMatch(memOneTr, memTwoTr) === true) {
        return 1;
    } else {
        return (-1);
    }
};