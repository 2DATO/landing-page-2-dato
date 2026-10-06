import { test, expect, request } from '@playwright/test';

/**
 * Checklist de lanzamiento contra el sitio desplegado.
 * Solo corre con LAUNCH_URL definido (no en CI, que prueba el servidor local):
 *   LAUNCH_URL=https://2dato.co npx playwright test launch
 * Artefacto: playwright-report/ (capturas móviles adjuntas a cada test).
 */
const BASE = process.env.LAUNCH_URL;
test.skip(!BASE, 'LAUNCH_URL no definido');

test('home en móvil: sin scroll horizontal, CTA visible y apunta al buzón real', async ({
    page,
}, info) => {
    test.skip(info.project.name !== 'chromium-mobile', 'solo móvil');
    await page.goto(BASE!);
    const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);

    // El CTA del hero queda bajo el pliegue en móvil; el de la barra fija es el visible.
    const cta = page.locator('#nav-cta-contact');
    await expect(cta).toBeInViewport();
    await cta.click();
    const mailto = page.locator('#contact a[href^="mailto:"]').first();
    await expect(mailto).toBeInViewport();
    await expect(mailto).toHaveAttribute('href', 'mailto:hello@2dato.co');
    await expect(page.locator('#contact a[href="#"]')).toHaveCount(0);
    await info.attach('contacto-movil', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });
});

test('SEO: canonical, OG y JSON-LD usan el dominio final', async ({ page }) => {
    await page.goto(BASE!);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        'https://2dato.co/'
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        'content',
        'https://2dato.co/'
    );
    await expect(page.locator('main')).toHaveCount(1);
    const html = await page.content();
    expect(html).not.toContain('www.2dato.co');
    expect(html).not.toContain('2dato.com');
});

test('archivos de lanzamiento y 404 propia', async () => {
    const api = await request.newContext({ baseURL: BASE });
    for (const path of [
        '/robots.txt',
        '/sitemap.xml',
        '/favicon.ico',
        '/apple-touch-icon.png',
        '/assets/og.png',
        '/legal.html',
    ]) {
        expect((await api.get(path)).status(), path).toBe(200);
    }
    expect(await (await api.get('/robots.txt')).text()).toContain(
        'Sitemap: https://2dato.co/sitemap.xml'
    );
    expect(await (await api.get('/sitemap.xml')).text()).not.toContain('www.2dato.co');

    const missing = await api.get('/ruta-que-no-existe');
    expect(missing.status()).toBe(404);
    expect(await missing.text()).toContain('href="/"');
    expect(await missing.text()).not.toContain('GitHub Pages');
});

test('página legal: idioma cambia y footer enlaza', async ({ page }, info) => {
    await page.goto(BASE!);
    await page.locator('footer a[href="legal.html#privacidad"]').click();
    await expect(page).toHaveURL(/legal\.html#privacidad$/);
    await page.locator('[data-set-lang="es"]').first().click();
    await expect(page.locator('#privacidad [lang="es"]').first()).toBeVisible();
    await expect(page.locator('#privacidad [lang="en"]').first()).toBeHidden();
    await info.attach('legal', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
    });
});
