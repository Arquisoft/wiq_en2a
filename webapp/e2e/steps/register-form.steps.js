const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/register-form.feature');

let page1;
let browser;

defineFeature(feature, test => {
  let username;
  let password;
  username = "pablo";
  password = "pabloasw;"

  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 100 });
    
    page1 = await browser.newPage();
    page2 = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 })

    await page1
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});

      await page2
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  

  test('The user is not registered in the site', ({given,when,then}) => {
    given('An unregistered user', async () => {
      
      await page1.waitFor('button')
      await page1.click("button", {id: "registerButton"});
    });

    when('I fill the data in the form and press submit', async () => {
      await page1.type('input[name="username"]', username);
      await page1.type('input[name="password"]', password);
      await page1.click('button', { text: 'Add User' }) 
    });

   then('A confirmation message should be shown in the screen', async () => {
      const confirmationMessage = await page1.waitForSelector('div',"#successUserAdd");

      const messageText = await page1.evaluate(confirmationMessage => confirmationMessage.innerText, confirmationMessage);
      expect(messageText).toContain('User added successfully');
    });
  })


  test('Registro exitoso y registro con error en dos ventanas', async () => {
    given("A registered user", async () => {
    // Primera ventana: Registro exitoso
    await page1.type('input[name="username"]', username);
    await page1.type('input[name="password"]', password);
    await page1.click('button[type="submit"]');
    });
    when("I try to register with the same user", async () => {
    // Segunda ventana: Registro con error
    await page2.type('input[name="username"]', 'usuario1'); // Usuario ya existente
    await page2.type('input[name="password"]', 'contraseña2');
    await page2.click('button[type="submit"]');
    await page2.waitForSelector('.error-message');
  });
  then("An error message should be shown in the screen", async () => {
    const messageText = await page2.evaluate(errorMessage => errorMessage.innerText, errorMessage);
    expect(messageText).toContain('error');
  });
  });
  afterAll(async ()=>{
    browser.close()
  })

});