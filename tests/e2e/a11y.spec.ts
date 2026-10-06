import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/**
 * Filter axe results to only serious and critical violations.
 * Moderate findings are non-blocking.
 */
function seriousAndCritical(violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']) {
    return violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
}

test('axe scan — EN: no serious or critical violations', async ({ page }) => {
    await page.goto('/');
    // Wait for i18n to fully apply before scanning
    await expect(page.locator('[data-set-lang="en"]')).toHaveAttribute('aria-pressed', 'true');

    const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();

    const blocking = seriousAndCritical(results.violations);

    if (blocking.length > 0) {
        const summary = blocking
            .map((v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} node(s))`)
            .join('\n');
        throw new Error(`Axe found ${blocking.length} serious/critical violation(s):\n${summary}`);
    }

    expect(blocking).toHaveLength(0);
});

test('axe scan — ES: no serious or critical violations', async ({ page }) => {
    await page.goto('/?lang=es');
    // Wait for ES to be applied before scanning (parity with the EN gate).
    await expect(page.locator('[data-set-lang="es"]')).toHaveAttribute('aria-pressed', 'true');

    const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();

    const blocking = seriousAndCritical(results.violations);

    if (blocking.length > 0) {
        const summary = blocking
            .map((v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} node(s))`)
            .join('\n');
        throw new Error(`Axe found ${blocking.length} serious/critical violation(s):\n${summary}`);
    }

    expect(blocking).toHaveLength(0);
});
