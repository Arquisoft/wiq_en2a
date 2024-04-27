function capitalQuestion(lang, country){
    if(lang === "en"){
        return `What is the capital of ${country}?`
    }else{
        return `¿Cual es la capital de ${country}?`
    }
}

function populationQuestion(lang, city){
    if(lang === "en"){
        return `What is the population of ${city}?`
    }else{
        return `¿Cual es la población de ${city}?`
    }
}

function chemicalQuestion(lang, chemical){
    if(lang === "en"){
        return `What is the chemical symbol of ${chemical}?`
    }else{
        return `¿Cual es el símbolo químico de ${chemical}?`
    }
}

function monumentQuestion(lang, monument){
    if(lang === "en"){
        return `Where is ${monument}?`
    }else{
        return `¿Dónde está ${monument}?`
    }
}

module.exports = {capitalQuestion, populationQuestion, chemicalQuestion, monumentQuestion}