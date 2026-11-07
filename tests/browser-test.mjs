import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUTPUT_DIR = path.resolve("public/test-artifacts");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runTests() {
  console.log(`Starting automated browser test suite against ${BASE_URL}...`);
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
  };

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });

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
    if (url.startsWith("chrome-extension://")) return;
    failedRequests.push({
      url: url,
      failure: request.failure()?.errorText || "unknown",
    });
  });

  try {
    // -------------------------------------------------------------
    // Test A: Startup and Page Availability
    // -------------------------------------------------------------
    console.log("Running Test A: Server responsiveness...");
    const homeRes = await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    const homeStatus = homeRes.status();
    results.testA_startup.details.push(`Home page status: ${homeStatus}`);

    const aboutRes = await page.goto(`${BASE_URL}/about`, { waitUntil: "networkidle" });
    const aboutStatus = aboutRes.status();
    results.testA_startup.details.push(`About page status: ${aboutStatus}`);

    if (homeStatus === 200 && aboutStatus === 200) {
      results.testA_startup.status = "PASS";
    } else {
      results.testA_startup.status = "FAIL";
    }

    // -------------------------------------------------------------
    // Test B: CSS and Computed Styles Verification
    // -------------------------------------------------------------
    console.log("Running Test B: CSS and Computed Styles Verification...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

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
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_home.png"), fullPage: false });

    // Also capture desktop about screenshot
    await page.goto(`${BASE_URL}/about`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_about.png"), fullPage: false });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

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
    // Test D: Category Filtering & Strict Separation
    // -------------------------------------------------------------
    console.log("Running Test D: Category Filtering & Strict Separation...");
    // 1. Select Buddha Statues via three-dot menu
    await threeDotBtn.click();
    await page.waitForTimeout(250);
    const buddhaMenuItem = await page.$("header nav div[role='menu'] button:has-text('Buddha Statues')");
    await buddhaMenuItem.click();
    await page.waitForTimeout(400);

    // Verify URL updated
    const buddhaUrl = page.url();
    results.testD_category_separation.details.push(`URL after Buddha selection: ${buddhaUrl}`);

    // Verify displayed products in Buddha category
    const buddhaProductTitles = await page.$$eval("article h3", (elements) =>
      elements.map((el) => el.textContent.trim())
    );
    results.testD_category_separation.details.push(`Buddha category products (${buddhaProductTitles.length}): ${JSON.stringify(buddhaProductTitles)}`);

    // Verify strict separation: must contain exactly 3 Buddha statues, and 0 Hindu deities
    const hasOnlyBuddhas =
      buddhaProductTitles.length === 3 &&
      buddhaProductTitles.includes("Seated Buddha") &&
      buddhaProductTitles.includes("Buddha under Bodhi Tree") &&
      buddhaProductTitles.includes("Lord Buddha") &&
      !buddhaProductTitles.some((t) => t.includes("Ganesha") || t.includes("Durga") || t.includes("Lakshmi") || t.includes("Gopal") || t.includes("Shivling") || t.includes("Saraswati") || t.includes("Kubera"));

    results.testD_category_separation.details.push(`Buddha strict purity test: ${hasOnlyBuddhas}`);

    // Capture screenshot of Buddha category showcase
    await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_buddha_category.png"), fullPage: false });

    // 2. Select Hindu Statues via Category Tab
    const hinduTab = await page.$("button:has-text('Hindu Statues')");
    await hinduTab.click();
    await page.waitForTimeout(400);

    const hinduProductTitles = await page.$$eval("article h3", (elements) =>
      elements.map((el) => el.textContent.trim())
    );
    results.testD_category_separation.details.push(`Hindu category products (${hinduProductTitles.length}): ${JSON.stringify(hinduProductTitles)}`);

    // Verify strict separation: must contain 7 Hindu idols and 0 Buddha statues
    const hasOnlyHindus =
      hinduProductTitles.length === 7 &&
      hinduProductTitles.includes("Lord Ganesha") &&
      hinduProductTitles.includes("Maa Durga") &&
      hinduProductTitles.includes("Maa Lakshmi") &&
      hinduProductTitles.includes("Laddu Gopal") &&
      hinduProductTitles.includes("Shivling") &&
      hinduProductTitles.includes("Maa Saraswati") &&
      hinduProductTitles.includes("Lord Kubera") &&
      !hinduProductTitles.some((t) => t.includes("Buddha"));

    results.testD_category_separation.details.push(`Hindu strict purity test: ${hasOnlyHindus}`);

    // Capture screenshot of Hindu category showcase
    await page.screenshot({ path: path.join(OUTPUT_DIR, "desktop_1440_hindu_category.png"), fullPage: false });

    // 3. Select All Statues
    const allTab = await page.$("button:has-text('All Statues')");
    await allTab.click();
    await page.waitForTimeout(400);

    const allProductTitles = await page.$$eval("article h3", (elements) =>
      elements.map((el) => el.textContent.trim())
    );
    results.testD_category_separation.details.push(`All Statues count: ${allProductTitles.length} (Expected 10)`);

    if (hasOnlyBuddhas && hasOnlyHindus && allProductTitles.length === 10) {
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
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    const mobileOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    results.testF_mobile_and_responsive.details.push(`Mobile 390x844 horizontal overflow: ${mobileOverflow} (Expected false)`);

    // Target mobile-specific three-dot button
    const mobileThreeDotBtn = await page.$("header .flex.md\\:hidden button[aria-label*='Statue Categories']");
    if (mobileThreeDotBtn) {
      await mobileThreeDotBtn.click();
      await page.waitForTimeout(250);
      const isMobileMenuOpen = await page.evaluate(() => {
        const m = document.querySelector("header .flex.md\\:hidden div[role='menu']");
        return !!m;
      });
      results.testF_mobile_and_responsive.details.push(`Mobile three-dot menu opens: ${isMobileMenuOpen}`);

      // Capture mobile screenshot with three-dot menu open
      await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile_390_threedot_open.png"), fullPage: false });

      // Click Buddha Statues in mobile menu
      const mobileBuddhaOption = await page.$("header .flex.md\\:hidden div[role='menu'] button:has-text('Buddha Statues')");
      if (mobileBuddhaOption) {
        await mobileBuddhaOption.click();
        await page.waitForTimeout(400);
        const mobileBuddhaCards = await page.$$eval("article", (cards) => cards.length);
        results.testF_mobile_and_responsive.details.push(`Mobile Buddha selection displays ${mobileBuddhaCards} cards (Expected 3)`);
      }
    }

    // Capture mobile full home view
    await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile_390_home.png"), fullPage: false });

    // Test mobile about page
    await page.goto(`${BASE_URL}/about`, { waitUntil: "networkidle" });
    const mobileAboutOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    results.testF_mobile_and_responsive.details.push(`Mobile /about horizontal overflow: ${mobileAboutOverflow}`);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile_390_about.png"), fullPage: false });

    // Tablet check (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
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
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

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
    // Test H: Brochure Images and Assets Integrity
    // -------------------------------------------------------------
    console.log("Running Test H: Brochure Images and Assets Integrity...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    // Scroll catalogue section into view so lazy-loaded product images hydrate
    const catalogueSectionEl = await page.$("#catalogue");
    if (catalogueSectionEl) {
      await catalogueSectionEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
    }

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

    // Verify all 10 products are represented in public/products/
    const expectedBrochureFiles = [
      "lord-ganesha.jpg",
      "maa-durga.jpg",
      "maa-lakshmi.jpg",
      "seated-buddha.jpg",
      "buddha-bodhi-tree.jpg",
      "laddu-gopal.jpg",
      "shivling.jpg",
      "maa-saraswati.jpg",
      "lord-kubera.jpg",
      "lord-buddha.jpg",
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
    const externalImgRequests = failedRequests.filter((r) => !r.url.startsWith("http://localhost:"));
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
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

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

    await page.goto(`${BASE_URL}/about`, { waitUntil: "networkidle" });
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
    await page.goto(`${BASE_URL}/about`, { waitUntil: "networkidle" });

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
    await page.goto(`${BASE_URL}/about`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile_390_about_redesign.png"), fullPage: false });

    // --- Part 2: Verify Home Page Dedicated Catalogue Section ---
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

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
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
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

  } catch (err) {
    console.error("Test execution exception:", err);
  } finally {
    await browser.close();
  }

  // Save report
  fs.writeFileSync(path.join(OUTPUT_DIR, "test-summary.json"), JSON.stringify(results, null, 2));
  console.log("Test suite finished. Results summary:");
  console.log(JSON.stringify(results, null, 2));
}

runTests();
