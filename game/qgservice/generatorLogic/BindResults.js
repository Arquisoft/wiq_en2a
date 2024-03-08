
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

module.exports = { 
    bindCapitalsResults,
    bindPopulationResults
}
