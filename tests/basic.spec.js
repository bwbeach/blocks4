import { test, expect } from '@playwright/test';

test.describe('Glass Block Designer', () => {
    test('should load the main page with all sections', async ({ page }) => {
        await page.goto('/');

        // Check that the page loads
        await expect(page).toHaveTitle('Glass Block Designer');

        // Check that main sections are present
        await expect(page.locator('h1')).toHaveText('Glass Block Designer');
        await expect(page.locator('#window-setup h2')).toHaveText('Step 1: Set up Windows');
        await expect(page.locator('#block-supply h2')).toHaveText('Step 2: Set up Block Supply');
        await expect(page.locator('#design-area h2')).toHaveText('Step 3: Design Your Windows');
        await expect(page.locator('#save-section h2')).toHaveText('Step 4: Save Your Work');
    });

    test('should have working number inputs', async ({ page }) => {
        await page.goto('/');

        // Test window number input
        const windowInput = page.locator('#num-windows');
        await expect(windowInput).toHaveValue('1');

        // Test color number input  
        const colorInput = page.locator('#num-colors');
        await expect(colorInput).toHaveValue('3');
    });

    test('should show placeholder content for setup sections', async ({ page }) => {
        await page.goto('/');

        // Check that placeholder content is shown
        await expect(page.locator('#window-sizes')).toContainText('Window setup will be implemented here');
        await expect(page.locator('#color-setup')).toContainText('Color setup will be implemented here');
    });
}); 