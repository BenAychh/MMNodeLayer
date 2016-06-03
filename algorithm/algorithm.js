'use strict'

const matchState = require('./matchers/matchState');
const matchAge = require('./matchers/matchAge');
const matchTraining = require('./matchers/matchTraining');
const matchCal = require('./matchers/matchCal');
const matchLoc = require('./matchers/matchLoc');
const matchOrg = require('./matchers/matchOrg');
const matchSize = require('./matchers/matchSize');
const matchTraits = require('./matchers/matchTraits');
const calc = require('./calculators');

function match(memberOne, memberTwo) {

    let memOne;
    let memTwo;
    if (memberOne.isTeacher === true) {
        memOne = memberOne;
        memTwo = memberTwo;
    } else if (memberOne.isTeacher === false) {
        memOne = memberTwo;
        memTwo = memberOne;
    }

    // establish all match percentages for individual elements
    // if a non-negotiable element is -1, stop the loop and return a non-match
    let ageMatch = matchAge(memTwo.ageRanges, memOne.ageRanges);
    if (ageMatch === (-1)) {
        return 0;
    }

    let stateMatch = matchState(memTwo.states, memOne.states);
    if (stateMatch === (-1)) {
        return 0;
    }

    let trainingMatch = matchTraining(memOne.training, memTwo.training);
    if (trainingMatch === (-1)) {
        return 0;
    }

    let traitMatch = matchTraits(memOne.traits, memTwo.traits);
    let calMatch = matchCal(memTwo.cals, memOne.cals);
    let locMatch = matchLoc(memTwo.locTypes, memOne.locTypes);
    let orgMatch = matchOrg(memTwo.orgTypes, memOne.orgTypes);
    let sizeMatch = matchSize(memTwo.sizes, memOne.sizes);

    let matchPercentMemOne = calc.matchPercentOneWay(ageMatch, memOne.ageRangesWgt, calMatch, memOne.calsWgt, locMatch, memOne.locTypesWgt, orgMatch, memOne.orgTypesWgt, sizeMatch, memOne.sizesWgt, stateMatch, memOne.statesWgt, trainingMatch, memOne.trainingWgt, traitMatch, memOne.traitsWgt);

    let matchPercentMemTwo = calc.matchPercentOneWay(ageMatch, memTwo.ageRangesWgt, calMatch, memTwo.calsWgt, locMatch, memTwo.locTypesWgt, orgMatch, memTwo.orgTypesWgt, sizeMatch, memTwo.sizesWgt, stateMatch, memTwo.statesWgt, trainingMatch, memTwo.trainingWgt, traitMatch, memTwo.traitsWgt);

    let matchPercent = calc.matchPercentMutual(matchPercentMemOne, matchPercentMemTwo).toFixed(2);

    return matchPercent;
}

module.exports = match;