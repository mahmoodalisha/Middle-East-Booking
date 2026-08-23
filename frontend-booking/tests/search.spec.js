/* eslint-disable */
import { test, expect } from '@playwright/test';

test('User can successfully search for a destination', async ({ page }) => {
  // 1. Go to the homepage
  await page.goto('http://localhost:3000');

  // 2. Verify the Navbar and Header loaded correctly
  // Because they are in separate spans, we check them individually!
  await expect(page.getByText('Urban')).toBeVisible();
  await expect(page.getByText('LODGINGS')).toBeVisible();
  
  await expect(page.getByText('Find your perfect stay.')).toBeVisible();

  // 3. Find the destination input using your React placeholder and type "Dubai"
  const destinationInput = page.getByPlaceholder('Where are you going?');
  await destinationInput.fill('Dubai');

  // 4. Test the Guests & Rooms dropdown
  const guestsToggle = page.getByText('1 adult · 0 children · 1 room');
  await guestsToggle.click();

  // 5. Click the "Search" button
  const searchButton = page.getByRole('button', { name: 'Search' });
  await searchButton.click();

  // 6. Verify that React Router successfully navigated to the List page
  await expect(page).toHaveURL(/.*hotels/);
});