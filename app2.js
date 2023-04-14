import { DecisionTree } from "./libraries/decisiontree.js"

function loadSavedModel() {
    fetch("./model.json")
        .then((response) => response.json())
        .then((model) => modelLoaded(model))
}


function modelLoaded(model) {
    let decisionTree = new DecisionTree(model)
    let gameDuraton = document.getElementById('gameDuraton')
    let blueFirstTower = document.getElementById('blueFirstTower')
    let blueFirstBaron = document.getElementById('blueFirstBaron')
    let blueFirstInhibitor = document.getElementById('blueFirstInhibitor')
    let blueDragonKills = document.getElementById('blueDragonKills')
    let blueBaronKills = document.getElementById('blueBaronKills')
    let blueTowerKills = document.getElementById('blueTowerKills')
    let blueInhibitorKills = document.getElementById('blueInhibitorKills')
    
    let game = { gameDuraton: gameDuraton, blueFirstTower: blueFirstTower, blueFirstBaron: blueFirstBaron, blueFirstInhibitor: blueFirstInhibitor, blueDragonKills: blueDragonKills, blueBaronKills: blueBaronKills, blueTowerKills: blueTowerKills, blueInhibitorKills: blueInhibitorKills}
    let prediction = decisionTree.predict(game)
    if (prediction == "0") {
    document.getElementById("prediction").innerHTML = "Blue lost this game."
    } else if (prediction == "1") {
    document.getElementById("prediction").innerHTML = "Blue won this game"
    }
}

loadSavedModel();