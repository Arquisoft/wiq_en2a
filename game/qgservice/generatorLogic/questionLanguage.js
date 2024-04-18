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

module.exports = {capitalQuestion, populationQuestion}