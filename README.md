# ADVAITA TATTVA — Antique Brass Idol Collection Website

A fast, responsive, and minimal product catalogue website inspired by the reference website (*The Stone Studio*), built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

Featuring the **ADVAITA TATTVA Antique Brass Idol Collection**, with 100% authentic product imagery and specifications extracted directly from the official 7-page catalogue PDF brochure.

---

## 1. Project Architecture & Features

- **Exactly Two Pages**:
  - Home: `/`
  - About Us: `/about`
  *(No FAQ, blog, pricing, cart, or separate contact page)*
- **Authentic Brand & Heading Matching the Brochure**:
  - Brand Name: **ADVAITA TATTVA**
  - Collection / Main Heading: **Antique Brass Idol Collection**
  - Tagline / Subtitle: *"A timeless devotional accent for your home, puja space, or thoughtful gifting."*
  - Sizing Note: *"Looking for a different size? Custom sizes are available on request."*
- **Three-Dot Category Menu (Header ⋮)**:
  - Header three-dot vertical icon button (Desktop & Mobile) inspired by the reference site.
  - Dropdown opens with **strictly two main categories**:
    1. **Buddha Statues**
    2. **Hindu Statues**
  - Smooth opening/closing transitions, Escape key dismissal, click-outside handling, and full mobile support.
  - Category selection updates URL query parameter (`/?category=buddha#catalogue`) and filters the catalogue showcase in real-time.
- **Strict Category Separation**:
  - **Buddha Statues (2 Items)**: Seated Buddha, Buddha under Bodhi Tree. Zero Hindu deities or unrelated products.
  - **Hindu Statues (5 Items)**: Lord Ganesha, Maa Durga, Maa Lakshmi, Laddu Gopal, Shivling. Zero Buddha statues.
  - **All Statues (7 Items)**: Complete brochure collection.
- **100% Brochure-Only Product Imagery**:
  - All 7 images were extracted bit-for-bit directly from the original uploaded PDF brochure (`Advaita_Tattva_Catalogue_Custom_Sizes.pdf`).
  - Zero external stock photos, web images, or AI-generated graphics.
  - All original product aspect ratios and image resolutions are preserved.
- **Authentic Brochure Specifications in Quick View**:
  - Each product card includes a Quick View button displaying the exact **Sizes & Weights** table from the brochure.
  - Displays original brochure page number badge (e.g. `Hindu Statues • Page 1 of Brochure`).
  - Includes custom sizing advisory: *"Looking for a different size? Custom sizes are available on request."*
- **WhatsApp Direct Enquiry System**:
  - Pre-filled WhatsApp enquiry buttons on every card and in the Quick View modal.
  - Bottom enquiry form formatted with Name, Phone, and Enquiry message.
  - Floating WhatsApp action button fixed at bottom-right corner.
- **PDF Catalogue Integration**:
  - The authentic 7-page uploaded brochure is served at `/catalogue.pdf`.
  - Accessible via "View PDF Catalogue" (opens in new tab) and companion download button.
  - Verified bit-for-bit identical with MD5 hash: `39851612c74f2272397b10c58c9e0265`.
- **Contact Details Modal**:
  - Accessible `<dialog>` modal with phone, email, direct WhatsApp chat, business hours, and studio address.

---

## 2. Product Inventory from Brochure

| Page | Product Name | Category | Item Code | Available Heights | Weight Range | Extracted File |
| :---: | :--- | :---: | :---: | :--- | :--- | :--- |
| **1** | Lord Ganesha | Hindu | `AT-HIN-GAN01` | 4", 6", 8" | 180 g – 322 g | `public/products/lord-ganesha.jpg` |
| **2** | Maa Durga | Hindu | `AT-HIN-DUR02` | 4", 6", 8" | 183 g – 328 g | `public/products/maa-durga.jpg` |
| **3** | Maa Lakshmi | Hindu | `AT-HIN-LAK03` | 4", 6", 8" | 177 g – 319 g | `public/products/maa-lakshmi.jpg` |
| **4** | Seated Buddha | Buddha | `AT-BUD-SEA04` | 4.5", 6", 8" | 186 g – 330 g | `public/products/seated-buddha.jpg` |
| **5** | Buddha under Bodhi Tree | Buddha | `AT-BUD-BOD05` | 6", 8", 12" | 249 g – 787 g | `public/products/buddha-bodhi-tree.jpg` |
| **6** | Laddu Gopal | Hindu | `AT-HIN-GOP06` | 3", 6" | 104 g – 189 g | `public/products/laddu-gopal.jpg` |
| **7** | Shivling | Hindu | `AT-HIN-SHI07` | 2", 3" | 60 g – 96 g | `public/products/shivling.jpg` |

---

## 3. Central Configuration File

All business details, contact information, products, and copy are centralized in a single file:

📁 **`src/config/siteConfig.ts`**

```typescript
export const siteConfig = {
  companyName: "ADVAITA TATTVA",
  tagline: "Antique Brass Idol Collection",
  shortBio: "A timeless devotional accent for your home, puja space, or thoughtful gifting...",
  
  // WhatsApp Number (Country code + digits only, e.g. 919876543210 for India)
  whatsappNumber: "919876543210",
  adminPhone: "+91 98765 43210",
  adminEmail: "contact@advaitatattva.com",
  businessHours: "Monday to Saturday, 9:00 AM – 7:00 PM IST",
  studioAddress: "Heritage Craft Quarter, Jaipur, Rajasthan 302001, India",
  
  // PDF Catalogue Asset Path (The uploaded brochure)
  cataloguePdfPath: "/catalogue.pdf",
  
  // Curated Products List — 100% Extracted from Official Brochure PDF
  products: [ ... ],
};
```

---

## 4. Running the Website

```bash
# 1. Install dependencies
npm install

# 2. Build production assets
npm run build

# 3. Start production server
npm run start
# Website running at http://localhost:3000
```

To run in development mode:
```bash
npm run dev
```

---

## 5. Automated Browser QA Suite

Run the automated Playwright browser test suite:

```bash
npm test
# Or: node tests/browser-test.mjs
```

This verifies:
1. **Server Responsiveness**: 200 OK on `/` and `/about`.
2. **Computed Styles & Typography**: Warm ivory background (`#FAF8F5`), Cinzel 60px serif heading, styled navigation without default blue links.
3. **Three-Dot Menu**: Toggle open/close, Escape dismissal, click-outside dismissal, exactly 2 categories ("Buddha Statues", "Hindu Statues").
4. **Strict Category Separation**:
   - Buddha category: 2 Buddha items, 0 Hindu deities.
   - Hindu category: 5 Hindu items, 0 Buddha statues.
   - All Statues: 7 total items.
5. **Quick View & Brochure Specifications**: Renders exact Sizes & Weights table from brochure, page badge, and custom sizing note.
6. **Responsive Layouts**: Zero horizontal overflow across Desktop (1440, 1280), Tablet (768), and Mobile (390).
7. **Interactive Elements**: Contact modal, WhatsApp redirection URL, enquiry form validation.
8. **Asset Integrity**: 100% of images load (`naturalWidth > 0`), brochure PDF size > 2MB and verified MD5 hash match, 0 console errors, 0 failed requests, 0 external image requests.

All test screenshots are generated in `public/test-artifacts/`.
