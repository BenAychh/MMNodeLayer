'use strict'

let school1 = {
    email: "school1@teach.com",
    active: true,
    isTeacher: false,
    training: [1, 2],
    trainingWgt: 50,
    locTypes: [3],
    locTypesWgt: 1,
    orgTypes: [5],
    orgTypesWgt: 1,
    sizes: [2],
    sizesWgt: 1,
    cals: [1],
    calsWgt: 1,
    states: [6],
    statesWgt: 1,
    traits: [3, 8, 9, 10, 11, 13, 18],
    traitsWgt: 100,
    ageRanges: [2, 3, 4],
    ageRangesWgt: 1,
    matchSuggestions: []
}

let school2 = {
    email: "school2@teach.com",
    isTeacher: false,
    active: true,
    training: [2, 3, 4],
    trainingWgt: 50,
    locTypes: [1],
    locTypesWgt: 1,
    orgTypes: [6],
    orgTypesWgt: 1,
    sizes: [4],
    sizesWgt: 1,
    cals: [2],
    calsWgt: 1,
    states: [12],
    statesWgt: 1,
    traits: [2, 7, 8, 9, 10, 12, 17],
    traitsWgt: 50,
    ageRanges: [3, 4, 5],
    ageRangesWgt: 1,
    matchSuggestions: []
}

let school3 = {
    email: "school3@teach.com",
    isTeacher: false,
    active: true,
    training: [1, 5],
    trainingWgt: 10,
    locTypes: [4],
    locTypesWgt: 1,
    orgTypes: [4],
    orgTypesWgt: 1,
    sizes: [3],
    sizesWgt: 1,
    cals: [1],
    calsWgt: 1,
    states: [21],
    statesWgt: 1,
    traits: [4, 5, 6, 20, 19, 16, 13],
    traitsWgt: 100,
    ageRanges: [1, 2, 3],
    ageRangesWgt: 100,
    matchSuggestions: []
}

module.exports = [school1, school2, school3];