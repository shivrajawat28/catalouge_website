import { chromium } from "playwright";
import fs from "node:fs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function runAdminTests() {
  console.log(`Starting Admin Portal Automated Test Suite against ${BASE_URL}...`);
  const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const browser = await chromium.launch({
    headless: true,
    ...(fs.existsSync(chromePath) ? { executablePath: chromePath } : {}),
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const results = [];
  function assert(condition, message) {
    if (!condition) {
      console.error(`❌ FAIL: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
    console.log(`✅ PASS: ${message}`);
    results.push(message);
  }

  try {
    // 1. Unauthenticated redirect test
    console.log("\n--- TEST 1: Unauthenticated Redirect ---");
    await page.goto(`${BASE_URL}/admin`, { waitUntil: "domcontentloaded" });
    await page.waitForURL("**/admin/login", { timeout: 8000 });
    assert(page.url().includes("/admin/login"), "Unauthenticated /admin redirects to /admin/login");

    // 2. Invalid Login Test
    console.log("\n--- TEST 2: Invalid Credentials Handling ---");
    await page.fill("#username", "admin");
    await page.fill("#password", "wrongpassword123");
    await page.click('button[type="submit"]');
    await page.waitForSelector('text=Invalid username or password', { timeout: 6000 });
    assert(page.url().includes("/admin/login"), "User stays on login page when password is invalid");

    // 3. Valid Login Test
    console.log("\n--- TEST 3: Valid Authentication ---");
    await page.fill("#username", "admin");
    await page.fill("#password", "advaita@2026");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin", { timeout: 8000 });
    assert(page.url().endsWith("/admin"), "Successful login redirects to /admin dashboard");

    // Verify Admin Portal UI elements
    await page.waitForSelector("text=Admin Panel", { timeout: 5000 });
    assert(await page.isVisible("text=Admin Panel"), "Admin Panel title badge is visible");
    assert(await page.isVisible("text=Products"), "Products tab is visible");
    assert(await page.isVisible("text=Categories"), "Categories tab is visible");
    assert(await page.isVisible("text=Videos"), "Videos tab is visible");

    // 4. Create Category Test
    console.log("\n--- TEST 4: Create Category ---");
    // Switch to Categories tab
    await page.click('button:has-text("Categories")');
    await page.waitForSelector('button:has-text("Create New Category")', { timeout: 5000 });
    await page.click('button:has-text("Create New Category")');

    // Fill category form
    await page.fill('input[placeholder="e.g. Temple Bells & Decor"]', "Temple Bells & Decor");
    await page.fill('textarea[placeholder="Short description of this collection..."]', "Sacred brass bells and ceremonial accents for temple and puja sanctum.");
    await page.click('button:has-text("Create Category")');

    // Wait for category to appear in list
    await page.waitForSelector("text=Temple Bells & Decor", { timeout: 6000 });
    assert(await page.isVisible("text=Temple Bells & Decor"), "Newly created category 'Temple Bells & Decor' appears in categories list");

    // 5. Create Product Test
    console.log("\n--- TEST 5: Create Product ---");
    await page.click('button:has-text("Products")');
    await page.waitForSelector('button:has-text("Add New Product")', { timeout: 5000 });
    await page.click('button:has-text("Add New Product")');

    // Fill product form
    await page.fill('input[placeholder="e.g. Radha Krishna"]', "Handcrafted Brass Temple Bell");
    await page.fill('input[placeholder="e.g. Antique Brass Idol"]', "Sacred Ritual Bell with Garuda Finial");
    await page.fill('input[placeholder="e.g. A timeless symbol of divine love, devotion, and harmony."]', "Resonant bell crafted for auspicious puja rituals.");
    await page.fill('textarea[placeholder="Describe the posture, devotional significance, casting details..."]', "Handcrafted solid brass bell producing clear, long-resonating acoustic vibrations.");
    await page.fill('input[placeholder="/images/products/my-statue.jpg"]', "/images/products/radha-krishna.jpg");

    // Select the newly created category in the dropdown
    await page.selectOption('form select', { label: "Temple Bells & Decor" });

    // Save product
    await page.click('button:has-text("Save Product")');
    await page.waitForSelector("text=Handcrafted Brass Temple Bell", { timeout: 8000 });
    assert(await page.isVisible("text=Handcrafted Brass Temple Bell"), "New product 'Handcrafted Brass Temple Bell' appears in products list");

    // 6. Add Video Test
    console.log("\n--- TEST 6: Add Video ---");
    await page.click('button:has-text("Videos")');
    await page.waitForSelector('button:has-text("Add New Video")', { timeout: 5000 });
    await page.click('button:has-text("Add New Video")');

    await page.fill('input[placeholder="e.g. /videos/gallery/my-video.mp4 or WhatsApp Video 2026-..."]', "lost-wax-casting-quenching.mp4");
    await page.fill('input[placeholder="e.g. posters/poster-15.jpg"]', "posters/poster-14.jpg");
    await page.fill('input[placeholder="e.g. Brass Polishing & Detailing"]', "Artisan Metal Polishing");
    await page.fill('textarea[placeholder="Editorial caption displayed under the video frame..."]', "Carefully buffing intricate relief carvings to achieve an heirloom antique luster.");
    await page.click('button:has-text("Add Video")');

    await page.waitForSelector("text=Artisan Metal Polishing", { timeout: 8000 });
    assert(await page.isVisible("text=Artisan Metal Polishing"), "New video 'Artisan Metal Polishing' appears in videos list");

    // 7. Verify Public /products page displays dynamic category and product
    console.log("\n--- TEST 7: Public /products Integration ---");
    await page.goto(`${BASE_URL}/products`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('button:has-text("Temple Bells & Decor")', { timeout: 8000 });
    assert(await page.isVisible('button:has-text("Temple Bells & Decor")'), "Public catalogue displays 'Temple Bells & Decor' category tab");

    // Click on the new category tab
    await page.click('button:has-text("Temple Bells & Decor")');
    await page.waitForSelector("text=Handcrafted Brass Temple Bell", { timeout: 6000 });
    assert(await page.isVisible("text=Handcrafted Brass Temple Bell"), "Public catalogue displays new product under 'Temple Bells & Decor'");

    // 8. Verify Homepage Video Gallery displays new video
    console.log("\n--- TEST 8: Public Homepage Video Integration ---");
    await page.goto(`${BASE_URL}/#video-gallery`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("text=Artisan Metal Polishing", { timeout: 8000 });
    assert(await page.isVisible("text=Artisan Metal Polishing"), "Homepage Video Gallery displays new video 'Artisan Metal Polishing'");

    // 9. Cleanup test product, category, and video
    console.log("\n--- TEST 9: Cleanup and Delete ---");
    await page.goto(`${BASE_URL}/admin`, { waitUntil: "domcontentloaded" });

    // Delete test product
    page.on("dialog", (dialog) => dialog.accept());
    const deleteProductBtn = page.locator('div:has-text("Handcrafted Brass Temple Bell") button[title="Delete product"]').first();
    if (await deleteProductBtn.isVisible()) {
      await deleteProductBtn.click();
      await page.waitForTimeout(1500);
      console.log("Cleaned up test product");
    }

    // Delete test video
    await page.click('button:has-text("Videos")');
    await page.waitForTimeout(500);
    const deleteVideoBtn = page.locator('div:has-text("Artisan Metal Polishing") button[title="Delete video"]').first();
    if (await deleteVideoBtn.isVisible()) {
      await deleteVideoBtn.click();
      await page.waitForTimeout(1500);
      console.log("Cleaned up test video");
    }

    // Delete test category
    await page.click('button:has-text("Categories")');
    await page.waitForTimeout(500);
    const deleteCategoryBtn = page.locator('div:has-text("Temple Bells & Decor") button[title="Delete Category"]').first();
    if (await deleteCategoryBtn.isVisible()) {
      await deleteCategoryBtn.click();
      await page.waitForTimeout(1500);
      console.log("Cleaned up test category");
    }

    // 10. Logout test
    console.log("\n--- TEST 10: Sign Out ---");
    await page.click('button:has-text("Sign Out")');
    await page.waitForURL("**/admin/login", { timeout: 6000 });
    assert(page.url().includes("/admin/login"), "Sign Out redirects back to /admin/login");

    console.log("\n==========================================");
    console.log(`🎉 ALL ${results.length} ADMIN SUITE TESTS PASSED SUCCESSFULLY!`);
    console.log("==========================================\n");
  } finally {
    await browser.close();
  }
}

runAdminTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
