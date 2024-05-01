module.exports = {
    testMatch: ["**/steps/*.js"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testTimeout: 30000,
    setupFilesAfterEnv: ["expect-puppeteer"],
}