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

    test('should show window size controls and placeholder for color setup', async ({ page }) => {
        await page.goto('/');

        // Check that window size controls are shown
        await expect(page.locator('#window-sizes')).toContainText('Window 1');
        await expect(page.locator('#window-0-width')).toHaveValue('6');
        await expect(page.locator('#window-0-height')).toHaveValue('6');

        // Check that color setup placeholder is shown
        await expect(page.locator('#color-setup')).toContainText('Color setup will be implemented here');
    });

    test('should display JSON state in design details', async ({ page }) => {
        await page.goto('/');

        // Check that design output shows initial state as JSON
        const designOutput = page.locator('#design-output');
        const initialJson = await designOutput.inputValue();

        expect(JSON.parse(initialJson)).toEqual({
            numWindows: 1,
            windows: [{ width: 6, height: 6 }]
        });

        // Change number of windows and verify JSON updates
        await page.locator('#num-windows').fill('3');
        await page.locator('#num-windows').blur();

        const updatedJson = await designOutput.inputValue();
        expect(JSON.parse(updatedJson)).toEqual({
            numWindows: 3,
            windows: [
                { width: 6, height: 6 },
                { width: 6, height: 6 },
                { width: 6, height: 6 }
            ]
        });
    });

    test('should update JSON when window dimensions change', async ({ page }) => {
        await page.goto('/');

        // Change window dimensions
        await page.locator('#window-0-width').fill('10');
        await page.locator('#window-0-width').blur();

        await page.locator('#window-0-height').fill('8');
        await page.locator('#window-0-height').blur();

        // Check that JSON reflects the changes
        const designOutput = page.locator('#design-output');
        const updatedJson = await designOutput.inputValue();
        expect(JSON.parse(updatedJson)).toEqual({
            numWindows: 1,
            windows: [{ width: 10, height: 8 }]
        });
    });
}); 