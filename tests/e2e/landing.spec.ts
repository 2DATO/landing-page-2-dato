import { test, expect } from '@playwright/test';

// ES catalog value for nav.cap — used in lang persistence assertion
const ES_NAV_CAP = 'Capacidades';

test('smoke — page loads cleanly with visible h1 and correct title', async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];

    page.on('pageerror', (err) => {
        pageErrors.push(err.message);
    });
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    await page.goto('/');

    await expect(page).toHaveTitle(/2DATO/);
    await expect(page.locator('h1').first()).toBeVisible();

    expect(pageErrors, `Unexpected page errors: ${pageErrors.join(', ')}`).toHaveLength(0);
    expect(consoleErrors, `Unexpected console errors: ${consoleErrors.join(', ')}`).toHaveLength(0);
});

test('skip-link is first focusable and reveals on Tab', async ({ page }) => {
    await page.goto('/');

    // Tab once from the body to focus the first focusable element
    await page.keyboard.press('Tab');

    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toBeFocused();

    // Pressing Enter triggers smooth-scroll to #hero via main.js (preventDefault is called
    // so the hash does not update — validate the hero section is in viewport instead)
    await page.keyboard.press('Enter');

    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();

    // scrollY should be at or near the top (hero is the topmost section)
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(200);
});

test('nav anchors scroll each section into viewport', async ({ page }) => {
    // Primary nav has 4 .nlink anchors: capabilities, approach, industries, team.
    // On mobile (<960px) nav .nlinks are display:none — use the footer nav instead.
    // #contact is reached via the CTA button (not a .nlink) — covered separately.
    const anchors = ['capabilities', 'approach', 'industries', 'team'];

    await page.goto('/');

    const viewportWidth = page.viewportSize()?.width ?? 1440;
    const isMobile = viewportWidth < 960;

    for (const id of anchors) {
        // Reset scroll to top before each click. behavior: 'instant' is synchronous —
        // no settle delay needed.
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

        // On mobile, .nlink elements are hidden; use the footer nav link instead
        const navLink = isMobile
            ? page.locator(`nav[aria-label="Footer"] a[href="#${id}"]`)
            : page.locator(`nav.nav .nlink[href="#${id}"]`);

        await expect(navLink).toBeVisible();
        await navLink.click();

        const target = page.locator(`#${id}`);
        // Wait for the element to be in the DOM and scroll to settle
        await expect(target).toBeVisible();
        // Verify target is in or near the viewport
        await expect
            .poll(
                async () => {
                    const box = await target.boundingBox();
                    const viewportSize = page.viewportSize();
                    if (!box || !viewportSize) return false;
                    return box.y >= 0 && box.y < viewportSize.height * 1.5;
                },
                { timeout: 3000 }
            )
            .toBe(true);
    }
});

test('hero CTA buttons have correct hrefs', async ({ page }) => {
    await page.goto('/');

    const ctaContact = page.locator('#hero-cta-contact');
    await expect(ctaContact).toBeVisible();
    const contactHref = await ctaContact.getAttribute('href');
    expect(contactHref).toBe('#contact');

    const ctaCapabilities = page.locator('#hero-cta-capabilities');
    await expect(ctaCapabilities).toBeVisible();
    const capHref = await ctaCapabilities.getAttribute('href');
    expect(capHref).toBe('#capabilities');
});

test('CTA card contains a mailto link for hello@2dato.co', async ({ page }) => {
    await page.goto('/');

    const mailtoLink = page.locator('#contact a[href^="mailto:hello@2dato.co"]').first();
    await expect(mailtoLink).toBeVisible();

    const href = await mailtoLink.getAttribute('href');
    expect(href).toMatch(/^mailto:hello@2dato.co$/);
});

test('lang toggle persists ES across page reload', async ({ page }) => {
    await page.goto('/');

    // Switch to ES
    const esBtn = page.locator('[data-set-lang="es"]');
    const enBtn = page.locator('[data-set-lang="en"]');
    await esBtn.click();

    // Verify toggle state
    await expect(esBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(enBtn).toHaveAttribute('aria-pressed', 'false');

    // Verify a known string switched to Spanish
    const capLink = page.locator('nav .nlink[href="#capabilities"]');
    await expect(capLink).toHaveText(ES_NAV_CAP);

    // Pin down that we are exercising the storage code path, not the navigator-detection
    // fallback. Storage key matches i18n.js STORAGE_KEY (note the dot, not underscore).
    const stored = await page.evaluate(() => localStorage.getItem('2dato.lang'));
    expect(stored).toBe('es');

    // Reload and check persistence
    await page.reload();

    await expect(esBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(capLink).toHaveText(ES_NAV_CAP);
});

test('?lang=es URL param applies ES on first paint', async ({ browser }) => {
    // Use a fresh context with no stored preferences
    const context = await browser.newContext({
        storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();

    await page.goto('/?lang=es');

    const esBtn = page.locator('[data-set-lang="es"]');
    await expect(esBtn).toHaveAttribute('aria-pressed', 'true');

    await context.close();
});

test('reduced-motion: anchor click lands instantly without smooth delay', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Ensure we are scrolled to the very top. behavior: 'instant' is synchronous —
    // no settle delay needed.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

    // On mobile (<960px) the primary nav .nlinks are hidden; use the footer nav link.
    const viewportWidth = page.viewportSize()?.width ?? 1440;
    const isMobile = viewportWidth < 960;
    const teamLink = isMobile
        ? page.locator('nav[aria-label="Footer"] a[href="#team"]')
        : page.locator('nav.nav .nlink[href="#team"]');

    await expect(teamLink).toBeVisible();
    await teamLink.click();

    // Under reduced-motion the scroll should be 'instant' — check scrollY is > 200
    // within 400ms. Smooth scroll takes 500ms+ on a tall page, so this still
    // discriminates between the two while leaving headroom for cold CI runners.
    await expect
        .poll(
            async () => {
                const scrollY = await page.evaluate(() => window.scrollY);
                return scrollY;
            },
            { intervals: [50, 100, 100], timeout: 400 }
        )
        .toBeGreaterThan(200);
});
