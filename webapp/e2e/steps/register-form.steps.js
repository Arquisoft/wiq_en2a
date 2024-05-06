const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/register-form.feature');

let page;
let browser;

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ slowMo: 100 });
    page = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 })

    await page
      .goto("http://localhost:80", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test('The user is not registered in the site', ({given,when,then}) => {
    
    let username;
    let password;

    given('An unregistered user', async () => {
      username = "conoceryvenceruser"
      password = "conoceryvencerpass"
      await page.waitForSelector('button')
      await page.click("button", {id: "registerButton"});
    });

    when('I fill the data in the form and press submit', async () => {
      await page.type('input[name="username"]', username);
      await page.type('input[name="password"]', password);
      await page.waitForSelector('button')
      await page.click('button', { text: 'Registrarse' }) 
    });

   then('Should be inside the game route', async () => {
      await page.waitForSelector('div', '.game-container');
      expect(page.url()).toContain('/game');
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});