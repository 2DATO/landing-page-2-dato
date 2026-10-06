import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.CI ? 8080 : 5173;
const HOST = process.env.CI ? '127.0.0.1' : 'localhost';
const baseURL = `http://${HOST}:${PORT}`;

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: [['html', { open: 'never' }], ['list']],
    use: {
        baseURL,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium-desktop',
            use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
        },
        {
            name: 'chromium-mobile',
            use: { ...devices['Pixel 5'] },
        },
    ],
    webServer: {
        command: `npx serve -l ${PORT} .`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
    },
});
