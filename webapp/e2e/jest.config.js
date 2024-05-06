module.exports = {
    testMatch: ["**/steps/*.js"],
    testTimeout: 30000,
    setupFilesAfterEnv: ["expect-puppeteer"],
    verbose: true,
    testURL: "http://localhost/",
}