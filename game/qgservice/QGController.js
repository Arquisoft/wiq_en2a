const { generateQuestionPopulation, generateQuestionCapital } = require('./generatorLogic/questiongenerator');
const { executeSparqlQuery } = require('./generatorLogic/SparqlQuery')
const { bindCapitalsResults, bindPopulationResults } = require('./generatorLogic/BindResults')
const { spainCapitalQuery, worldCapitalQuery, worldPopulationQuery } = require('./generatorLogic/queries')
const { createMathQuestions } = require('./generatorLogic/MathQuestions')

let QGController = {
    getQuestions: async (req, res) => {
        try{
            let nQuestions;
            const questions = [];

            // spain capitals
            nQuestions = 2;
            const spainQueryResult = await executeSparqlQuery(spainCapitalQuery);
            const spainCapitals = bindCapitalsResults(spainQueryResult)

            for (let i = 0; i < nQuestions; i++) {
                const question = generateQuestionCapital(spainCapitals);
                questions.push(question);
            }

            // world capitals
            nQuestions = 3;
            const worldQueryResult = await executeSparqlQuery(worldCapitalQuery);
            const worldCapitals = bindCapitalsResults(worldQueryResult)
        
            for (let i = 0; i < nQuestions; i++) {
            const question = generateQuestionCapital(worldCapitals);
            questions.push(question);
            }

            // world population
            nQuestions = 5;
            const worldPopulationResult = await executeSparqlQuery(worldPopulationQuery);
            const worldPopulation = bindPopulationResults(worldPopulationResult)
        
            for (let i = 0; i < nQuestions; i++) {
            const question = generateQuestionPopulation(worldPopulation);
            questions.push(question);
            }

            // math questions
            const mathquestions = await createMathQuestions(5)
            questions.push(...mathquestions)

            res.json(questions);

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = QGController;