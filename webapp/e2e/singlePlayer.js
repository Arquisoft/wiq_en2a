
const puppeteer = require('puppeteer'); // Add this line to import puppeteer

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const timeout = 5000;
    page.setDefaultTimeout(timeout);

    {
        const targetPage = page;
        await targetPage.setViewport({
            width: 215,
            height: 702
        })
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        }
        startWaitingForEvents();
        await targetPage.goto('http://localhost:3000/');
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"login\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 107.90000009536743,
                y: 19.399993896484375,
              },
            });
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@id=\\":r1:\\"])')
        ])
            .setTimeout(timeout)
            .fill('PabloS');
    }
    await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@id=\\":r3:\\"])')
        ])
            .setTimeout(timeout)
            .fill('PabloPassword');
    }
    await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"init\\"]/div/main/div/div[3]/button[1])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 83,
                y: 9.89996337890625,
              },
            });
    }
    await page.waitFor(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@id=\\"root\\"]/div/button[1]/a)')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 95.71249771118164,
                y: 15.600006103515625,
              },
            });
    }
    await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"add-bot-button\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 48.20000076293945,
                y: 23.48748779296875,
              },
            });
    }
    await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"add-bot-button\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 62.20000076293945,
                y: 27.6875,
              },
            });
    }
    await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"start-game-button\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 26.412498474121094,
                y: 49.88751220703125,
              },
            });
    }
    await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"answer-Zaragoza City\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 74.94900703430176,
                y: 30.647064208984375,
              },
            });
    }
    await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"answer-Santa Cruz de Tenerife\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 75.07829856872559,
                y: 30.558135986328125,
              },
            });
    }await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"answer-City of Valencia\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 75.08199691772461,
                y: 30.557891845703125,
              },
            });
    }await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"answer-Kampala\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 74.91261291503906,
                y: 30.493377685546875,
              },
            });
    }await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"answer-San Salvador\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 74.6823673248291,
                y: 30.49365234375,
              },
            });
    }await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"answer-804237\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 74.88681030273438,
                y: 30.449310302734375,
              },
            });
    }await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"answer-461346\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 74.88809204101562,
                y: 30.450042724609375,
              },
            });
    }await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"answer-B\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 53.96490669250488,
                y: 28.493682861328125,
              },
            });
    }await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"answer-Ag\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 54.44675827026367,
                y: 28.767486572265625,
              },
            });
    }await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"answer-United States of America\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 53.76158142089844,
                y: 28.448974609375,
              },
            });
    }await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"answer-United Kingdom\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 53.84560585021973,
                y: 28.494049072265625,
              },
            });
    }await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@id=\\"root\\"]/div/div/div[2])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 56,
                y: 51.25,
              },
            });
    }await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"answer--45\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 45.233205795288086,
                y: 29.246139526367188,
              },
            });
    }await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"answer--86\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 45.07732582092285,
                y: 29.157562255859375,
              },
            });
    }await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(/html)')
        ])
            .setTimeout(timeout)
            .click({
              delay: 413.79999999981374,
              offset: {
                x: 63,
                y: 268,
              },
            });
    }await page.waitForTimeout(1000);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-xpath(/html)')
        ])
            .setTimeout(timeout)
            .click({
              delay: 428.70000000018626,
              offset: {
                x: 425,
                y: 462,
              },
            });
    }

    await browser.close();

})().catch(err => {
    console.error(err);
    process.exit(1);
});
