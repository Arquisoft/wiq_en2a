const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const feature = loadFeature('./features/singlePlayer.feature');


function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

defineFeature(feature, test => {

let page;
let browser;

    beforeAll(async () => {
         
         browser = await puppeteer.launch({ headless: false }); 
         page = await browser.newPage();
        const timeout = 5000;
       
        page.setDefaultTimeout(timeout);
        
        await page.goto('http://localhost:80/');

    });

    test('The user plays a game', ({given,when,then}) => {
        jest.setTimeout(5 * 60 * 1000);
        given('A registered user', async() => {
            username = "pabloS"
            password = "pabloPassword"
            await page.waitForSelector('button')
            await page.click("button", {text: "REGISTRARSE"});
            await page.type('input[name="username"]', username,{ delay: 100 });
            await page.type('input[name="password"]', password,{ delay: 100 });
            await page.waitForSelector('button')
            await page.click('button', { text: 'REGISTRARSE' })

        });
        when('I login into the game and start a game in single player mode', async() => {
            // Esperar a que aparezca el botón de juego individual y hacer clic en él
            await page.waitForSelector('a.game-page-button:nth-child(1)');
            await page.click('a.game-page-button:nth-child(1)');

            // Esperar a que aparezca el botón "add bot" y hacer clic en él
            await page.waitForSelector('.add-bot-button');
            await page.click('.add-bot-button');
            await delay(6000);
            // Esperar a que aparezca el botón "start game" y hacer clic en él
            await page.waitForSelector('.start-game-button');
            await page.click('.start-game-button');
            await delay(1500);
        });
        then('The answers and questions should appear the expected number of rounds', async() => {
            // Selector base para el botón de respuesta
            const answerSelector = '.answer-grid > button:nth-child';

            // Hacer clic en el botón de respuesta 13 veces utilizando un bucle for
            for (let i = 1; i <= 13; i++) {
                const fullSelector = `${answerSelector}(${1})`; // Selector completo para cada botón de respuesta
                await page.waitForSelector(fullSelector); // Esperar a que aparezca el botón de respuesta actual
                await page.click(fullSelector); // Hacer clic en el botón de respuesta actual
                console.log('Clicked answer', i); // Imprimir un mensaje en la consola
                await delay(5000);
    }
        });
    });
    afterAll(async ()=>{
        browser.close()
      })
});
