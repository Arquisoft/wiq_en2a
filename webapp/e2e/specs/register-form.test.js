const puppeteer = require('puppeteer');

let page1;
let page2;
let browser;

//, slowMo: 100
beforeAll(async () => {
  browser = process.env.GITHUB_ACTIONS
    ? await puppeteer.launch()
    : await puppeteer.launch({ headless: false});

  page1 = await browser.newPage();
  page2 = await browser.newPage();

  await page1.goto("http://localhost:3000", {
    waitUntil: "networkidle0",
  });

  await page2.goto("http://localhost:3000", {
    waitUntil: "networkidle0",
  });
  page1.bringToFront();
},10000);

test('Registro exitoso y registro con error en dos ventanas', async () => {
  let username = "pablo";
  let password = "pabloasw";

  // Primera ventana: Registro exitoso

  const [boton1] = await page1.$x('/html/body/div/main/div/div/button[1]');
  if (boton1) {
    await boton1.click();
  } else {
    console.error('No se encontró el botón');
  }

  
  await page1.type('input[name="username"]', username);
  await page1.type('input[name="password"]', password);
  await page1.click("button.MuiButtonBase-root:nth-child(1)");
  await page2.bringToFront();
  

  // Segunda ventana: Registro con error

  const [boton2] = await page2.$x('/html/body/div/main/div/div/button[1]');
  if (boton2) {
    await boton2.click();
  } else {
    console.error('No se encontró el botón');
  }
  await page2.waitForSelector('input[name="username"]');
  await page2.type('input[name="username"]', username); // Usuario ya existente
  await page2.type('input[name="password"]', password);
  await page2.click("button.MuiButtonBase-root:nth-child(1)");
  

  const elements = await page2.$x('/html/body/div/main/div/main/div[4]');

  // Verificar si se encontró algún elemento
  if (elements.length > 0) {
    // Si se encontró al menos un elemento, evaluamos el texto del primer elemento
    const textContent = await page.evaluate(element => element.textContent.trim(), elements[0]);
    // Verificar si el texto contiene "error"
    expect(textContent).toContain('error');
  } else {
    // Si no se encontró ningún elemento, muestra un mensaje de error
    console.error('No se encontró ningún elemento con el XPath proporcionado.');
  }
   
},20000);

afterAll(async () => {
  await page1.close();
  await page2.close();
  await browser.close();
});