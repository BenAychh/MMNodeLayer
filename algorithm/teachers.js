'use strict'

let teacher1 = {
    email: "teacher1@teach.com",
    isTeacher: true,
    active: true,
    training: [1],
    trainingWgt: 1,
    locTypes: [1, 2, 3],
    locTypesWgt: 1,
    orgTypes: [5, 7],
    orgTypesWgt: 50,
    sizes: [1, 2, 3],
    sizesWgt: 1,
    cals: [1],
    calsWgt: 1,
    states: [5, 6, 38, 43, 47],
    statesWgt: 50,
    traits: [3, 8, 9, 10, 11, 13, 18],
    traitsWgt: 100,
    ageRanges: [2, 3],
    ageRangesWgt: 1,
    matchSuggestions: []
}

let teacher2 = {
    email: "teacher2@teach.com",
    isTeacher: true,
    active: true,
    training: [2],
    trainingWgt: 1,
    locTypes: [1, 2],
    locTypesWgt: 1,
    orgTypes: [1, 6],
    orgTypesWgt: 1,
    sizes: [3, 4],
    sizesWgt: 1,
    cals: [2],
    calsWgt: 50,
    states: [6, 12],
    statesWgt: 1,
    traits: [2, 7, 8, 9, 10, 12, 17],
    traitsWgt: 50,
    ageRanges: [2, 3],
    ageRangesWgt: 10,
    matchSuggestions: []
}

let teacher3 = {
    email: "teacher3@teach.com",
    isTeacher: true,
    active: true,
    training: [3],
    trainingWgt: 1,
    locTypes: [5],
    locTypesWgt: 50,
    orgTypes: [7],
    orgTypesWgt: 100,
    sizes: [1],
    sizesWgt: 100,
    cals: [1],
    calsWgt: 1,
    states: [49],
    statesWgt: 1,
    traits: [3, 8, 9, 10, 11, 13, 18],
    traitsWgt: 1,
    ageRanges: [2, 3],
    ageRangesWgt: 1,
    matchSuggestions: []
}

let teacher4 = {
    email: "teacher4@teach.com",
    isTeacher: true,
    active: true,
    training: [4],
    trainingWgt: 1,
    locTypes: [1, 2, 3, 4],
    locTypesWgt: 1,
    orgTypes: [1, 2, 3, 4, 5, 7],
    orgTypesWgt: 1,
    sizes: [1, 2, 3],
    sizesWgt: 1,
    cals: [1],
    calsWgt: 1,
    states: [5, 6, 38, 43, 47],
    statesWgt: 1,
    traits: [2, 7, 8, 9, 11, 13, 18],
    traitsWgt: 50,
    ageRanges: [2, 3],
    ageRangesWgt: 1,
    matchSuggestions: []
}

let teacher5 = {
    email: "teacher5@teach.com",
    isTeacher: true,
    active: true,
    training: [5],
    trainingWgt: 1,
    locTypes: [4],
    locTypesWgt: 50,
    orgTypes: [3, 4, 5],
    orgTypesWgt: 50,
    sizes: [3],
    sizesWgt: 1,
    cals: [1],
    calsWgt: 100,
    states: [10, 21, 18, 19],
    statesWgt: 1,
    traits: [4, 5, 6, 20, 19, 16, 13],
    traitsWgt: 1,
    ageRanges: [1, 2, 3],
    ageRangesWgt: 20,
    matchSuggestions: []
}

module.exports = [teacher1, teacher2, teacher3, teacher4, teacher5];