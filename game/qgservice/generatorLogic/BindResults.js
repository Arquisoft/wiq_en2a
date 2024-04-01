
function bindCapitalsResults(queryResult){

    const capitals = new Map();

    queryResult.results.bindings.forEach(entry => {
        const label = entry.countryLabel.value;
        const capital = entry.capitalLabel.value;
        capitals.set(label, capital);
    });

    return capitals;
}

function bindPopulationResults(queryResult){
    const populationMap = new Map();

    queryResult.results.bindings.forEach(entry => {
        const cityLabel = entry.cityLabel.value;
        const population = parseFloat(entry.population.value);
        populationMap.set(cityLabel, population);
    });

    return populationMap
}

function bindChemicalResults(queryResult){
    const chemicalElementMap = new Map();

    queryResult.results.bindings.forEach(entry => {
        const elementLabel = entry.elementLabel.value;
        const symbol = parseFloat(entry.symbol.value);
        chemicalElementMap.set(symbol, elementLabel);
    });

    return chemicalElementMap
}

function bindMonumentResults(queryResult){
    const monumentMap = new Map();

    queryResult.results.bindings.forEach(entry => {
        const monumentLabel = entry.monumentLabel.value;
        const countryLabel = parseFloat(entry.countryLabel.value);
        monumentMap.set(monumentLabel, countryLabel);
    });

    return monumentMap
}

module.exports = { 
    bindCapitalsResults,
    bindPopulationResults,
    bindChemicalResults,
    bindMonumentResults
}
