const { generateQuestionPopulation, generateQuestionCapital, generateQuestionChemical, generateQuestionMonument } = require('./generatorLogic/questiongenerator');
const Question4Answers = require('./Question4Answers');
const { executeSparqlQuery } = require('./generatorLogic/SparqlQuery')
const { bindCapitalsResults, bindPopulationResults, bindChemicalResults, bindMonumentResults } = require('./generatorLogic/BindResults')
const { spainCapitalQuery, worldCapitalQuery, worldPopulationQuery, chemicalElementQuery, monumentQuery } = require('./generatorLogic/queries')
const { createMathQuestions } = require('./generatorLogic/MathQuestions')

let QGController = {
    getQuestions: async (req, res) => {
        try{
            const lang = req.params.lang;

            let nQuestions;
            const questions = [];

            // spain capitals
            nQuestions = 3;
            const spainQueryResult = await executeSparqlQuery(spainCapitalQuery);
            const spainCapitals = bindCapitalsResults(spainQueryResult)

            for (let i = 0; i < nQuestions; i++) {
                const question = generateQuestionCapital(spainCapitals, lang);
                questions.push(question);
            }

            // world capitals
            nQuestions = 2;
            const worldQueryResult = await executeSparqlQuery(worldCapitalQuery);
            const worldCapitals = bindCapitalsResults(worldQueryResult)
        
            for (let i = 0; i < nQuestions; i++) {
            const question = generateQuestionCapital(worldCapitals, lang);
            questions.push(question);
            }

            // world population
            nQuestions = 2;
            const worldPopulationResult = await executeSparqlQuery(worldPopulationQuery);
            const worldPopulation = bindPopulationResults(worldPopulationResult)
        
            for (let i = 0; i < nQuestions; i++) {
            const question = generateQuestionPopulation(worldPopulation, lang);
            questions.push(question);
            }

            // chemical elements
            nQuestions = 2;
            const chemicalResult = await executeSparqlQuery(chemicalElementQuery);
            const chemicalElement = bindChemicalResults(chemicalResult)
        
            for (let i = 0; i < nQuestions; i++) {
            const question = generateQuestionChemical(chemicalElement, lang);
            questions.push(question);
            }

            // monuments
            nQuestions = 2;
            const monumentResult = await executeSparqlQuery(monumentQuery);
            const monument = bindMonumentResults(monumentResult)
        
            for (let i = 0; i < nQuestions; i++) {
            const question = generateQuestionMonument(monument, lang);
            questions.push(question);
            }

            // math questions
            const mathquestions = await createMathQuestions(3)
            questions.push(...mathquestions)

            res.json(questions);

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getQuestionsByIds: async (req, res) => {
        try {
            const { ids } = req.body;
            const questions = [];
            for (const id of ids) {
                const question = await Question4Answers.find({uuid: id})
                questions.push(question);
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = QGController;