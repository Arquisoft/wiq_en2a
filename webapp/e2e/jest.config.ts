import { Config } from '@jest/types';

const config: Config.InitialOptions = {
    testMatch: ["**/steps/*.ts"],
    testTimeout: 30000,
    setupFilesAfterEnv: ["expect-puppeteer"]
};

export default config;