import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUT_DIR = path.join(process.cwd(), 'screenshots');

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log(`Starting automated screenshot capture from ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop Context (1360x900)
  const desktopContext = await browser.newContext({
    viewport: { width: 1360, height: 900 },
    deviceScaleFactor: 2,
  });

  const page = await desktopContext.newPage();

  // Helper wait
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    // 1. Discover View (Default Desktop)
    console.log('Capturing: discover.png');
    await page.goto(`${BASE_URL}#discover`, { waitUntil: 'networkidle' });
    await wait(2000); // Allow 3D globe and count-ups to initialize
    await page.screenshot({ path: path.join(OUT_DIR, 'discover.png'), fullPage: false });

    // 2. Search Results
    console.log('Capturing: search-results.png');
    const searchInput = page.locator('#q');
    if (await searchInput.isVisible()) {
      await searchInput.fill('Chennai');
      await wait(1000);
      await page.screenshot({ path: path.join(OUT_DIR, 'search-results.png') });
      await searchInput.fill('');
      await wait(500);
    }

    // 3. Filtered by Category
    console.log('Capturing: filtered-by-category.png');
    const catBtn = page.locator('button.ch:has-text("Historical")');
    if (await catBtn.isVisible()) {
      await catBtn.click();
      await wait(800);
      await page.screenshot({ path: path.join(OUT_DIR, 'filtered-by-category.png') });
      // Reset
      await page.locator('button.ch:has-text("Everything")').click();
      await wait(500);
    }

    // 4. Empty Results
    console.log('Capturing: empty-results.png');
    if (await searchInput.isVisible()) {
      await searchInput.fill('nonexistent-destination-xyz-1234');
      await wait(1000);
      await page.screenshot({ path: path.join(OUT_DIR, 'empty-results.png') });
      await searchInput.fill('');
      await wait(500);
    }

    // 5. Place Sheet (Open details on first card)
    console.log('Capturing: place-sheet.png');
    const firstCard = page.locator('.cd').first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
      await wait(1500); // Allow sheet animation and live weather to load
      await page.screenshot({ path: path.join(OUT_DIR, 'place-sheet.png') });
      // Close sheet
      await page.keyboard.press('Escape');
      await wait(500);
    }

    // 6. AI Planner View
    console.log('Capturing: ai-planner-result.png');
    await page.goto(`${BASE_URL}#plan`, { waitUntil: 'networkidle' });
    await wait(800);
    const planBtn = page.locator('#pgo, button:has-text("Plan my days")');
    if (await planBtn.isVisible()) {
      await planBtn.click();
      // Wait for AI generation or mock response
      await wait(4000);
      await page.screenshot({ path: path.join(OUT_DIR, 'ai-planner-result.png'), fullPage: false });
    }

    // 7. My Trip (Populated & Empty)
    console.log('Capturing: trip views');
    await page.goto(`${BASE_URL}#trip`, { waitUntil: 'networkidle' });
    await wait(1200);

    // 7. My Trip (Populated & Empty)
    console.log('Capturing: trip views');
    // Ensure at least one item is present
    const dests = await (await fetch(`${BASE_URL}/api/destinations`)).json();
    if (dests.data && dests.data[0]) {
      const d = dests.data[0];
      await fetch(`${BASE_URL}/api/itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId: d.id,
          name: d.name,
          city: d.city,
          country: d.country,
          category: d.category,
          description: d.description,
          imageUrl: d.imageUrl,
          latitude: d.latitude,
          longitude: d.longitude,
          dayNumber: 1,
          notes: 'Morning visit, buy tickets online',
          estimatedCost: 40,
        }),
      });
    }

    await page.goto(`${BASE_URL}#trip`, { waitUntil: 'networkidle' });
    await wait(1200);
    console.log('Capturing: trip-populated.png');
    await page.screenshot({ path: path.join(OUT_DIR, 'trip-populated.png') });

    // Clear trip to capture empty state with 3D Fox mascot
    await fetch(`${BASE_URL}/api/itinerary`, { method: 'DELETE' });
    await page.reload({ waitUntil: 'networkidle' });
    await wait(1500);
    console.log('Capturing: trip-empty.png');
    await page.screenshot({ path: path.join(OUT_DIR, 'trip-empty.png') });

    // Restore item for subsequent views
    if (dests.data && dests.data[0]) {
      const d = dests.data[0];
      await fetch(`${BASE_URL}/api/itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId: d.id,
          name: d.name,
          city: d.city,
          country: d.country,
          category: d.category,
          description: d.description,
          imageUrl: d.imageUrl,
          latitude: d.latitude,
          longitude: d.longitude,
          dayNumber: 1,
          notes: 'Morning visit, buy tickets online',
          estimatedCost: 40,
        }),
      });
    }

    // 8. Dark Mode
    console.log('Capturing: dark-mode.png');
    await page.goto(`${BASE_URL}#discover`, { waitUntil: 'networkidle' });
    await wait(800);
    const darkToggle = page.locator('#dk');
    if (await darkToggle.isVisible()) {
      await darkToggle.click();
      await wait(800);
      await page.screenshot({ path: path.join(OUT_DIR, 'dark-mode.png') });
      // Reset back
      await darkToggle.click();
      await wait(300);
    }

    await page.close();
    await desktopContext.close();

    // 2. Mobile Context (390x844 - iPhone 14 / Mobile standard)
    console.log('Capturing mobile viewports...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });

    const mobilePage = await mobileContext.newPage();

    // 9. Mobile Discover
    console.log('Capturing: discover-mobile.png');
    await mobilePage.goto(`${BASE_URL}#discover`, { waitUntil: 'networkidle' });
    await wait(1500);
    await mobilePage.screenshot({ path: path.join(OUT_DIR, 'discover-mobile.png') });

    // 10. Mobile Place Sheet
    console.log('Capturing: place-sheet-mobile.png');
    const mobileCard = mobilePage.locator('.cd').first();
    if (await mobileCard.isVisible()) {
      await mobileCard.click();
      await wait(1500);
      await mobilePage.screenshot({ path: path.join(OUT_DIR, 'place-sheet-mobile.png') });
      await mobilePage.keyboard.press('Escape');
      await wait(500);
    }

    // 11. Mobile Trip
    console.log('Capturing: trip-mobile.png');
    await mobilePage.goto(`${BASE_URL}#trip`, { waitUntil: 'networkidle' });
    await wait(1200);
    await mobilePage.screenshot({ path: path.join(OUT_DIR, 'trip-mobile.png') });

    await mobilePage.close();
    await mobileContext.close();

    console.log('All screenshots captured successfully in ./screenshots!');
  } catch (err) {
    console.error('Error taking screenshots:', err);
  } finally {
    await browser.close();
  }
}

main();
