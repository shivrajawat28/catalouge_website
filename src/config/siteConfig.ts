export type ProductCategory = "all" | "buddha" | "hindu";

export interface ProductSizeOption {
  height: string;
  weight: string;
}

export interface ProductItem {
  id: string;
  name: string;
  title: string; // for compatibility with existing components
  subtitle: string;
  category: "buddha" | "hindu";
  categoryLabel: "Buddha Statues" | "Hindu Statues";
  tagline: string;
  dimension: string;
  material: string;
  weight: string;
  availableSizes: ProductSizeOption[];
  description: string;
  image: string;
  sourcePage: number;
  code: string;
  featured?: boolean;
}

export interface SiteConfig {
  companyName: string;
  tagline: string;
  shortBio: string;
  whatsappNumber: string;
  adminPhone: string;
  adminEmail: string;
  businessHours: string;
  studioAddress?: string;
  cataloguePdfPath: string;
  products: ProductItem[];
  aboutContent: {
    heading: string;
    subheading: string;
    leadParagraph: string;
    craftPhilosophy: string;
    foundryHeritage: string;
    qualityCommitment: string;
    pillars: Array<{
      title: string;
      description: string;
    }>;
  };
}

export const siteConfig: SiteConfig = {
  companyName: "ADVAITA TATTVA",
  tagline: "Antique Brass Idol Collection",
  shortBio: "A timeless devotional accent for your home, puja space, or thoughtful gifting. Handcrafted solid antique brass idols with custom sizes available on request.",
  
  // Business Contact Details
  whatsappNumber: "918796486928", // 91 for India + 10-digit number
  adminPhone: "+91 8796486928",
  adminEmail: "advaitatattvaa@gmail.com",
  businessHours: "Monday to Saturday, 9:00 AM – 5:00 PM IST",
  
  // PDF Catalogue Asset Path (The uploaded brochure)
  cataloguePdfPath: "/catalogue.pdf",

  // Curated Products List — 100% Extracted from Official Brochure PDF
  products: [
    // -------------------------------------------------------------
    // HINDU STATUES (Pages 1, 2, 3, 6, 7)
    // -------------------------------------------------------------
    {
      id: "lord-ganesha",
      name: "Lord Ganesha",
      title: "Lord Ganesha",
      subtitle: "Seated Vinayaka on Lotus Dais",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "A timeless devotional accent for your home, puja space, or thoughtful gifting.",
      dimension: "4 inch, 6 inch, 8 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "180 g to 322 g",
      availableSizes: [
        { height: "4 inch", weight: "180 g" },
        { height: "6 inch", weight: "244 g" },
        { height: "8 inch", weight: "322 g" },
      ],
      description: "A timeless devotional accent for your home, puja space, or thoughtful gifting. Seated Lord Ganesha on an ornate lotus pedestal with modaka and abhaya blessing mudra.",
      image: "/products/lord-ganesha.jpg",
      sourcePage: 1,
      code: "AT-HIN-GAN01",
      featured: true,
    },
    {
      id: "maa-durga",
      name: "Maa Durga",
      title: "Maa Durga",
      subtitle: "Goddess Durga Riding the Lion",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "A timeless devotional accent for your home, puja space, or thoughtful gifting.",
      dimension: "4 inch, 6 inch, 8 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "183 g to 328 g",
      availableSizes: [
        { height: "4 inch", weight: "183 g" },
        { height: "6 inch", weight: "249 g" },
        { height: "8 inch", weight: "328 g" },
      ],
      description: "A timeless devotional accent for your home, puja space, or thoughtful gifting. Ten-armed Goddess Durga poised in majesty atop the sacred lion, bearing traditional divine weapons.",
      image: "/products/maa-durga.jpg",
      sourcePage: 2,
      code: "AT-HIN-DUR02",
      featured: false,
    },
    {
      id: "maa-lakshmi",
      name: "Maa Lakshmi",
      title: "Maa Lakshmi",
      subtitle: "Goddess of Wealth & Prosperity on Lotus",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "A timeless devotional accent for your home, puja space, or thoughtful gifting.",
      dimension: "4 inch, 6 inch, 8 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "177 g to 319 g",
      availableSizes: [
        { height: "4 inch", weight: "177 g" },
        { height: "6 inch", weight: "241 g" },
        { height: "8 inch", weight: "319 g" },
      ],
      description: "A timeless devotional accent for your home, puja space, or thoughtful gifting. Four-armed Mother Lakshmi seated upon a blooming lotus flower, holding lotus blossoms and bestowing blessings.",
      image: "/products/maa-lakshmi.jpg",
      sourcePage: 3,
      code: "AT-HIN-LAK03",
      featured: false,
    },
    {
      id: "laddu-gopal",
      name: "Laddu Gopal",
      title: "Laddu Gopal",
      subtitle: "Infant Krishna with Makhan/Butter Ball",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "A timeless devotional accent for your home, puja space, or thoughtful gifting.",
      dimension: "3 inch, 6 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "104 g to 189 g",
      availableSizes: [
        { height: "3 inch", weight: "104 g" },
        { height: "6 inch", weight: "189 g" },
      ],
      description: "A timeless devotional accent for your home, puja space, or thoughtful gifting. Playful crawling Bala Krishna holding the sweet butter ball, adorned with peacock crest and sacred ornaments.",
      image: "/products/laddu-gopal.jpg",
      sourcePage: 6,
      code: "AT-HIN-GOP06",
      featured: false,
    },
    {
      id: "shivling",
      name: "Shivling",
      title: "Shivling",
      subtitle: "Sacred Shivalingam with Sheshnag & Nandi",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "A timeless devotional accent for your home, puja space, or thoughtful gifting.",
      dimension: "2 inch, 3 inch",
      material: "Polished Antique Brass (Lost-Wax Cast)",
      weight: "60 g to 96 g",
      availableSizes: [
        { height: "2 inch", weight: "60 g" },
        { height: "3 inch", weight: "96 g" },
      ],
      description: "A timeless devotional accent for your home, puja space, or thoughtful gifting. Sacred brass Shivalingam mounted upon a carved yoni base with protective Sheshnag cobra hood and faithful Nandi.",
      image: "/products/shivling.jpg",
      sourcePage: 7,
      code: "AT-HIN-SHI07",
      featured: false,
    },
    {
      id: "maa-saraswati",
      name: "Maa Saraswati",
      title: "Maa Saraswati",
      subtitle: "The Giver of Wisdom & Knowledge",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "The divine embodiment of wisdom, art and knowledge.",
      dimension: "3 inch, 6 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "109 g to 187 g",
      availableSizes: [
        { height: "3 inch", weight: "109 g" },
        { height: "6 inch", weight: "187 g" },
      ],
      description: "Maa Saraswati, the divine embodiment of wisdom, art and knowledge, inspires us to seek truth, bring clarity to our minds and light up our inner world.",
      image: "/products/maa-saraswati.jpg",
      sourcePage: 8,
      code: "AT-HIN-SAR08",
      featured: false,
    },
    {
      id: "lord-kubera",
      name: "Lord Kubera",
      title: "Lord Kubera",
      subtitle: "The Bestower of Prosperity & Abundance",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "The divine guardian of wealth, blessing prosperity and financial stability.",
      dimension: "2.5 inch, 3.25 inch, 4.25 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "95 g to 250 g",
      availableSizes: [
        { height: "2.5 inch", weight: "95 g" },
        { height: "3.25 inch", weight: "160 g" },
        { height: "4.25 inch", weight: "250 g" },
      ],
      description: "Lord Kubera, the divine guardian of wealth, blesses us with prosperity, financial stability and abundance, reminding us that true wealth lies in gratitude, balance and a generous heart.",
      image: "/products/lord-kubera.jpg",
      sourcePage: 9,
      code: "AT-HIN-KUB09",
      featured: true,
    },

    // -------------------------------------------------------------
    // BUDDHA STATUES (Pages 4, 5, 10)
    // -------------------------------------------------------------
    {
      id: "seated-buddha",
      name: "Seated Buddha",
      title: "Seated Buddha",
      subtitle: "Dhyana Mudra Meditative Contemplation",
      category: "buddha",
      categoryLabel: "Buddha Statues",
      tagline: "A timeless devotional accent for your home, puja space, or thoughtful gifting.",
      dimension: "4.5 inch, 6 inch, 8 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "186 g to 330 g",
      availableSizes: [
        { height: "4.5 inch", weight: "186 g" },
        { height: "6 inch", weight: "240 g" },
        { height: "8 inch", weight: "330 g" },
      ],
      description: "A timeless devotional accent for your home, puja space, or thoughtful gifting. Gautama Buddha seated in deep padmasana meditation upon an engraved rectangular pedestal with monastic robes.",
      image: "/products/seated-buddha.jpg",
      sourcePage: 4,
      code: "AT-BUD-SEA04",
      featured: false,
    },
    {
      id: "buddha-bodhi-tree",
      name: "Buddha under Bodhi Tree",
      title: "Buddha under Bodhi Tree",
      subtitle: "Enlightenment Tableau with Spreading Canopy",
      category: "buddha",
      categoryLabel: "Buddha Statues",
      tagline: "A timeless devotional accent for your home, puja space, or thoughtful gifting.",
      dimension: "6 inch, 8 inch, 12 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "249 g to 787 g",
      availableSizes: [
        { height: "6 inch", weight: "249 g" },
        { height: "8 inch", weight: "389 g" },
        { height: "12 inch", weight: "787 g" },
      ],
      description: "A timeless devotional accent for your home, puja space, or thoughtful gifting. Majestic sculpture of Buddha seated beneath the radiating foliage of the sacred Bodhi Tree adorned with perched songbirds.",
      image: "/products/buddha-bodhi-tree.jpg",
      sourcePage: 5,
      code: "AT-BUD-BOD05",
      featured: true,
    },
    {
      id: "lord-buddha",
      name: "Lord Buddha",
      title: "Lord Buddha",
      subtitle: "The Giver of Peace & Enlightenment",
      category: "buddha",
      categoryLabel: "Buddha Statues",
      tagline: "The divine embodiment of peace, inner calm and enlightenment.",
      dimension: "3 inch, 6 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "142 g to 322 g",
      availableSizes: [
        { height: "3 inch", weight: "142 g" },
        { height: "6 inch", weight: "322 g" },
      ],
      description: "Gautama Buddha, the divine embodiment of peace, inner calm and enlightenment, inspires us to seek truth, bring mindfulness to our lives, and light up our spiritual path.",
      image: "/products/lord-buddha.jpg",
      sourcePage: 10,
      code: "AT-BUD-PEA10",
      featured: false,
    },
  ],

  aboutContent: {
    heading: "ADVAITA TATTVA",
    subheading: "Antique Brass Idol Collection — A timeless devotional accent for your home, puja space, or thoughtful gifting.",
    leadParagraph: "ADVAITA TATTVA presents the official Antique Brass Idol Collection. Every idol is cast in solid brass with an authentic antique finish, offering a timeless devotional accent for your home, puja space, or thoughtful gifting.",
    craftPhilosophy: "Each piece in the collection is crafted in solid antique brass with careful attention to traditional iconography. From compact 2-inch personal shrines to prominent 12-inch statement idols, each item features verifiable heights and weights as documented in our official catalogue.",
    foundryHeritage: "Rooted in traditional brass metallurgy, each sculpture is hand-detailed to evoke serenity, balance, and sacred presence in residential sanctuaries and devotional spaces.",
    qualityCommitment: "Standard catalogued sizes range from 2 inches to 12 inches with recorded weights from 60 grams to 787 grams. Looking for a different size? Custom sizes are available on request.",
    pillars: [
      {
        title: "Official Catalogue Portfolio",
        description: "Authentic Buddha and Hindu deity icons with certified heights and weights matching the original 7-page brochure."
      },
      {
        title: "Solid Antique Brass",
        description: "Cast in heavy solid brass with rich, hand-detailed antique patina that deepens gracefully over time."
      },
      {
        title: "Custom Sizes on Request",
        description: "Standard catalogue heights from 2 to 12 inches, with custom bespoke proportions available on request."
      },
      {
        title: "Direct WhatsApp Service",
        description: "Personal assistance and enquiry support with prefilled product codes and brochure page references."
      }
    ]
  }
};
