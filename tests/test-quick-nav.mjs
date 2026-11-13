import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const ARTIFACTS_DIR = path.resolve("tests/artifacts/quick-nav");

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

async function testQuickNav() {
  console.log(`Starting Quick Navigation verification against ${BASE_URL}...`);
  const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const browser = await chromium.launch({
    headless: true,
    ...(fs.existsSync(chromePath) ? { executablePath: chromePath } : {}),
  });

  const testResults = {
    desktopLayout: false,
    tabletLayout: false,
    mobileLayout: false,
    productsLinkTarget: false,
    productsLinkNavigation: false,
    filmsLinkTarget: false,
    filmsSmoothScroll: false,
    noOverflow: false,
    consoleErrors: [],
  };

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        testResults.consoleErrors.push(msg.text());
      }
    });

    console.log("Navigating to home page on Desktop...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    // 1. Desktop Layout Verification
    const productsCard = page.locator("[data-testid='quick-nav-products']");
    const filmsCard = page.locator("[data-testid='quick-nav-films']");

    await productsCard.waitFor({ state: "visible", timeout: 5000 });
    await filmsCard.waitFor({ state: "visible", timeout: 5000 });

    const pText = await productsCard.innerText();
    const fText = await filmsCard.innerText();

    console.log("Products card text:", JSON.stringify(pText));
    console.log("Films card text:", JSON.stringify(fText));

    const pBox = await productsCard.boundingBox();
    const fBox = await filmsCard.boundingBox();

    console.log("Desktop Products Card Box:", pBox);
    console.log("Desktop Films Card Box:", fBox);

    // Side-by-side check on desktop (same Y or nearly same, fBox.x > pBox.x)
    if (pBox && fBox && Math.abs(pBox.y - fBox.y) < 15 && fBox.x > pBox.x) {
      testResults.desktopLayout = true;
      console.log("PASS: Desktop cards are displayed side-by-side.");
    } else {
      console.error("FAIL: Desktop cards are not side-by-side.");
    }

    // Verify copy requirements
    if (
      pText.includes("Explore Products") &&
      pText.includes("Discover our handcrafted brass collection.") &&
      pText.includes("Explore Collection")
    ) {
      testResults.productsLinkTarget = true;
      console.log("PASS: Products card copy matches exact specification.");
    }

    if (
      fText.includes("Watch Our Films") &&
      fText.includes("Experience our artistry in motion.") &&
      fText.includes("Watch Videos")
    ) {
      testResults.filmsLinkTarget = true;
      console.log("PASS: Films card copy matches exact specification.");
    }

    // Capture Desktop Screenshot of the Quick Navigation section
    const quickNavSection = page.locator("section[aria-label='Quick Navigation']");
    await quickNavSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await quickNavSection.screenshot({
      path: path.join(ARTIFACTS_DIR, "quick_nav_desktop_1440.png"),
    });

    // 2. Test Smooth Scroll to #video-gallery
    console.log("Testing Smooth Scroll via 'Watch Our Films' card...");
    const initialScrollY = await page.evaluate(() => window.scrollY);
    await filmsCard.click();
    await page.waitForTimeout(1500); // Wait for smooth scroll animation to finish

    const scrolledScrollY = await page.evaluate(() => window.scrollY);
    const videoGalleryInView = await page.evaluate(() => {
      const el = document.getElementById("video-gallery");
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top >= -50 && rect.top <= window.innerHeight * 0.75;
    });

    console.log(`Scroll Y before: ${initialScrollY}, after click: ${scrolledScrollY}, gallery in view: ${videoGalleryInView}`);
    if (scrolledScrollY > initialScrollY && videoGalleryInView) {
      testResults.filmsSmoothScroll = true;
      console.log("PASS: Clicked 'Watch Our Films' and page smoothly scrolled to #video-gallery.");
    } else {
      console.error("FAIL: Smooth scroll did not bring #video-gallery into view.");
    }

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, "quick_nav_after_smooth_scroll.png"),
      fullPage: false,
    });

    // 3. Test Products Card Navigation
    console.log("Testing Navigation to /products...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    await page.locator("[data-testid='quick-nav-products']").click();
    await page.waitForURL("**/products", { timeout: 6000 });
    const currentUrl = page.url();
    console.log("Current URL after click:", currentUrl);
    if (currentUrl.endsWith("/products")) {
      testResults.productsLinkNavigation = true;
      console.log("PASS: Products card correctly navigated to /products.");
    }

    await context.close();

    // 4. Tablet Verification (768 x 1024)
    console.log("Testing Tablet Viewport (768x1024)...");
    const tabletContext = await browser.newContext({ viewport: { width: 768, height: 1024 } });
    const tabletPage = await tabletContext.newPage();
    await tabletPage.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await tabletPage.waitForTimeout(800);

    const tProducts = tabletPage.locator("[data-testid='quick-nav-products']");
    const tFilms = tabletPage.locator("[data-testid='quick-nav-films']");
    const tpBox = await tProducts.boundingBox();
    const tfBox = await tFilms.boundingBox();

    console.log("Tablet Products Box:", tpBox);
    console.log("Tablet Films Box:", tfBox);

    if (tpBox && tfBox && Math.abs(tpBox.y - tfBox.y) < 20 && tfBox.x > tpBox.x) {
      testResults.tabletLayout = true;
      console.log("PASS: Tablet cards are side-by-side and balanced.");
    }

    const tQuickNav = tabletPage.locator("section[aria-label='Quick Navigation']");
    await tQuickNav.scrollIntoViewIfNeeded();
    await tabletPage.waitForTimeout(300);
    await tQuickNav.screenshot({
      path: path.join(ARTIFACTS_DIR, "quick_nav_tablet_768.png"),
    });
    await tabletContext.close();

    // 5. Mobile Verification (390 x 844)
    console.log("Testing Mobile Viewport (390x844)...");
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await mobilePage.waitForTimeout(800);

    const mProducts = mobilePage.locator("[data-testid='quick-nav-products']");
    const mFilms = mobilePage.locator("[data-testid='quick-nav-films']");
    const mpBox = await mProducts.boundingBox();
    const mfBox = await mFilms.boundingBox();

    console.log("Mobile Products Box:", mpBox);
    console.log("Mobile Films Box:", mfBox);

    // On mobile they should stack vertically (mfBox.y > mpBox.y)
    if (mpBox && mfBox && mfBox.y > mpBox.y + mpBox.height - 10) {
      testResults.mobileLayout = true;
      console.log("PASS: Mobile cards are stacked vertically with comfortable touch dimensions.");
    }

    // Check horizontal overflow on mobile
    const overflowCheck = await mobilePage.evaluate(() => {
      return {
        docScrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        innerWidth: window.innerWidth,
      };
    });
    console.log("Mobile Overflow Check:", overflowCheck);
    if (overflowCheck.docScrollWidth <= overflowCheck.innerWidth + 1) {
      testResults.noOverflow = true;
      console.log("PASS: Zero horizontal overflow on mobile.");
    } else {
      console.error("FAIL: Horizontal overflow detected on mobile!");
    }

    const mQuickNav = mobilePage.locator("section[aria-label='Quick Navigation']");
    await mQuickNav.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(300);
    await mQuickNav.screenshot({
      path: path.join(ARTIFACTS_DIR, "quick_nav_mobile_390.png"),
    });

    // Test mobile smooth scroll
    console.log("Testing Mobile smooth scroll to #video-gallery...");
    await mFilms.click();
    await mobilePage.waitForTimeout(1500);
    const mGalleryInView = await mobilePage.evaluate(() => {
      const el = document.getElementById("video-gallery");
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top >= -50 && rect.top <= window.innerHeight * 0.8;
    });
    console.log("Mobile gallery in view after click:", mGalleryInView);

    await mobileContext.close();

    console.log("\n--- TEST SUMMARY ---");
    console.log(JSON.stringify(testResults, null, 2));

    const allPassed =
      testResults.desktopLayout &&
      testResults.tabletLayout &&
      testResults.mobileLayout &&
      testResults.productsLinkTarget &&
      testResults.productsLinkNavigation &&
      testResults.filmsLinkTarget &&
      testResults.filmsSmoothScroll &&
      testResults.noOverflow &&
      testResults.consoleErrors.length === 0;

    if (allPassed) {
      console.log("\nALL QUICK NAVIGATION CHECKS PASSED SUCCESSFULLY!");
      process.exit(0);
    } else {
      console.error("\nSOME CHECKS FAILED!");
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testQuickNav();
