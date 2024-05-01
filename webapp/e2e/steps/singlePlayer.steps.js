
const puppeteer = require('puppeteer');

function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

(async () => {
    // Abrir un navegador Puppeteer
    const browser = await puppeteer.launch({ headless: false }); 
    const page = await browser.newPage();
    const timeout = 5000;

    // Configurar un tiempo de espera predeterminado para las acciones de la página
    page.setDefaultTimeout(timeout);

    // Ir a la página de inicio de sesión
    await page.goto('http://localhost:3000/');

    // Esperar a que aparezca el botón de inicio de sesión y hacer clic en él
    await page.waitForSelector('button.MuiButtonBase-root:nth-child(2)');
    await page.click('button.MuiButtonBase-root:nth-child(2)');

    // Esperar a que aparezca el campo de nombre de usuario, escribir el nombre de usuario y esperar
    await page.waitForSelector('div.MuiFormControl-root:nth-child(2) > div:nth-child(2)');
    await page.click('div.MuiFormControl-root:nth-child(2) > div:nth-child(2)'); // Hacer clic en el campo de usuario
    await page.type('div.MuiFormControl-root:nth-child(2) > div:nth-child(2)', 'PabloS',{ delay: 100 });

    // Esperar a que aparezca el campo de contraseña, escribir la contraseña y esperar
    await page.waitForSelector('div.MuiFormControl-root:nth-child(3) > div:nth-child(2)');
    await page.click('div.MuiFormControl-root:nth-child(3) > div:nth-child(2)'); // Hacer clic en el campo de contraseña
    await page.type('div.MuiFormControl-root:nth-child(3) > div:nth-child(2)', 'PabloPassword',{ delay: 100 });

    // Esperar a que aparezca el botón de inicio de sesión y hacer clic en él
    await page.waitForSelector('button.MuiButtonBase-root:nth-child(1)');
    await page.click('button.MuiButtonBase-root:nth-child(1)');
    
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

    // Cerrar el navegador
    await browser.close();

})().catch(err => {
    console.error(err);
    process.exit(1);
});
