import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

let ignoredColumns = ['gameId', 'blueFirstBlood', 'blueFirstDragon', 'blueWardPlaced', 'blueWardkills', 'blueKills', 'blueDeath', 'blueAssist','blueChampionDamageDealt','blueTotalGold','blueTotalMinionKills','blueTotalLevel','blueAvgLevel','blueJungleMinionKills', 'blueKillingSpree','blueTotalHeal','blueObjectDamageDealt', 'redWins','redFirstBlood','redFirstTower','redFirstBaron','redFirstDragon','redFirstInhibitor','redDragonKills','redBaronKills','redTowerKills','redInhibitorKills','redWardPlaced','redWardkills', 'redKills', 'redDeath', 'redAssist', 'redChampionDamageDealt', 'redTotalGold', 'redTotalMinionKills', 'redTotalLevel', 'redAvgLevel', 'redJungleMinionKills', 'redKillingSpree', 'redTotalHeal', 'redObjectDamageDealt']
let label = "blueWins"
let amountCorrect = 0;
let wonAndWon = 0;
let wonAndNotWon = 0;
let notWonAndWon = 0;
let notWonNotWon = 0;

function loadData(){
    Papa.parse("data/Challenger_Ranked_Games.csv", {
        download:true,
        header:true, 
        dynamicTyping:true,
        complete: results => trainModel(results.data),
        // maxTreeDepth: 3
    })
}

function trainModel(data) {
    data.sort(() => (Math.random() - 0.5))
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignoredColumns,
        trainingSet: trainData,
        categoryAttr: label
    })

    let json = decisionTree.toJSON()
    let visual = new VegaTree('#view', 2300, 1000, json)

    for (let i = 0; i < testData.length; i++) {
    
    let game = testData[i]
    // kopie van passenger maken, zonder het label
    const gameNoLabel = Object.assign({}, game)
    delete gameNoLabel.blueWins

    // prediction
    let prediction = decisionTree.predict(gameNoLabel)

    // vergelijk de prediction met het echte label
    if (prediction == game.blueWins) {
        console.log("Deze voorspelling is goed gegaan!")
        amountCorrect = amountCorrect + 1;
    }

    if (prediction == "1" && game.blueWins == "1") {
        wonAndWon = wonAndWon + 1;
    }   else if (prediction == "1" && game.blueWins == "0") {
        wonAndNotWon = wonAndNotWon + 1;
    }   else if (prediction == "0" && game.blueWins == "1") {
        notWonAndWon = notWonAndWon + 1;
    }   else if (prediction == "0" && game.blueWins == "0") {
        notWonNotWon = notWonNotWon + 1;
    }
}
let totalAmount = testData.length;
let accuracy = amountCorrect / totalAmount * 100;
document.getElementById('accuracy').innerHTML = "The accuracy is " + accuracy + "%";

var confusionTable = document.getElementById("confusion");
confusionTable.rows[1].cells[1].textContent = wonAndWon;
confusionTable.rows[1].cells[2].textContent = wonAndNotWon;
confusionTable.rows[2].cells[1].textContent = notWonAndWon;
confusionTable.rows[2].cells[2].textContent = notWonNotWon;

let jsons = decisionTree.stringify()
console.log(jsons)
}


loadData();