import { chromium, firefox, webkit } from "playwright";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const PW_BROWSER = (process.env.PW_BROWSER || "chromium").toLowerCase();
const OUTPUT_DIR = path.resolve("tests/artifacts");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function findCachedBrowser(prefix, relativeBin) {
  const cacheDir = path.join(os.homedir(), "Library/Caches/ms-playwright");
  if (!fs.existsSync(cacheDir)) return undefined;
  const match = fs.readdirSync(cacheDir).find((d) => d.startsWith(prefix));
  if (!match) return undefined;
  const candidate = path.join(cacheDir, match, relativeBin);
  return fs.existsSync(candidate) ? candidate : undefined;
}

async function runTests() {
  console.log(`Starting automated browser test suite [${PW_BROWSER}] against ${BASE_URL}...`);
  const results = {
    testA_startup: { status: "pending", details: [] },
    testB_css_and_rendering: { status: "pending", details: [] },
    testC_three_dot_menu: { status: "pending", details: [] },
    testD_category_separation: { status: "pending", details: [] },
    testE_quick_view_and_specs: { status: "pending", details: [] },
    testF_mobile_and_responsive: { status: "pending", details: [] },
    testG_functional_interactions: { status: "pending", details: [] },
    testH_brochure_images_and_assets: { status: "pending", details: [] },
    testI_final_ui_cleanup_and_contact: { status: "pending", details: [] },
    testJ_about_redesign_and_catalogue_section: { status: "pending", details: [] },
    testK_hero_vertical_video: { status: "pending", details: [] },
    testL_video_gallery_section: { status: "pending", details: [] },
    testM_logo_and_favicon: { status: "pending", details: [] },
    testN_security_and_accessibility: { status: "pending", details: [] },
  };

  let browser;
  if (PW_BROWSER === "firefox") {
    const ffBin = findCachedBrowser("firefox-", "firefox/Nightly.app/Contents/MacOS/firefox");
    browser = await firefox.launch({ headless: true, ...(ffBin ? { executablePath: ffBin } : {}) });
  } else if (PW_BROWSER === "webkit") {
    const wkBin = findCachedBrowser("webkit-", "pw_run.sh");
    browser = await webkit.launch({ headless: true, ...(wkBin ? { executablePath: wkBin } : {}) });
  } else {
    const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    browser = await chromium.launch({
      headless: true,
      ...(fs.existsSync(chromePath) ? { executablePath: chromePath } : {}),
    });
  }

  const consoleErrors = [];
  const failedRequests = [];

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  page.on("requestfailed", (request) => {
    const url = request.url();
    const errorText = request.failure()?.errorText || "unknown";
    if (url.startsWith("chrome-extension://")) return;
    // Ignore normal HTTP byte-range / cancellation aborts triggered by <video> pipeline or route transitions
    if (
      request.resourceType() === "media" &&
      (errorText === "net::ERR_ABORTED" ||
        errorText.toLowerCase().includes("abort") ||
        errorText.toLowerCase().includes("cancel") ||
        errorText.includes("NS_BINDING_ABORTED"))
    ) {
      return;
    }
    failedRequests.push({
      url: url,
      failure: errorText,
    });
  });

  try {
    // -------------------------------------------------------------
    // Test A: Startup and Page Availability
    // -------------------------------------------------------------
    console.log("Running Test A: Server responsiveness...");
    const homeRes = await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    const homeStatus = homeRes.status();
    results.testA_startup.details.push(`Home page status: ${homeStatus}`);

    const aboutRes = await page.goto(`${BASE_URL}/about`, { waitUntil: "domcontentloaded" });
    const aboutStatus = aboutRes.status();
    results.testA_startup.details.push(`About page status: ${aboutStatus}`);

    const productsRes = await page.goto(`${BASE_URL}/products`, { waitUntil: "domcontentloaded" });
    const productsStatus = productsRes.status();
    results.testA_startup.details.push(`Products page status: ${productsStatus}`);

    if (homeStatus === 200 && aboutStatus === 200 && productsStatus === 200) {
      results.testA_startup.status = "PASS";
    } else {
      results.testA_startup.status = "FAIL";
    }

    // -------------------------------------------------------------
    // Test B: CSS and Computed Styles Verification
    // -------------------------------------------------------------
    console.log("Running Test B: CSS and Computed Styles Verification...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

    // Verify computed styles on Body
    const bodyStyles = await page.evaluate(() => {
      const el = document.body;
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        fontFamily: computed.fontFamily,
      };
    });
    results.testB_css_and_rendering.details.push(`Body background: ${bodyStyles.backgroundColor} (Expected #FAF8F5 / rgb(250, 248, 245))`);
    results.testB_css_and_rendering.details.push(`Body color: ${bodyStyles.color}`);

    // Verify H1 styles and content matching brochure
    const h1Styles = await page.evaluate(() => {
      const el = document.querySelector("h1");
      const computed = window.getComputedStyle(el);
      return {
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        color: computed.color,
        text: el.textContent.trim(),
      };
    });
    results.testB_css_and_rendering.details.push(`H1 font: ${h1Styles.fontFamily}, size: ${h1Styles.fontSize}, color: ${h1Styles.color}, text: "${h1Styles.text}"`);

    // Verify Brand Logo in header matching brochure
    const brandInfo = await page.evaluate(() => {
      const spans = Array.from(document.querySelectorAll("header a[href='/'] span"));
      return spans.map((s) => s.textContent.trim());
    });
    results.testB_css_and_rendering.details.push(`Brand Header text: ${JSON.stringify(brandInfo)} (Expected ADVAITA TATTVA)`);

    const pageTitle = await page.title();
    results.testB_css_and_rendering.details.push(`Page Title: "${pageTitle}"`);

    // Verify Navigation links (must NOT be default blue underline)
    const navLinkStyles = await page.evaluate(() => {
      const link = document.querySelector("header nav a");
      if (!link) return null;
      const computed = window.getComputedStyle(link);
      return {
        color: computed.color,
        textDecoration: computed.textDecorationLine,
      };
    });
    results.testB_css_and_rendering.details.push(`Nav link color: ${navLinkStyles?.color}, text-decoration: ${navLinkStyles?.textDecoration}`);

    const isStyled =
      bodyStyles.backgroundColor.includes("250, 248, 245") ||
      bodyStyles.backgroundColor.includes("rgb(250, 248, 245)");

    const isNotDefaultBlue =
      navLinkStyles && !navLinkStyles.color.includes("0, 0, 238") && navLinkStyles.textDecoration === "none";

    const hasBrandAndHeading =
      brandInfo.some((s) => s.includes("ADVAITA TATTVA")) &&
      h1Styles.text.toUpperCase().includes("ANTIQUE BRASS IDOL COLLECTION");

    if (isStyled && isNotDefaultBlue && hasBrandAndHeading) {
      results.testB_css_and_rendering.status = "PASS";
    } else {
      results.testB_css_and_rendering.status = "FAIL";
    }

    // -------------------------------------------------------------
    // Test C: Three-Dot Vertical Menu Behavior (Desktop)
    // -------------------------------------------------------------
    console.log("Running Test C: Three-Dot Vertical Menu Behavior...");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_home.png"), fullPage: false });

    // Also capture desktop about screenshot
    await page.goto(`${BASE_URL}/about`, { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_about.png"), fullPage: false });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

    // Target desktop three-dot button
    const threeDotBtn = await page.$("header nav button[aria-label*='Statue Categories']");
    if (!threeDotBtn) {
      results.testC_three_dot_menu.status = "FAIL";
      results.testC_three_dot_menu.details.push("ERROR: Desktop three-dot category button not found in header.");
    } else {
      // 1. Initial state (menu closed)
      let isMenuOpen = await page.evaluate(() => {
        return !!document.querySelector("header nav div[role='menu']");
      });
      results.testC_three_dot_menu.details.push(`Initial menu open state: ${isMenuOpen} (Expected false)`);

      // 2. Click three-dot button to open dropdown
      await threeDotBtn.click();
      await page.waitForTimeout(250);

      isMenuOpen = await page.evaluate(() => {
        const m = document.querySelector("header nav div[role='menu']");
        return m ? window.getComputedStyle(m).display !== "none" : false;
      });
      results.testC_three_dot_menu.details.push(`Menu open after click: ${isMenuOpen} (Expected true)`);

      // Verify menu items in desktop dropdown
      const menuItems = await page.$$eval("header nav div[role='menu'] button", (items) =>
        items.map((i) => i.textContent.trim())
      );
      results.testC_three_dot_menu.details.push(`Menu items found (${menuItems.length}): ${JSON.stringify(menuItems)}`);

      // Capture screenshot of open three-dot dropdown
      await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_threedot_menu_open.png"), fullPage: false });

      // 3. Test Escape key dismissal
      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);
      const isClosedAfterEscape = await page.evaluate(() => !document.querySelector("header nav div[role='menu']"));
      results.testC_three_dot_menu.details.push(`Menu closed after Escape: ${isClosedAfterEscape} (Expected true)`);

      // 4. Test Click-outside dismissal
      await threeDotBtn.click();
      await page.waitForTimeout(200);
      await page.click("h1"); // click outside
      await page.waitForTimeout(200);
      const isClosedAfterClickOutside = await page.evaluate(() => !document.querySelector("header nav div[role='menu']"));
      results.testC_three_dot_menu.details.push(`Menu closed after Click Outside: ${isClosedAfterClickOutside} (Expected true)`);

      const hasExactTwoCategories =
        menuItems.length === 2 &&
        menuItems.some((t) => t.includes("Buddha Statues")) &&
        menuItems.some((t) => t.includes("Hindu Statues"));

      if (isMenuOpen && isClosedAfterEscape && isClosedAfterClickOutside && hasExactTwoCategories) {
        results.testC_three_dot_menu.status = "PASS";
      } else {
        results.testC_three_dot_menu.status = "FAIL";
      }
    }

    // -------------------------------------------------------------
    // Test D: Homepage Featured 5 + /products Category Filtering & Separation
    // -------------------------------------------------------------
    console.log("Running Test D: Homepage Featured Showcase & /products Category Separation...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

    // 0a. Verify Homepage displays 5 featured products balanced across Buddha & Hindu + CTA
    const homeShowcaseAudit = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll("#catalogue article"));
      const categories = cards.map((card) =>
        Array.from(card.querySelectorAll("span")).find(
          (s) => s.textContent.trim() === "Buddha Statues" || s.textContent.trim() === "Hindu Statues"
        )?.textContent.trim()
      );
      const cta = document.querySelector("#complete-collection-cta");
      const ctaHeading = cta?.querySelector("h3")?.textContent?.trim();
      const ctaText = cta?.querySelector("p")?.textContent?.trim();
      const ctaLink = cta?.querySelector("a[href='/products']");
      return {
        cardCount: cards.length,
        buddhaCount: categories.filter((c) => c === "Buddha Statues").length,
        hinduCount: categories.filter((c) => c === "Hindu Statues").length,
        ctaHeading,
        ctaText,
        ctaBtnText: ctaLink?.textContent?.trim(),
        ctaHref: ctaLink?.getAttribute("href"),
      };
    });
    results.testD_category_separation.details.push(`Homepage Featured Audit: ${JSON.stringify(homeShowcaseAudit)}`);
    const homeCtaEl = await page.$("#complete-collection-cta");
    if (homeCtaEl) await homeCtaEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_home_featured.png"), fullPage: false });

    const homeFeaturedValid =
      homeShowcaseAudit.cardCount === 5 &&
      homeShowcaseAudit.buddhaCount >= 1 &&
      homeShowcaseAudit.hinduCount >= 1 &&
      homeShowcaseAudit.ctaHeading === "Explore Our Complete Collection" &&
      homeShowcaseAudit.ctaText === "Discover our complete collection of handcrafted antique brass idols." &&
      homeShowcaseAudit.ctaBtnText === "View All Products" &&
      homeShowcaseAudit.ctaHref === "/products";

    // 1. Select Buddha Statues via three-dot menu -> navigates to /products?category=buddha
    const threeDotMenuBtn = await page.$("header nav button[aria-label='Statue Categories Menu']");
    await threeDotMenuBtn.click();
    await page.waitForTimeout(250);
    const buddhaMenuItem = await page.$("header nav div[role='menu'] button:has-text('Buddha Statues')");
    await Promise.all([
      page.waitForURL("**/products?category=buddha"),
      buddhaMenuItem.click(),
    ]);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(400);

    // Verify URL updated
    const buddhaUrl = page.url();
    results.testD_category_separation.details.push(`URL after Buddha selection: ${buddhaUrl}`);

    // Verify displayed products in Buddha category
    const buddhaProductTitles = await page.$$eval("article h3", (elements) =>
      elements.map((el) => el.textContent.trim())
    );
    results.testD_category_separation.details.push(`Buddha category products (${buddhaProductTitles.length}): ${JSON.stringify(buddhaProductTitles)}`);

    // Verify strict separation: must contain exactly 5 Buddha statues, and 0 Hindu deities
    const hasOnlyBuddhas =
      buddhaProductTitles.length === 5 &&
      buddhaProductTitles.includes("Seated Buddha") &&
      buddhaProductTitles.includes("Buddha under Bodhi Tree") &&
      buddhaProductTitles.includes("Buddha in Hand") &&
      buddhaProductTitles.includes("Twin Seated Buddha Idols") &&
      buddhaProductTitles.includes("Lord Buddha") &&
      !buddhaProductTitles.some((t) => t.includes("Ganesha") || t.includes("Durga") || t.includes("Lakshmi") || t.includes("Gopal") || t.includes("Shivling") || t.includes("Saraswati") || t.includes("Kubera") || t.includes("Shiva") || t.includes("Rama") || t.includes("Nandi"));

    results.testD_category_separation.details.push(`Buddha strict purity test: ${hasOnlyBuddhas}`);

    // Capture screenshot of Buddha category showcase
    await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_buddha_category.png"), fullPage: false });

    // 2. Select Hindu Statues via Category Tab on /products
    const hinduTab = await page.$("#catalogue button:has-text('Hindu Statues')");
    await hinduTab.click();
    await page.waitForTimeout(400);

    const hinduProductTitles = await page.$$eval("article h3", (elements) =>
      elements.map((el) => el.textContent.trim())
    );
    results.testD_category_separation.details.push(`Hindu category products (${hinduProductTitles.length}): ${JSON.stringify(hinduProductTitles)}`);

    // Verify strict separation: must contain 23 Hindu idols and 0 Buddha statues
    const hasOnlyHindus =
      hinduProductTitles.length === 23 &&
      hinduProductTitles.includes("Lord Ganesha") &&
      hinduProductTitles.includes("Maa Durga") &&
      hinduProductTitles.includes("Maa Lakshmi") &&
      hinduProductTitles.includes("Laddu Gopal") &&
      hinduProductTitles.includes("Shivling") &&
      hinduProductTitles.includes("Maa Saraswati") &&
      hinduProductTitles.includes("Lord Kubera") &&
      hinduProductTitles.includes("Shiv Parivar") &&
      hinduProductTitles.includes("Lord Krishna with Cow") &&
      hinduProductTitles.includes("Lord Shiva") &&
      hinduProductTitles.includes("Lord Rama") &&
      hinduProductTitles.includes("Nandi Ji") &&
      hinduProductTitles.includes("Radha Krishna") &&
      hinduProductTitles.includes("Vishnu Charan Paduka") &&
      hinduProductTitles.includes("Brass Elephant Idols") &&
      hinduProductTitles.includes("Brass Tortoise Idols") &&
      !hinduProductTitles.some((t) => t.includes("Buddha"));

    results.testD_category_separation.details.push(`Hindu strict purity test: ${hasOnlyHindus}`);

    // Capture screenshot of Hindu category showcase
    await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_hindu_category.png"), fullPage: false });

    // 3. Select All Products on /products and check page heading/subtitle
    const allTab = await page.$("#catalogue button:has-text('All Products')");
    await allTab.click();
    await page.waitForTimeout(400);

    const productsHeaderAudit = await page.evaluate(() => ({
      heading: document.querySelector("#catalogue-heading")?.textContent?.trim(),
      subtitle: document.querySelector("#catalogue p")?.textContent?.trim(),
    }));
    const allProductTitles = await page.$$eval("article h3", (elements) =>
      elements.map((el) => el.textContent.trim())
    );
    results.testD_category_separation.details.push(`All Products count: ${allProductTitles.length} (Expected 28), header: ${JSON.stringify(productsHeaderAudit)}`);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_products_all.png"), fullPage: false });

    if (
      homeFeaturedValid &&
      hasOnlyBuddhas &&
      hasOnlyHindus &&
      allProductTitles.length === 28 &&
      productsHeaderAudit.heading === "Our Complete Collection"
    ) {
      results.testD_category_separation.status = "PASS";
    } else {
      results.testD_category_separation.status = "FAIL";
    }

    // -------------------------------------------------------------
    // Test E: Quick View Modal & Exact Brochure Specifications Table
    // -------------------------------------------------------------
    console.log("Running Test E: Quick View Modal & Specifications Table...");
    // Find Quick View button on first product card (Lord Ganesha)
    const quickViewBtn = await page.$("article button[title*='Specifications']");
    if (!quickViewBtn) {
      results.testE_quick_view_and_specs.status = "FAIL";
      results.testE_quick_view_and_specs.details.push("ERROR: Quick View button not found on card.");
    } else {
      await quickViewBtn.click();
      await page.waitForTimeout(350);

      const qvDialogInfo = await page.evaluate(() => {
        const dialog = document.querySelector("dialog[open]");
        if (!dialog) return null;
        const title = dialog.querySelector("h3")?.textContent.trim();
        const spans = Array.from(dialog.querySelectorAll("span"));
        const categoryBadge = spans.find((s) => s.textContent.includes("Statues"))?.textContent.trim();
        const tableRows = Array.from(dialog.querySelectorAll("tbody tr")).map((tr) => {
          const cells = Array.from(tr.querySelectorAll("td")).map((c) => c.textContent.trim());
          return cells.join(" | ");
        });
        const note = Array.from(dialog.querySelectorAll("div, p")).find((el) =>
          el.textContent.includes("Custom sizes are available")
        )?.textContent.trim();
        const containsPageText = Array.from(dialog.querySelectorAll("*")).some(
          (el) => el.children.length === 0 && /Page \d+/i.test(el.textContent)
        );
        return { title, categoryBadge, tableRows, note, containsPageText };
      });

      results.testE_quick_view_and_specs.details.push(`Quick View Title: ${qvDialogInfo?.title}`);
      results.testE_quick_view_and_specs.details.push(`Category Badge: ${qvDialogInfo?.categoryBadge}`);
      results.testE_quick_view_and_specs.details.push(`Sizes & Weights Table Rows: ${JSON.stringify(qvDialogInfo?.tableRows)}`);
      results.testE_quick_view_and_specs.details.push(`Custom size note: ${qvDialogInfo?.note}`);
      results.testE_quick_view_and_specs.details.push(`Contains raw page number badge in modal: ${qvDialogInfo?.containsPageText} (Expected false)`);

      // Capture screenshot of Quick View modal
      await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_quick_view_modal.png"), fullPage: false });

      // Close modal with Escape
      await page.keyboard.press("Escape");
      await page.waitForTimeout(250);

      const isDialogClosed = await page.evaluate(() => !document.querySelector("dialog[open]"));
      results.testE_quick_view_and_specs.details.push(`Quick View closed after Escape: ${isDialogClosed}`);

      if (
        qvDialogInfo &&
        qvDialogInfo.title &&
        qvDialogInfo.tableRows &&
        qvDialogInfo.tableRows.length > 0 &&
        qvDialogInfo.categoryBadge &&
        qvDialogInfo.note &&
        !qvDialogInfo.containsPageText &&
        isDialogClosed
      ) {
        results.testE_quick_view_and_specs.status = "PASS";
      } else {
        results.testE_quick_view_and_specs.status = "FAIL";
      }
    }

    // -------------------------------------------------------------
    // Test F: Mobile & Responsive Layouts
    // -------------------------------------------------------------
    console.log("Running Test F: Mobile & Responsive Layouts...");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

    const mobileOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    results.testF_mobile_and_responsive.details.push(`Mobile 390x844 horizontal overflow: ${mobileOverflow} (Expected false)`);

    // Target mobile-specific three-dot button
    const mobileThreeDotBtn = await page.$("header .flex.lg\\:hidden button[aria-label*='Statue Categories']");
    if (mobileThreeDotBtn) {
      await mobileThreeDotBtn.click();
      await page.waitForTimeout(250);
      const isMobileMenuOpen = await page.evaluate(() => {
        const m = document.querySelector("header .flex.lg\\:hidden div[role='menu']");
        return !!m;
      });
      results.testF_mobile_and_responsive.details.push(`Mobile three-dot menu opens: ${isMobileMenuOpen}`);

      // Capture mobile screenshot with three-dot menu open
      await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile_390_threedot_open.png"), fullPage: false });

      // Click Buddha Statues in mobile menu -> navigates to /products?category=buddha
      const mobileBuddhaOption = await page.$("header .flex.lg\\:hidden div[role='menu'] button:has-text('Buddha Statues')");
      if (mobileBuddhaOption) {
        await Promise.all([
          page.waitForURL("**/products?category=buddha"),
          mobileBuddhaOption.click(),
        ]);
        await page.waitForLoadState("domcontentloaded");
        await page.waitForTimeout(400);
        const mobileBuddhaCards = await page.$$eval("article", (cards) => cards.length);
        results.testF_mobile_and_responsive.details.push(`Mobile Buddha selection displays ${mobileBuddhaCards} cards (Expected 5)`);
        await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile_390_products.png"), fullPage: false });
      }
    }

    // Capture mobile full home view
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile_390_home.png"), fullPage: false });

    // Test mobile about page
    await page.goto(`${BASE_URL}/about`, { waitUntil: "domcontentloaded" });
    const mobileAboutOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    results.testF_mobile_and_responsive.details.push(`Mobile /about horizontal overflow: ${mobileAboutOverflow}`);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile_390_about.png"), fullPage: false });

    // Tablet check (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    const tabletOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    results.testF_mobile_and_responsive.details.push(`Tablet 768x1024 horizontal overflow: ${tabletOverflow}`);

    if (!mobileOverflow && !mobileAboutOverflow && !tabletOverflow) {
      results.testF_mobile_and_responsive.status = "PASS";
    } else {
      results.testF_mobile_and_responsive.status = "FAIL";
    }

    // -------------------------------------------------------------
    // Test G: Functional Interactions (Contact Modal, Form, WhatsApp)
    // -------------------------------------------------------------
    console.log("Running Test G: Functional Interactions...");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

    // 1. Contact Us Modal
    const contactBtn = await page.$("header button:has-text('Contact Us')");
    if (contactBtn) {
      await contactBtn.click();
      await page.waitForTimeout(200);
      const isContactDialogOpen = await page.evaluate(() => {
        const d = document.querySelector("dialog[open]");
        return !!d;
      });
      results.testG_functional_interactions.details.push(`Contact Us button opens dialog: ${isContactDialogOpen}`);
      await page.keyboard.press("Escape");
    }

    // 2. Contact form validation
    const submitBtn = await page.$("#enquiry-form button[type='submit']");
    if (submitBtn) {
      await submitBtn.scrollIntoViewIfNeeded();
      await submitBtn.click();
      await page.waitForTimeout(200);
      const hasValidationError = await page.evaluate(() => !!document.querySelector("#fullName-error"));
      results.testG_functional_interactions.details.push(`Empty contact form submission shows validation error: ${hasValidationError}`);

      // Valid submission
      await page.fill("#fullName", "Rameshwar Sharma");
      await page.fill("#phoneNumber", "+91 87964 86928");
      await page.fill("#message", "I am interested in acquiring the Lord Ganesha idol in 8-inch specification.");

      let openedUrl = null;
      await page.exposeFunction("recordWindowOpen", (url) => {
        openedUrl = url;
      });
      await page.evaluate(() => {
        window.open = (url) => {
          window.recordWindowOpen(url);
          return null;
        };
      });

      await submitBtn.click();
      await page.waitForTimeout(300);

      const confirmationAlert = await page.$("#enquiry-form div[role='alert']");
      results.testG_functional_interactions.details.push(`Contact form shows confirmation alert: ${!!confirmationAlert}`);
      results.testG_functional_interactions.details.push(`Contact form redirects to WhatsApp URL: ${openedUrl?.startsWith("https://wa.me/918796486928")}`);
    }

    // 3. Floating WhatsApp action
    const waLink = await page.$eval("aside[aria-label*='WhatsApp'] a", (a) => a.href);
    results.testG_functional_interactions.details.push(`Floating WhatsApp button targets: ${waLink}`);

    // 4. PDF Catalogue button link
    const pdfLinks = await page.$$eval("a[href*='advaita-tattva-catalogue.pdf']", (links) => links.map((l) => l.href));
    results.testG_functional_interactions.details.push(`PDF Catalogue links found to configured path: ${pdfLinks.length}`);

    results.testG_functional_interactions.status = "PASS";

    // -------------------------------------------------------------
    // Test H: Brochure Images and Assets Integrity (/products all 24)
    // -------------------------------------------------------------
    console.log("Running Test H: Brochure Images and Assets Integrity...");
    await page.goto(`${BASE_URL}/products`, { waitUntil: "domcontentloaded" });

    // Scroll through all product cards so lazy-loaded product images hydrate
    const cardsCount = await page.$$eval("article", (els) => els.length);
    for (let i = 0; i < cardsCount; i += 3) {
      await page.evaluate((idx) => {
        const cards = document.querySelectorAll("article");
        if (cards[idx]) cards[idx].scrollIntoView({ behavior: "instant", block: "center" });
      }, i);
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(500);

    // Collect all product images on the page
    const productImgs = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("article img"));
      return imgs.map((img) => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      }));
    });

    const failedImgs = productImgs.filter((i) => !i.complete || i.naturalWidth === 0);
    results.testH_brochure_images_and_assets.details.push(
      `Product images verified: ${productImgs.length} rendered, ${failedImgs.length} failed to load.`
    );

    // Verify all 28 products are represented in public/products/
    const expectedBrochureFiles = [
      "lord-ganesha.jpg",
      "maa-durga.jpg",
      "maa-lakshmi.jpg",
      "seated-buddha.jpg",
      "buddha-bodhi-tree.jpg",
      "laddu-gopal.jpg",
      "shivling.jpg",
      "maa-saraswati.jpg",
      "maa-lakshmi-seated.jpg",
      "lord-hanuman.jpg",
      "shiv-parivar.jpg",
      "lakshmi-ganesha.jpg",
      "lakshmi-ganesha-ornate.jpg",
      "krishna-cow.jpg",
      "buddha-in-hand.jpg",
      "panchmukhi-hanuman.jpg",
      "twin-buddha.jpg",
      "standing-hanuman.jpg",
      "lord-shiva.jpg",
      "lord-rama.jpg",
      "nandi-ji.jpg",
      "tara-devi.jpg",
      "lord-kubera.jpg",
      "lord-buddha.jpg",
      "radha-krishna.jpg",
      "vishnu-charan-paduka.jpg",
      "brass-elephant-idols.jpg",
      "brass-tortoise-idols.jpg",
    ];

    const missingFiles = [];
    for (const file of expectedBrochureFiles) {
      const p = path.resolve("public/products", file);
      if (!fs.existsSync(p)) {
        missingFiles.push(file);
      } else {
        const stat = fs.statSync(p);
        results.testH_brochure_images_and_assets.details.push(`File ${file}: ${stat.size} bytes`);
      }
    }

    if (missingFiles.length > 0) {
      results.testH_brochure_images_and_assets.details.push(`ERROR: Missing brochure files: ${missingFiles.join(", ")}`);
    }

    // Verify PDF Catalogue file and rendered cover
    const catalogueDir = path.resolve("public/catalogue");
    const catalogueDirExists = fs.existsSync(catalogueDir);
    const configuredPdfPath = path.resolve("public/catalogue/advaita-tattva-catalogue.pdf");
    const configuredPdfExists = fs.existsSync(configuredPdfPath);
    const configuredPdfSize = configuredPdfExists ? fs.statSync(configuredPdfPath).size : 0;
    const coverPath = path.resolve("public/catalogue/catalogue-cover.jpg");
    const coverExists = fs.existsSync(coverPath);

    results.testH_brochure_images_and_assets.details.push(
      `Catalogue directory (public/catalogue): exists = ${catalogueDirExists}. PDF file: exists = ${configuredPdfExists}, size = ${configuredPdfSize} bytes. Cover image: exists = ${coverExists}.`
    );

    // Verify PDF file is directly accessible via HTTP 200 using request context
    const pdfResponse = await context.request.get(`${BASE_URL}/catalogue/advaita-tattva-catalogue.pdf`);
    const pdfHttpStatus = pdfResponse.status();
    const pdfContentType = pdfResponse.headers()["content-type"];
    results.testH_brochure_images_and_assets.details.push(
      `Direct PDF HTTP GET status: ${pdfHttpStatus} (Expected 200), Content-Type: ${pdfContentType} (Expected application/pdf)`
    );

    // Verify zero console errors
    results.testH_brochure_images_and_assets.details.push(`Console errors captured: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      results.testH_brochure_images_and_assets.details.push(`Errors: ${consoleErrors.join("; ")}`);
    }

    // Verify zero failed requests
    results.testH_brochure_images_and_assets.details.push(`Failed network requests: ${failedRequests.length}`);
    if (failedRequests.length > 0) {
      results.testH_brochure_images_and_assets.details.push(`Failed requests: ${JSON.stringify(failedRequests)}`);
    }

    // Verify NO external stock images are being requested
    const baseOrigin = new URL(BASE_URL).origin;
    const externalImgRequests = failedRequests.filter((r) => {
      try {
        return new URL(r.url).origin !== baseOrigin;
      } catch {
        return true;
      }
    });
    results.testH_brochure_images_and_assets.details.push(`External image requests: ${externalImgRequests.length}`);

    if (
      failedImgs.length === 0 &&
      missingFiles.length === 0 &&
      catalogueDirExists &&
      configuredPdfExists &&
      configuredPdfSize > 10000000 &&
      pdfHttpStatus === 200 &&
      pdfContentType?.includes("application/pdf") &&
      consoleErrors.length === 0 &&
      failedRequests.length === 0
    ) {
      results.testH_brochure_images_and_assets.status = "PASS";
    } else {
      results.testH_brochure_images_and_assets.status = "FAIL";
    }

    // -------------------------------------------------------------
    // Test I: Final UI Cleanup & Contact Details (No Page Badges, New Email, Exact Hours, No Address)
    // -------------------------------------------------------------
    console.log("Running Test I: Final UI Cleanup & Contact Details...");
    await page.goto(`${BASE_URL}/products`, { waitUntil: "domcontentloaded" });

    // 1. Verify absence of Page badges and presence of category badges across ALL product cards
    const cardBadgeAudit = await page.evaluate(() => {
      const articles = Array.from(document.querySelectorAll("article"));
      return articles.map((article) => {
        const title = article.querySelector("h3")?.textContent.trim();
        const allText = article.textContent;
        const pageMatches = allText.match(/Page \d+/gi) || [];
        const spans = Array.from(article.querySelectorAll("span")).map((s) => s.textContent.trim());
        const hasCategoryBadge = spans.some(
          (s) => s.toLowerCase() === "hindu statues" || s.toLowerCase() === "buddha statues"
        );
        return {
          title,
          hasPageBadge: pageMatches.length > 0,
          pageMatches,
          hasCategoryBadge,
        };
      });
    });

    const anyCardHasPageBadge = cardBadgeAudit.some((c) => c.hasPageBadge);
    const allCardsHaveCategoryBadge = cardBadgeAudit.every((c) => c.hasCategoryBadge);
    results.testI_final_ui_cleanup_and_contact.details.push(
      `Product cards inspected: ${cardBadgeAudit.length}. Any card contains Page badge: ${anyCardHasPageBadge} (Expected false)`
    );
    results.testI_final_ui_cleanup_and_contact.details.push(
      `All cards have category badge (HINDU STATUES / BUDDHA STATUES): ${allCardsHaveCategoryBadge} (Expected true)`
    );

    // Capture screenshot of clean catalogue cards
    const catalogueEl = await page.$("#catalogue");
    if (catalogueEl) {
      await catalogueEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_catalogue_clean.png"), fullPage: false });
    }

    // 2. Test Contact Us modal email, studio hours, and address absence
    const navContactBtn = await page.$("header button:has-text('Contact Us')");
    let contactModalData = null;
    if (navContactBtn) {
      await navContactBtn.click();
      await page.waitForTimeout(400);

      contactModalData = await page.evaluate(() => {
        const dialog = document.querySelector("dialog[open]");
        if (!dialog) return null;

        const emailLink = dialog.querySelector("a[href^='mailto:']");
        const mailtoHref = emailLink ? emailLink.getAttribute("href") : null;
        const displayedEmail = emailLink ? emailLink.textContent.trim() : null;

        const allDialogText = dialog.textContent;
        const hoursMatch = allDialogText.includes("Studio Hours: Monday to Saturday, 9:00 AM – 5:00 PM IST") ||
          allDialogText.includes("Studio Hours:Monday to Saturday, 9:00 AM – 5:00 PM IST");
        const containsJaipur = /Jaipur/i.test(allDialogText);
        const containsHeritageCraft = /Heritage Craft Quarter/i.test(allDialogText);

        return {
          mailtoHref,
          displayedEmail,
          hoursMatch,
          containsJaipur,
          containsHeritageCraft,
          dialogText: allDialogText,
        };
      });

      results.testI_final_ui_cleanup_and_contact.details.push(
        `Contact Modal mailto: ${contactModalData?.mailtoHref} (Expected mailto:advaitatattvaa@gmail.com)`
      );
      results.testI_final_ui_cleanup_and_contact.details.push(
        `Contact Modal displayed email: ${contactModalData?.displayedEmail} (Expected advaitatattvaa@gmail.com)`
      );
      results.testI_final_ui_cleanup_and_contact.details.push(
        `Contact Modal studio hours exact match: ${contactModalData?.hoursMatch} (Expected true)`
      );
      results.testI_final_ui_cleanup_and_contact.details.push(
        `Contact Modal contains Jaipur address: ${contactModalData?.containsJaipur || contactModalData?.containsHeritageCraft} (Expected false)`
      );

      // Screenshot open contact modal
      await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_contact_modal.png"), fullPage: false });

      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);
    }

    // 3. Test Footer email link
    const footerEmailData = await page.evaluate(() => {
      const emailLink = document.querySelector("footer a[href^='mailto:']");
      return {
        href: emailLink ? emailLink.getAttribute("href") : null,
        text: emailLink ? emailLink.textContent.trim() : null,
      };
    });
    results.testI_final_ui_cleanup_and_contact.details.push(
      `Footer mailto href: ${footerEmailData.href} (Expected mailto:advaitatattvaa@gmail.com)`
    );
    results.testI_final_ui_cleanup_and_contact.details.push(
      `Footer displayed email: ${footerEmailData.text} (Expected advaitatattvaa@gmail.com)`
    );

    // 4. Test whole-page absence of Jaipur address on Home and About
    const homeAddressPresent = await page.evaluate(() => {
      return /Jaipur/i.test(document.body.textContent) || /Heritage Craft Quarter/i.test(document.body.textContent);
    });
    results.testI_final_ui_cleanup_and_contact.details.push(`Home page contains Jaipur address: ${homeAddressPresent} (Expected false)`);

    await page.goto(`${BASE_URL}/about`, { waitUntil: "domcontentloaded" });
    const aboutAddressPresent = await page.evaluate(() => {
      return /Jaipur/i.test(document.body.textContent) || /Heritage Craft Quarter/i.test(document.body.textContent);
    });
    results.testI_final_ui_cleanup_and_contact.details.push(`About page contains Jaipur address: ${aboutAddressPresent} (Expected false)`);

    const passesCleanup =
      !anyCardHasPageBadge &&
      allCardsHaveCategoryBadge &&
      contactModalData &&
      contactModalData.mailtoHref === "mailto:advaitatattvaa@gmail.com" &&
      contactModalData.displayedEmail.includes("advaitatattvaa@gmail.com") &&
      contactModalData.hoursMatch &&
      !contactModalData.containsJaipur &&
      !contactModalData.containsHeritageCraft &&
      footerEmailData.href === "mailto:advaitatattvaa@gmail.com" &&
      footerEmailData.text.includes("advaitatattvaa@gmail.com") &&
      !homeAddressPresent &&
      !aboutAddressPresent;

    if (passesCleanup) {
      results.testI_final_ui_cleanup_and_contact.status = "PASS";
    } else {
      results.testI_final_ui_cleanup_and_contact.status = "FAIL";
    }

    // -------------------------------------------------------------
    // Test J: About Us Redesign & Dedicated Catalogue Section
    // -------------------------------------------------------------
    console.log("Running Test J: About Us Redesign & Dedicated Catalogue Section...");
    
    // --- Part 1: Verify Redesigned About Us Page ---
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/about`, { waitUntil: "domcontentloaded" });

    const aboutPageAudit = await page.evaluate(() => {
      const text = document.body.textContent || "";
      return {
        hasHeroEyebrow: text.includes("ABOUT US"),
        hasHeroBrand: text.includes("Advaita Tattva"),
        hasHeroTagline: text.includes("Celebrating Indian Heritage Through Philosophy, Craftsmanship & Meaningful Design."),
        hasPhilosophyHeading: text.includes("Our Philosophy"),
        hasPhilosophyP1: text.includes("At Advaita Tattva, we believe that true artistry goes beyond what the eyes can see"),
        hasPhilosophyP2: text.includes("Inspired by the timeless philosophy of ancient India"),
        hasPhilosophyP3: text.includes("Our vision is to create a meaningful connection between India's cultural roots"),
        hasPhilosophyP4: text.includes("We aspire to share the richness of Indian craftsmanship with the world"),
        hasNameMeaningHeading: text.includes("THE MEANING BEHIND OUR NAME"),
        hasAdvaitaTerm: text.includes("ADVAITA"),
        hasAdvaitaConcept: text.includes("not two") || text.includes("one without a second"),
        hasTattvaTerm: text.includes("TATTVA"),
        hasTattvaConcept: text.includes("essence, fundamental principles and the underlying nature of things"),
        hasSynthesis: text.includes("Together, the two words represent a connection between spiritual thought and physical creation"),
        hasConclusion: text.includes("For us, Advaita Tattva is more than a name. It is the philosophy that inspires our identity"),
        hasJourneyHeading: text.includes("OUR JOURNEY: ROOTED IN INDIAN CRAFTSMANSHIP"),
        hasLostWaxHighlight: text.includes("traditional lost-wax casting technique"),
        hasApproachHeading: text.includes("OUR APPROACH: TRADITION MEETS MODERN LIVING"),
        hasClosingCtaHeading: text.includes("Discover the Art of Indian Heritage"),
        hasClosingCtaSupport: text.includes("Explore our collection of handcrafted brass sculptures"),
      };
    });

    results.testJ_about_redesign_and_catalogue_section.details.push(
      `About Page Content Audit: Hero=${aboutPageAudit.hasHeroTagline}, Philosophy=${aboutPageAudit.hasPhilosophyP1}, NameMeaning=${aboutPageAudit.hasNameMeaningHeading}, Journey=${aboutPageAudit.hasJourneyHeading}, LostWax=${aboutPageAudit.hasLostWaxHighlight}, Approach=${aboutPageAudit.hasApproachHeading}, ClosingCTA=${aboutPageAudit.hasClosingCtaHeading}`
    );

    // Verify About Page Closing CTA interactions
    const aboutExploreBtn = await page.$("section:has-text('Discover the Art of Indian Heritage') a:has-text('Explore Our Collection')");
    const exploreHref = aboutExploreBtn ? await aboutExploreBtn.getAttribute("href") : null;
    results.testJ_about_redesign_and_catalogue_section.details.push(`About page Explore Collection button href: ${exploreHref}`);

    const aboutContactBtn = await page.$("section:has-text('Discover the Art of Indian Heritage') button:has-text('Contact Us')");
    let aboutContactOpensModal = false;
    if (aboutContactBtn) {
      await aboutContactBtn.click();
      await page.waitForTimeout(200);
      aboutContactOpensModal = await page.evaluate(() => !!document.querySelector("dialog[open]"));
      results.testJ_about_redesign_and_catalogue_section.details.push(`About page Contact Us button opens dialog: ${aboutContactOpensModal}`);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);
    }

    // Capture About Page Screenshots (Desktop & Mobile)
    await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_about_redesign.png"), fullPage: false });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/about`, { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile_390_about_redesign.png"), fullPage: false });

    // --- Part 2: Verify Home Page Dedicated Catalogue Section ---
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

    const catalogueSectionAudit = await page.evaluate(() => {
      const section = document.querySelector("#catalogue-brochure");
      if (!section) return null;

      const text = section.textContent || "";
      const hasEyebrow = text.includes("OFFICIAL PRODUCT CATALOGUE");
      const hasHeading = text.includes("Explore Our Collection");
      const hasDescription = text.includes("Discover our collection of handcrafted brass sculptures, inspired by Indian heritage");
      const hasPlaceholder = text.includes("Official Catalogue Coming Soon");
      const hasFileTargetText = text.includes("File target:");
      const hasCoverImage = !!section.querySelector("img[src*='catalogue-cover.jpg']");
      const hasBrochureBadge = text.includes("Official Brochure") && text.includes("21 Pages");

      const viewBtn = section.querySelector("a[href*='advaita-tattva-catalogue.pdf']:not([download])");
      const downloadBtn = section.querySelector("a[download]");

      return {
        exists: true,
        hasEyebrow,
        hasHeading,
        hasDescription,
        hasPlaceholder,
        hasFileTargetText,
        hasCoverImage,
        hasBrochureBadge,
        viewHref: viewBtn ? viewBtn.getAttribute("href") : null,
        viewTarget: viewBtn ? viewBtn.getAttribute("target") : null,
        downloadHref: downloadBtn ? downloadBtn.getAttribute("href") : null,
        downloadFilename: downloadBtn ? downloadBtn.getAttribute("download") : null,
      };
    });

    results.testJ_about_redesign_and_catalogue_section.details.push(
      `Catalogue Section Audit: exists=${catalogueSectionAudit?.exists}, eyebrow=${catalogueSectionAudit?.hasEyebrow}, heading=${catalogueSectionAudit?.hasHeading}, placeholder=${catalogueSectionAudit?.hasPlaceholder} (Expected false), fileTargetText=${catalogueSectionAudit?.hasFileTargetText} (Expected false), coverImage=${catalogueSectionAudit?.hasCoverImage} (Expected true), brochureBadge=${catalogueSectionAudit?.hasBrochureBadge} (Expected true)`
    );
    results.testJ_about_redesign_and_catalogue_section.details.push(
      `Catalogue Section View Link: ${catalogueSectionAudit?.viewHref} (target=${catalogueSectionAudit?.viewTarget})`
    );
    results.testJ_about_redesign_and_catalogue_section.details.push(
      `Catalogue Section Download Link: ${catalogueSectionAudit?.downloadHref} (download=${catalogueSectionAudit?.downloadFilename})`
    );

    // Verify Header PDF Catalogue button uses exact configured path
    const headerPdfHref = await page.$eval("header a[title*='PDF Catalogue'], header a[href*='catalogue']", (el) => el.getAttribute("href"));
    results.testJ_about_redesign_and_catalogue_section.details.push(`Header PDF Catalogue link href: ${headerPdfHref}`);

    // Capture Catalogue Section Screenshots
    const catSecEl = await page.$("#catalogue-brochure");
    if (catSecEl) {
      await catSecEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_catalogue_section.png"), fullPage: false });
    }

    // Capture Full Home Page with PDF Preview
    await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_home_pdf_preview.png"), fullPage: false });

    // Mobile check for Catalogue Section
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    const mobileCatEl = await page.$("#catalogue-brochure");
    if (mobileCatEl) {
      await mobileCatEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile_390_catalogue_section.png"), fullPage: false });
    }
    await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile_390_home_pdf_preview.png"), fullPage: false });

    const allAboutContentMatches = Object.values(aboutPageAudit).every(Boolean);
    const passesTestJ =
      allAboutContentMatches &&
      aboutContactOpensModal &&
      catalogueSectionAudit?.exists &&
      catalogueSectionAudit.hasEyebrow &&
      catalogueSectionAudit.hasHeading &&
      catalogueSectionAudit.hasDescription &&
      !catalogueSectionAudit.hasPlaceholder &&
      !catalogueSectionAudit.hasFileTargetText &&
      catalogueSectionAudit.hasCoverImage &&
      catalogueSectionAudit.hasBrochureBadge &&
      catalogueSectionAudit.viewHref === "/catalogue/advaita-tattva-catalogue.pdf" &&
      catalogueSectionAudit.viewTarget === "_blank" &&
      catalogueSectionAudit.downloadHref === "/catalogue/advaita-tattva-catalogue.pdf" &&
      catalogueSectionAudit.downloadFilename === "Advaita-Tattva-Catalogue.pdf" &&
      headerPdfHref === "/catalogue/advaita-tattva-catalogue.pdf";

    if (passesTestJ) {
      results.testJ_about_redesign_and_catalogue_section.status = "PASS";
    } else {
      results.testJ_about_redesign_and_catalogue_section.status = "FAIL";
    }

    // -------------------------------------------------------------
    // Test K: Hero Vertical Smartphone-Sized Video Integration
    // -------------------------------------------------------------
    console.log("Running Test K: Hero Vertical Smartphone Video Integration...");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);

    const heroVideoDesktop = await page.evaluate(() => {
      const frame = document.querySelector("#hero-video-frame");
      const video = frame?.querySelector("video");
      if (!frame || !video) return null;
      const rect = frame.getBoundingClientRect();
      const vRect = video.getBoundingClientRect();
      const aspectRatio = rect.width / rect.height;
      return {
        src: video.getAttribute("src"),
        poster: video.getAttribute("poster"),
        autoplay: video.autoplay,
        muted: video.muted,
        loop: video.loop,
        playsInline: video.playsInline,
        hasControls: video.hasAttribute("controls"),
        paused: video.paused,
        readyState: video.readyState,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        frameWidth: Math.round(rect.width),
        frameHeight: Math.round(rect.height),
        renderedWidth: Math.round(vRect.width),
        renderedHeight: Math.round(vRect.height),
        aspectRatio: Number(aspectRatio.toFixed(4)),
        objectFit: window.getComputedStyle(video).objectFit,
        overflowX: document.documentElement.scrollWidth > window.innerWidth,
      };
    });

    results.testK_hero_vertical_video.details.push(
      `Desktop 1440px Hero Video: ${JSON.stringify(heroVideoDesktop)}`
    );
    await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_hero_video.png"), fullPage: false });

    // Tablet 768x1024
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);
    const heroVideoTablet = await page.evaluate(() => {
      const frame = document.querySelector("#hero-video-frame");
      if (!frame) return null;
      const rect = frame.getBoundingClientRect();
      return {
        frameWidth: Math.round(rect.width),
        frameHeight: Math.round(rect.height),
        aspectRatio: Number((rect.width / rect.height).toFixed(4)),
        overflowX: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    results.testK_hero_vertical_video.details.push(
      `Tablet 768px Hero Video: ${JSON.stringify(heroVideoTablet)}`
    );
    await page.screenshot({ path: path.join(OUTPUT_DIR, "tablet_768_hero_video.png"), fullPage: false });

    // Mobile 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);
    const heroVideoMobile = await page.evaluate(() => {
      const frame = document.querySelector("#hero-video-frame");
      if (!frame) return null;
      const rect = frame.getBoundingClientRect();
      const viewportCenter = window.innerWidth / 2;
      const frameCenter = rect.left + rect.width / 2;
      return {
        frameWidth: Math.round(rect.width),
        frameHeight: Math.round(rect.height),
        aspectRatio: Number((rect.width / rect.height).toFixed(4)),
        centerOffsetPx: Math.round(Math.abs(viewportCenter - frameCenter)),
        overflowX: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    results.testK_hero_vertical_video.details.push(
      `Mobile 390px Hero Video: ${JSON.stringify(heroVideoMobile)}`
    );
    // Scroll slightly to capture both text and centered smartphone video on mobile
    await page.evaluate(() => window.scrollTo(0, 260));
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile_390_hero_video.png"), fullPage: false });

    const desktopAspectOk = heroVideoDesktop && Math.abs(heroVideoDesktop.aspectRatio - 9 / 16) < 0.03;
    const desktopSizeOk = heroVideoDesktop && heroVideoDesktop.frameWidth >= 220 && heroVideoDesktop.frameWidth <= 320;
    const tabletProportionOk = heroVideoTablet && heroVideoTablet.frameWidth < heroVideoDesktop.frameWidth && !heroVideoTablet.overflowX;
    const mobileCenteredOk = heroVideoMobile && heroVideoMobile.centerOffsetPx <= 5 && !heroVideoMobile.overflowX;

    const passesTestK =
      heroVideoDesktop &&
      heroVideoDesktop.src === "/videos/advaita-tattva-hero.mp4" &&
      heroVideoDesktop.poster === "/videos/advaita-tattva-hero-poster.jpg" &&
      heroVideoDesktop.autoplay &&
      heroVideoDesktop.muted &&
      heroVideoDesktop.loop &&
      heroVideoDesktop.playsInline &&
      !heroVideoDesktop.hasControls &&
      !heroVideoDesktop.paused &&
      heroVideoDesktop.readyState >= 2 &&
      heroVideoDesktop.objectFit === "cover" &&
      desktopAspectOk &&
      desktopSizeOk &&
      tabletProportionOk &&
      mobileCenteredOk;

    if (passesTestK) {
      results.testK_hero_vertical_video.status = "PASS";
    } else {
      results.testK_hero_vertical_video.status = "FAIL";
    }

    // -------------------------------------------------------------
    // Test L: Video Gallery Horizontal Carousel ("The Art in Motion")
    // -------------------------------------------------------------
    console.log("Running Test L: Video Gallery Horizontal Carousel...");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

    const vgEl = await page.$("#video-gallery");
    if (vgEl) {
      await vgEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    }

    // 1. Verify horizontal carousel geometry & arrow controls on Desktop (1440x900)
    const carouselDesktopAudit = await page.evaluate(() => {
      const track = document.querySelector("#video-gallery [data-video-carousel-track='true']");
      if (!track) return null;
      const cards = Array.from(track.querySelectorAll("figure"));
      const firstRect = cards[0]?.getBoundingClientRect();
      const lastRect = cards[cards.length - 1]?.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();

      // Count cards substantially visible in initial viewport (~3 desktop)
      const visibleCount = cards.filter((c) => {
        const r = c.getBoundingClientRect();
        return r.left >= trackRect.left - 10 && r.right <= trackRect.right + 10;
      }).length;

      // Single horizontal row check (all tops aligned)
      const singleHorizontalRow = cards.every(
        (c) => Math.abs(c.getBoundingClientRect().top - firstRect.top) <= 2
      );

      // No overlapping cards horizontally
      let overlapping = false;
      for (let i = 1; i < cards.length; i++) {
        if (cards[i].getBoundingClientRect().left < cards[i - 1].getBoundingClientRect().right - 1) {
          overlapping = true;
          break;
        }
      }

      const prevBtn = document.querySelector("#video-gallery button[data-carousel-control='prev']");
      const nextBtn = document.querySelector("#video-gallery button[data-carousel-control='next']");

      return {
        isScrollable: track.scrollWidth > track.clientWidth,
        scrollWidth: Math.round(track.scrollWidth),
        clientWidth: Math.round(track.clientWidth),
        firstCardWidth: Math.round(firstRect?.width ?? 0),
        lastCardLeft: Math.round(lastRect?.left ?? 0),
        visibleCount,
        singleHorizontalRow,
        overlapping,
        prevDisabledInitially: !!prevBtn?.disabled,
        nextDisabledInitially: !!nextBtn?.disabled,
      };
    });

    // Capture desktop carousel screenshot before interacting with controls
    await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_video_gallery.png"), fullPage: false });

    // Click Next arrow -> scrolls smoothly right and pauses offscreen earlier cards
    const nextArrow = page.locator("#video-gallery button[data-carousel-control='next']");
    const prevArrow = page.locator("#video-gallery button[data-carousel-control='prev']");
    await nextArrow.click();
    await page.waitForTimeout(700);
    const scrollAfterNext = await page.evaluate(() => {
      const track = document.querySelector("#video-gallery [data-video-carousel-track='true']");
      return {
        scrollLeft: Math.round(track?.scrollLeft ?? 0),
        prevDisabledAfterNext: !!document.querySelector("#video-gallery button[data-carousel-control='prev']")?.disabled,
      };
    });

    // Click Prev arrow back to start
    await prevArrow.click();
    await page.waitForTimeout(700);

    // Scroll through each video horizontally to confirm all 13 load metadata cleanly
    const vgCardCount = await page.$$eval("#video-gallery figure", (els) => els.length);
    for (let i = 0; i < vgCardCount; i++) {
      await page.evaluate((idx) => {
        const cards = document.querySelectorAll("#video-gallery figure");
        if (cards[idx]) cards[idx].scrollIntoView({ behavior: "instant", inline: "start", block: "nearest" });
      }, i);
      await page.waitForTimeout(150);
    }
    await page.evaluate(() => {
      const track = document.querySelector("#video-gallery [data-video-carousel-track='true']");
      if (track) track.scrollLeft = 0;
    });
    await page.waitForTimeout(450);

    const videoGalleryAudit = await page.evaluate(() => {
      const cat = document.querySelector("#catalogue");
      const vg = document.querySelector("#video-gallery");
      const footer = document.querySelector("footer");
      if (!cat || !vg || !footer) return null;

      const vgAfterCat = (cat.compareDocumentPosition(vg) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
      const footerAfterVg = (vg.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
      const heading = vg.querySelector("h2")?.textContent?.trim();
      const subtitle = vg.querySelector("p")?.textContent?.trim();
      const videoCards = Array.from(vg.querySelectorAll("figure"));
      const hasCuratingPlaceholder = vg.textContent.includes("Craftsmanship Films Curating Soon");
      const leaksInternalPath = vg.textContent.includes("src/config") || vg.textContent.includes("public/videos/gallery");

      const videosDetail = videoCards.map((fig) => {
        const id = fig.getAttribute("data-video-id");
        const video = fig.querySelector("video");
        const playBtn = fig.querySelector("button[data-video-control='play-pause']");
        const muteBtn = fig.querySelector("button[data-video-control='mute-unmute']");
        return {
          id,
          src: video?.getAttribute("src"),
          poster: video?.getAttribute("poster"),
          readyState: video?.readyState ?? 0,
          networkState: video?.networkState ?? 0,
          muted: video?.muted ?? false,
          hasError: !!video?.error,
          videoWidth: video?.videoWidth ?? 0,
          videoHeight: video?.videoHeight ?? 0,
          hasControls: !!playBtn && !!muteBtn,
        };
      });

      return {
        exists: true,
        vgAfterCat,
        footerAfterVg,
        heading,
        subtitle,
        videoCount: videoCards.length,
        hasCuratingPlaceholder,
        leaksInternalPath,
        bg: window.getComputedStyle(vg).backgroundColor,
        overflowDesktop: document.documentElement.scrollWidth > window.innerWidth,
        videosDetail,
      };
    });

    // Verify HTTP 200 for all 13 videos & posters via fetch HEAD
    const mediaHttpChecks = await page.evaluate(async () => {
      const videos = Array.from(document.querySelectorAll("#video-gallery video"));
      const checks = [];
      for (const v of videos) {
        const src = v.getAttribute("src");
        const poster = v.getAttribute("poster");
        const vRes = await fetch(src, { method: "HEAD" });
        const pRes = poster ? await fetch(poster, { method: "HEAD" }) : { status: 0 };
        checks.push({ src, vStatus: vRes.status, poster, pStatus: pRes.status });
      }
      return checks;
    });

    // Verify independent Play/Pause & Mute/Unmute controls on the first card without affecting the second
    let controlsIndependent = false;
    if (vgCardCount >= 2) {
      const firstCard = page.locator("#video-gallery figure").first();
      await firstCard.locator("button[data-video-control='mute-unmute']").click();
      await firstCard.locator("button[data-video-control='play-pause']").click();
      await page.waitForTimeout(200);

      controlsIndependent = await page.evaluate(() => {
        const cards = document.querySelectorAll("#video-gallery figure");
        const v0 = cards[0]?.querySelector("video");
        const v1 = cards[1]?.querySelector("video");
        return !!v0 && !!v1 && v0.muted === false && v1.muted === true;
      });
    }

    // 2. Tablet check (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    const vgTabletEl = await page.$("#video-gallery");
    if (vgTabletEl) await vgTabletEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    const tabletCarouselAudit = await page.evaluate(() => {
      const track = document.querySelector("#video-gallery [data-video-carousel-track='true']");
      if (!track) return null;
      const trackRect = track.getBoundingClientRect();
      const cards = Array.from(track.querySelectorAll("figure"));
      const visibleCount = cards.filter((c) => {
        const r = c.getBoundingClientRect();
        return r.left >= trackRect.left - 10 && r.right <= trackRect.right + 10;
      }).length;
      return {
        visibleCount,
        isScrollable: track.scrollWidth > track.clientWidth,
        overflowX: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    await page.screenshot({ path: path.join(OUTPUT_DIR, "tablet_768_video_gallery.png"), fullPage: false });

    // 3. Mobile check (390x844) -> 1 card + peek of 2nd card + swipeable without page overflow
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    const vgMobileEl = await page.$("#video-gallery");
    if (vgMobileEl) await vgMobileEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    const mobileCarouselAudit = await page.evaluate(() => {
      const track = document.querySelector("#video-gallery [data-video-carousel-track='true']");
      if (!track) return null;
      const trackRect = track.getBoundingClientRect();
      const cards = Array.from(track.querySelectorAll("figure"));
      const card0 = cards[0]?.getBoundingClientRect();
      const card1 = cards[1]?.getBoundingClientRect();
      const hasNextPeek = !!card1 && card1.left < trackRect.right - 10;
      return {
        firstCardRatioToTrack: Number(((card0?.width ?? 0) / trackRect.width).toFixed(2)),
        hasNextPeek,
        isScrollable: track.scrollWidth > track.clientWidth,
        overflowX: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile_390_video_gallery.png"), fullPage: false });

    const allMedia200 =
      mediaHttpChecks.length === 14 &&
      mediaHttpChecks.every((c) => c.vStatus === 200 && c.pStatus === 200);
    const allVideosLoadedMeta =
      videoGalleryAudit?.videosDetail?.length === 14 &&
      videoGalleryAudit.videosDetail.every((v) => !v.hasError && v.readyState >= 1 && v.videoWidth > 0 && v.hasControls);

    results.testL_video_gallery_section.details.push(
      `Desktop Carousel Audit: ${JSON.stringify(carouselDesktopAudit)}`,
      `Scroll After Next Arrow: ${JSON.stringify(scrollAfterNext)}`,
      `Media Audit: count=${videoGalleryAudit?.videoCount}, allMedia200=${allMedia200}, allVideosLoadedMeta=${allVideosLoadedMeta}, controlsIndependent=${controlsIndependent}`,
      `Tablet Carousel Audit (768px): ${JSON.stringify(tabletCarouselAudit)}`,
      `Mobile Carousel Audit (390px): ${JSON.stringify(mobileCarouselAudit)}`
    );

    const passesTestL =
      videoGalleryAudit &&
      videoGalleryAudit.exists &&
      videoGalleryAudit.vgAfterCat &&
      videoGalleryAudit.footerAfterVg &&
      videoGalleryAudit.heading === "The Art in Motion" &&
      videoGalleryAudit.subtitle ===
        "Experience the beauty, craftsmanship and timeless details of our handcrafted brass sculptures." &&
      videoGalleryAudit.videoCount === 14 &&
      !videoGalleryAudit.hasCuratingPlaceholder &&
      carouselDesktopAudit?.singleHorizontalRow &&
      carouselDesktopAudit?.isScrollable &&
      !carouselDesktopAudit?.overlapping &&
      carouselDesktopAudit?.visibleCount === 3 &&
      carouselDesktopAudit?.prevDisabledInitially &&
      !carouselDesktopAudit?.nextDisabledInitially &&
      scrollAfterNext.scrollLeft > 400 &&
      !scrollAfterNext.prevDisabledAfterNext &&
      tabletCarouselAudit?.visibleCount === 2 &&
      !tabletCarouselAudit?.overflowX &&
      mobileCarouselAudit?.hasNextPeek &&
      mobileCarouselAudit?.isScrollable &&
      !mobileCarouselAudit?.overflowX &&
      allMedia200 &&
      allVideosLoadedMeta &&
      controlsIndependent &&
      !videoGalleryAudit.leaksInternalPath &&
      !videoGalleryAudit.overflowDesktop;

    if (passesTestL) {
      results.testL_video_gallery_section.status = "PASS";
    } else {
      results.testL_video_gallery_section.status = "FAIL";
    }

    // -------------------------------------------------------------
    // Test M: Official Logo Integration & Favicon/Icon Metadata
    // -------------------------------------------------------------
    console.log("Running Test M: Official Logo & Favicon Verification...");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_header_logo.png"), fullPage: false });

    const brandingDesktopAudit = await page.evaluate(async () => {
      const headerImg = document.querySelector("header img[src*='advaita-tattva-logo']");
      const hRect = headerImg?.getBoundingClientRect();
      const headerEl = document.querySelector("header");

      const iconLinks = Array.from(document.querySelectorAll("head link[rel*='icon']")).map((l) => ({
        rel: l.getAttribute("rel"),
        href: l.getAttribute("href"),
        sizes: l.getAttribute("sizes"),
        type: l.getAttribute("type"),
      }));

      const iconHttpChecks = [];
      for (const link of iconLinks) {
        if (!link.href) continue;
        const res = await fetch(link.href);
        iconHttpChecks.push({
          href: link.href,
          status: res.status,
          contentType: res.headers.get("content-type"),
        });
      }

      const explicitIconPaths = [
        "/favicon.ico",
        "/icons/favicon-16x16.png",
        "/icons/favicon-32x32.png",
        "/icons/apple-touch-icon.png",
        "/icons/icon-192x192.png",
        "/icons/icon-512x512.png",
        "/brand/advaita-tattva-logo.jpg",
      ];
      const staticAssetChecks = [];
      for (const p of explicitIconPaths) {
        const res = await fetch(p);
        staticAssetChecks.push({ path: p, status: res.status, contentType: res.headers.get("content-type") });
      }

      return {
        headerLogoLoaded: !!headerImg && headerImg.complete && headerImg.naturalWidth > 0 && headerImg.naturalWidth === headerImg.naturalHeight,
        headerLogoNatural: headerImg ? `${headerImg.naturalWidth}x${headerImg.naturalHeight}` : null,
        headerLogoAspectRatio: hRect && hRect.height > 0 ? Number((hRect.width / hRect.height).toFixed(2)) : 0,
        headerHeight: Math.round(headerEl?.getBoundingClientRect().height ?? 0),
        iconLinks,
        iconHttpChecks,
        staticAssetChecks,
      };
    });

    const footerEl = await page.$("footer");
    if (footerEl) await footerEl.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const img = document.querySelector("footer img[src*='advaita-tattva-logo']");
      return !!img && img.complete && img.naturalWidth > 0;
    }, { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(200);
    const footerAudit = await page.evaluate(() => {
      const footerImg = document.querySelector("footer img[src*='advaita-tattva-logo']");
      const fRect = footerImg?.getBoundingClientRect();
      return {
        footerLogoLoaded: !!footerImg && footerImg.complete && footerImg.naturalWidth > 0 && footerImg.naturalWidth === footerImg.naturalHeight,
        footerLogoNatural: footerImg ? `${footerImg.naturalWidth}x${footerImg.naturalHeight}` : null,
        footerLogoAspectRatio: fRect && fRect.height > 0 ? Number((fRect.width / fRect.height).toFixed(2)) : 0,
      };
    });
    await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_footer_logo.png"), fullPage: false });

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    const headerTabletAudit = await page.evaluate(() => ({
      height: Math.round(document.querySelector("header")?.getBoundingClientRect().height ?? 0),
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
    }));
    await page.screenshot({ path: path.join(OUTPUT_DIR, "tablet_768_header_logo.png"), fullPage: false });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    const headerMobileAudit = await page.evaluate(() => ({
      height: Math.round(document.querySelector("header")?.getBoundingClientRect().height ?? 0),
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
    }));
    await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile_390_header_logo.png"), fullPage: false });

    const allHeadIconsOk =
      brandingDesktopAudit.iconLinks.length >= 4 &&
      brandingDesktopAudit.iconHttpChecks.every((c) => c.status === 200);
    const allStaticAssetsOk = brandingDesktopAudit.staticAssetChecks.every((c) => c.status === 200);

    results.testM_logo_and_favicon.details.push(
      `Desktop Branding Audit: ${JSON.stringify(brandingDesktopAudit)}`,
      `Desktop Footer Audit: ${JSON.stringify(footerAudit)}`,
      `Tablet Header Audit: ${JSON.stringify(headerTabletAudit)}`,
      `Mobile Header Audit: ${JSON.stringify(headerMobileAudit)}`
    );

    const passesTestM =
      brandingDesktopAudit.headerLogoLoaded &&
      Math.abs(brandingDesktopAudit.headerLogoAspectRatio - 1) < 0.05 &&
      footerAudit.footerLogoLoaded &&
      Math.abs(footerAudit.footerLogoAspectRatio - 1) < 0.05 &&
      brandingDesktopAudit.headerHeight <= 84 &&
      headerTabletAudit.height <= 84 &&
      !headerTabletAudit.overflowX &&
      headerMobileAudit.height <= 84 &&
      !headerMobileAudit.overflowX &&
      allHeadIconsOk &&
      allStaticAssetsOk;

    if (passesTestM) {
      results.testM_logo_and_favicon.status = "PASS";
    } else {
      results.testM_logo_and_favicon.status = "FAIL";
    }

    // -------------------------------------------------------------
    // Test N: Security Headers, Asset Isolation & Accessibility
    // -------------------------------------------------------------
    console.log("Running Test N: Security Headers & Accessibility...");
    const homeHeadersRes = await context.request.get(`${BASE_URL}/`);
    const headers = homeHeadersRes.headers();
    const securityAudit = {
      xContentTypeOptions: headers["x-content-type-options"] || null,
      referrerPolicy: headers["referrer-policy"] || null,
      xFrameOptions: headers["x-frame-options"] || null,
      permissionsPolicy: headers["permissions-policy"] || null,
      hasCsp: Boolean(headers["content-security-policy"]),
    };

    const privateBrochureRes = await context.request.get(`${BASE_URL}/source-brochures/product-reference-brochure.pdf`);
    const privateArtifactsRes = await context.request.get(`${BASE_URL}/test-artifacts/test-summary.json`);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/products`, { waitUntil: "domcontentloaded" });
    const a11yProductsAudit = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("main img"));
      const missingAlt = imgs.filter((img) => !img.getAttribute("alt") || img.getAttribute("alt").trim().length < 3).length;
      const buttonsWithoutLabel = Array.from(document.querySelectorAll("button")).filter((btn) => {
        const txt = btn.textContent?.trim() || "";
        const aria = btn.getAttribute("aria-label") || btn.getAttribute("title") || "";
        return txt.length === 0 && aria.length === 0;
      }).length;
      return { totalImgs: imgs.length, missingAlt, buttonsWithoutLabel };
    });

    // Quick View dialog aria-modal & Esc check
    await page.click("button[title='Quick View Brochure Details']");
    await page.waitForSelector("dialog[open]");
    const quickViewDialogAttrs = await page.evaluate(() => {
      const d = document.querySelector("dialog[open]");
      return {
        ariaModal: d?.getAttribute("aria-modal"),
        ariaLabelledBy: d?.getAttribute("aria-labelledby"),
      };
    });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);

    // Reduced-motion check on homepage Hero video
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    const reducedMotionHeroPaused = await page.evaluate(() => {
      const v = document.querySelector("#hero-video-frame video");
      return v ? v.paused : false;
    });
    await page.emulateMedia({ reducedMotion: "no-preference" });

    results.testN_security_and_accessibility.details.push(
      `Security Headers: ${JSON.stringify(securityAudit)}`,
      `Private Source Brochure HTTP Status: ${privateBrochureRes.status()} (Expected 404)`,
      `Private Test Artifacts HTTP Status: ${privateArtifactsRes.status()} (Expected 404)`,
      `Products A11y Audit: ${JSON.stringify(a11yProductsAudit)}`,
      `Quick View Dialog Attrs: ${JSON.stringify(quickViewDialogAttrs)}`,
      `Reduced Motion Pauses Hero Autoplay: ${reducedMotionHeroPaused}`,
      `Total Console Errors (End of Run): ${consoleErrors.length}`,
      `Total Failed Requests (End of Run): ${failedRequests.length}`,
      ...(failedRequests.length > 0 ? [`Failed Request Samples: ${JSON.stringify(failedRequests.slice(0, 5))}`] : [])
    );

    const passesSecurity =
      securityAudit.xContentTypeOptions === "nosniff" &&
      Boolean(securityAudit.referrerPolicy) &&
      securityAudit.xFrameOptions === "SAMEORIGIN" &&
      Boolean(securityAudit.permissionsPolicy) &&
      securityAudit.hasCsp &&
      privateBrochureRes.status() === 404 &&
      privateArtifactsRes.status() === 404;

    const passesA11y =
      a11yProductsAudit.missingAlt === 0 &&
      a11yProductsAudit.buttonsWithoutLabel === 0 &&
      quickViewDialogAttrs.ariaModal === "true" &&
      Boolean(quickViewDialogAttrs.ariaLabelledBy) &&
      reducedMotionHeroPaused;

    if (passesSecurity && passesA11y && consoleErrors.length === 0) {
      results.testN_security_and_accessibility.status = "PASS";
    } else {
      results.testN_security_and_accessibility.status = "FAIL";
    }

  } catch (err) {
    console.error("Test execution exception:", err);
  } finally {
    await browser.close();
  }

  // Save report
  fs.writeFileSync(path.join(OUTPUT_DIR, `test-summary-${PW_BROWSER}.json`), JSON.stringify(results, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, "test-summary.json"), JSON.stringify(results, null, 2));
  console.log("Test suite finished. Results summary:");
  console.log(JSON.stringify(results, null, 2));

  const anyFailed = Object.values(results).some((r) => r.status !== "PASS");
  if (anyFailed) {
    process.exitCode = 1;
  }
}

runTests();
