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
    hero: {
      eyebrow: string;
      brandName: string;
      tagline: string;
    };
    philosophy: {
      heading: string;
      paragraphs: string[];
    };
    nameMeaning: {
      heading: string;
      intro: string;
      advaita: {
        term: string;
        concept: string;
        description: string;
      };
      tattva: {
        term: string;
        concept: string;
        description: string;
      };
      synthesis: string;
      conclusion: string;
    };
    journey: {
      heading: string;
      paragraphs: string[];
      lostWaxHighlight: string;
    };
    approach: {
      heading: string;
      paragraphs: string[];
    };
    closingCta: {
      heading: string;
      supportingText: string;
    };
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
  
  // PDF Catalogue Asset Path (Configured location for official brochure PDF)
  cataloguePdfPath: "/catalogue/advaita-tattva-catalogue.pdf",

  // Curated Products List — 100% Extracted from Official Brochure PDF & Product Flyers
  products: [
    // -------------------------------------------------------------
    // BUDDHA STATUES (5 Items)
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
      code: "AT-BUD-04",
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
      code: "AT-BUD-05",
      featured: true,
    },
    {
      id: "buddha-in-hand",
      name: "Buddha in Hand",
      title: "Buddha in Hand",
      subtitle: "A Serene Symbol of Wisdom, Compassion & Inner Peace",
      category: "buddha",
      categoryLabel: "Buddha Statues",
      tagline: "A serene symbol of wisdom, compassion, and inner peace.",
      dimension: "6 inch, 8 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "442 g to 732 g",
      availableSizes: [
        { height: "6 inch", weight: "442 g" },
        { height: "8 inch", weight: "732 g" },
      ],
      description: "A serene symbol of wisdom, compassion, and inner peace. Delicate sculpture of Buddha seated gracefully within the open palm of the benevolent blessing hand.",
      image: "/products/buddha-in-hand.jpg",
      sourcePage: 15,
      code: "AT-BUD-15",
      featured: false,
    },
    {
      id: "twin-buddha",
      name: "Twin Seated Buddha Idols",
      title: "Twin Seated Buddha Idols",
      subtitle: "Peace, Mindfulness & Inner Harmony Pair",
      category: "buddha",
      categoryLabel: "Buddha Statues",
      tagline: "A serene expression of peace, mindfulness, and inner harmony for your home or meditation space.",
      dimension: "2 inch, 3 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "80 g to 104 g",
      availableSizes: [
        { height: "2 inch", weight: "80 g" },
        { height: "3 inch", weight: "104 g" },
      ],
      description: "A serene expression of peace, mindfulness, and inner harmony for your home or meditation space. Twin finely detailed brass Buddha idols in tranquil contemplation.",
      image: "/products/twin-buddha.jpg",
      sourcePage: 17,
      code: "AT-BUD-17",
      featured: false,
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

    // -------------------------------------------------------------
    // HINDU STATUES (19 Items)
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
      code: "AT-HIN-01",
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
      code: "AT-HIN-02",
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
      code: "AT-HIN-03",
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
      code: "AT-HIN-06",
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
      code: "AT-HIN-07",
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
      code: "AT-HIN-08",
      featured: false,
    },
    {
      id: "maa-lakshmi-seated",
      name: "Maa Lakshmi (Kamalasan)",
      title: "Maa Lakshmi (Kamalasan)",
      subtitle: "Kamalasan Seated Goddess of Grace & Fortune",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "A timeless devotional accent for your home, puja space, or thoughtful gifting.",
      dimension: "3 inch, 6 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "104 g to 180 g",
      availableSizes: [
        { height: "3 inch", weight: "104 g" },
        { height: "6 inch", weight: "180 g" },
      ],
      description: "A timeless devotional accent for your home, puja space, or thoughtful gifting. Graceful compact form of Mother Lakshmi seated in padmasana upon the blooming lotus throne.",
      image: "/products/maa-lakshmi-seated.jpg",
      sourcePage: 9,
      code: "AT-HIN-09",
      featured: false,
    },
    {
      id: "lord-hanuman",
      name: "Lord Hanuman",
      title: "Lord Hanuman",
      subtitle: "Sankat Mochan Mahabali Hanuman",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "A timeless devotional accent for your home, puja space, or thoughtful gifting.",
      dimension: "2 inch, 2.5 inch, 3 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "60 g to 200 g",
      availableSizes: [
        { height: "2 inch (Small)", weight: "60 g" },
        { height: "2.5 inch (Medium)", weight: "100 g" },
        { height: "3 inch (Large)", weight: "200 g" },
      ],
      description: "A timeless devotional accent for your home, puja space, or thoughtful gifting. Revered idol of Lord Hanuman embodying absolute devotion, spiritual strength, and protective grace.",
      image: "/products/lord-hanuman.jpg",
      sourcePage: 10,
      code: "AT-HIN-10",
      featured: false,
    },
    {
      id: "shiv-parivar",
      name: "Shiv Parivar",
      title: "Shiv Parivar",
      subtitle: "Lord Shiva, Mata Parvati, Ganesha & Kartikeya",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "A timeless devotional accent for your home, puja space, or thoughtful gifting.",
      dimension: "4 inch, 6 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "580 g to 900 g",
      availableSizes: [
        { height: "4 inch", weight: "580 g" },
        { height: "6 inch", weight: "900 g" },
      ],
      description: "A timeless devotional accent for your home, puja space, or thoughtful gifting. Holy ensemble of Lord Shiva, Goddess Parvati, baby Ganesha, and Kartikeya seated in divine familial unity.",
      image: "/products/shiv-parivar.jpg",
      sourcePage: 11,
      code: "AT-HIN-11",
      featured: true,
    },
    {
      id: "lakshmi-ganesha",
      name: "Maa Lakshmi & Lord Ganesha",
      title: "Maa Lakshmi & Lord Ganesha",
      subtitle: "Shubh Labh Classic Auspicious Pair",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "A timeless devotional accent for your home, puja space, or thoughtful gifting.",
      dimension: "3 inch, 6 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "400 g to 850 g",
      availableSizes: [
        { height: "3 inch", weight: "400 g" },
        { height: "6 inch", weight: "850 g" },
      ],
      description: "A timeless devotional accent for your home, puja space, or thoughtful gifting. Auspicious Shubh-Labh pairing of Mother Lakshmi and Lord Ganesha seated on traditional brass plinths.",
      image: "/products/lakshmi-ganesha.jpg",
      sourcePage: 12,
      code: "AT-HIN-12",
      featured: false,
    },
    {
      id: "lakshmi-ganesha-ornate",
      name: "Maa Lakshmi & Lord Ganesha (Ornate Arch)",
      title: "Maa Lakshmi & Lord Ganesha (Ornate Arch)",
      subtitle: "Ornate Prabhavali & Diya Auspicious Pair",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "A timeless devotional accent for your home, puja space, or thoughtful gifting.",
      dimension: "3 inch, 6 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "410 g to 867 g",
      availableSizes: [
        { height: "3 inch", weight: "410 g" },
        { height: "6 inch", weight: "867 g" },
      ],
      description: "A timeless devotional accent for your home, puja space, or thoughtful gifting. Ornate festive edition with integrated prabhavali halos and auspicious diya oil lamp motifs.",
      image: "/products/lakshmi-ganesha-ornate.jpg",
      sourcePage: 13,
      code: "AT-HIN-13",
      featured: false,
    },
    {
      id: "krishna-cow",
      name: "Lord Krishna with Cow",
      title: "Lord Krishna with Cow",
      subtitle: "A Divine Symbol of Love, Compassion & Harmony",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "A divine symbol of love, compassion, and eternal harmony.",
      dimension: "4 inch, 9 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "242 g to 700 g",
      availableSizes: [
        { height: "4 inch", weight: "242 g" },
        { height: "9 inch", weight: "700 g" },
      ],
      description: "A divine symbol of love, compassion, and eternal harmony. Graceful tribhanga posture of Lord Krishna playing the bansuri flute with Kamadhenu cow listening in adoration.",
      image: "/products/krishna-cow.jpg",
      sourcePage: 14,
      code: "AT-HIN-14",
      featured: true,
    },
    {
      id: "panchmukhi-hanuman",
      name: "Panchmukhi Hanuman Ji",
      title: "Panchmukhi Hanuman Ji",
      subtitle: "A Divine Symbol of Strength, Devotion & Protection",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "A divine symbol of strength, devotion, courage, and protection.",
      dimension: "6 inch, 9 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "552 g to 900 g",
      availableSizes: [
        { height: "6 inch", weight: "552 g" },
        { height: "9 inch", weight: "900 g" },
      ],
      description: "A divine symbol of strength, devotion, courage, and protection. Five-faced manifestation of Lord Hanuman bearing traditional celestial armaments and victorious posture.",
      image: "/products/panchmukhi-hanuman.jpg",
      sourcePage: 16,
      code: "AT-HIN-16",
      featured: false,
    },
    {
      id: "standing-hanuman",
      name: "Standing Hanuman Ji",
      title: "Standing Hanuman Ji",
      subtitle: "Heroic Stance with Gada & Sanjeevani Mountain",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "A divine symbol of strength, devotion, courage, and protection.",
      dimension: "6 inch, 9 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "604 g to 962 g",
      availableSizes: [
        { height: "6 inch", weight: "604 g" },
        { height: "9 inch", weight: "962 g" },
      ],
      description: "A divine symbol of strength, devotion, courage, and protection. Majestic standing stance of Lord Hanuman holding his mighty mace (gada) and lifting the divine Sanjeevani mountain.",
      image: "/products/standing-hanuman.jpg",
      sourcePage: 18,
      code: "AT-HIN-18",
      featured: false,
    },
    {
      id: "lord-shiva",
      name: "Lord Shiva",
      title: "Lord Shiva",
      subtitle: "A Divine Symbol of Meditation, Strength & Peace",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "A divine symbol of meditation, strength, and inner peace.",
      dimension: "6 inch, 9 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "502 g to 852 g",
      availableSizes: [
        { height: "6 inch", weight: "502 g" },
        { height: "9 inch", weight: "852 g" },
      ],
      description: "A divine symbol of meditation, strength, and inner peace. Contemplative Lord Shiva seated in deep samadhi meditation with crescent moon, trishula, and damru.",
      image: "/products/lord-shiva.jpg",
      sourcePage: 19,
      code: "AT-HIN-19",
      featured: false,
    },
    {
      id: "lord-rama",
      name: "Lord Rama",
      title: "Lord Rama",
      subtitle: "A Divine Symbol of Virtue, Courage & Righteousness",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "A divine symbol of virtue, courage, and righteousness.",
      dimension: "6 inch, 9 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "599 g to 942 g",
      availableSizes: [
        { height: "6 inch", weight: "599 g" },
        { height: "9 inch", weight: "942 g" },
      ],
      description: "A divine symbol of virtue, courage, and righteousness. Maryada Purushottam Lord Rama poised with the Kodanda bow, representing dharma and noble grace.",
      image: "/products/lord-rama.jpg",
      sourcePage: 20,
      code: "AT-HIN-20",
      featured: false,
    },
    {
      id: "nandi-ji",
      name: "Nandi Ji",
      title: "Nandi Ji",
      subtitle: "A Sacred Symbol of Devotion, Strength & Faith",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "A sacred symbol of devotion, strength, and unwavering faith.",
      dimension: "3 inch, 4 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "142 g to 202 g",
      availableSizes: [
        { height: "3 inch", weight: "142 g" },
        { height: "4 inch", weight: "202 g" },
      ],
      description: "A sacred symbol of devotion, strength, and unwavering faith. Seated sacred bull Nandi adorned with festive bells, saddle drapery, and attentive devotion toward Lord Shiva.",
      image: "/products/nandi-ji.jpg",
      sourcePage: 21,
      code: "AT-HIN-21",
      featured: false,
    },
    {
      id: "tara-devi",
      name: "Goddess Idol (Tara Devi Ji)",
      title: "Goddess Idol (Tara Devi Ji)",
      subtitle: "Grace, Wisdom & Spiritual Abundance",
      category: "hindu",
      categoryLabel: "Hindu Statues",
      tagline: "A divine symbol of grace, wisdom, and spiritual abundance.",
      dimension: "6 inch, 8 inch",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "592 g to 728 g",
      availableSizes: [
        { height: "6 inch", weight: "592 g" },
        { height: "8 inch", weight: "728 g" },
      ],
      description: "A divine symbol of grace, wisdom, and spiritual abundance. Intricately rendered goddess idol representing Tara Devi, embodying compassionate deliverance and motherly protection.",
      image: "/products/tara-devi.jpg",
      sourcePage: 22,
      code: "AT-HIN-22",
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
  ],

  aboutContent: {
    hero: {
      eyebrow: "ABOUT US",
      brandName: "Advaita Tattva",
      tagline: "Celebrating Indian Heritage Through Philosophy, Craftsmanship & Meaningful Design.",
    },
    philosophy: {
      heading: "Our Philosophy",
      paragraphs: [
        "At Advaita Tattva, we believe that true artistry goes beyond what the eyes can see. It carries the depth of culture, the wisdom of tradition and the meaning behind every creation.",
        "Inspired by the timeless philosophy of ancient India and the richness of its artistic heritage, Advaita Tattva is an Indian heritage and spiritual craftsmanship brand dedicated to bringing traditional artistry into the modern world.",
        "Our vision is to create a meaningful connection between India's cultural roots and contemporary living — celebrating craftsmanship not merely as a skill, but as an expression of identity, devotion and timeless beauty.",
        "We aspire to share the richness of Indian craftsmanship with the world, making its artistic and spiritual significance accessible to generations across cultures and boundaries.",
      ],
    },
    nameMeaning: {
      heading: "THE MEANING BEHIND OUR NAME",
      intro: "The name Advaita Tattva was chosen with a purpose. We wanted an identity that carried a deeper meaning — one that reflected the spiritual philosophy of India and the material artistry behind our creations.",
      advaita: {
        term: "ADVAITA",
        concept: "Ancient Indian philosophical concept meaning \"not two\" or \"one without a second.\"",
        description: "Advaita is an ancient Indian philosophical concept meaning \"not two\" or \"one without a second.\" It represents the understanding that beneath the diversity of existence lies one unified reality. In Indian spiritual traditions, this philosophy also inspires the understanding of the divine as one, expressed through many forms and manifestations.",
      },
      tattva: {
        term: "TATTVA",
        concept: "A Sanskrit word associated with essence, fundamental principles and the underlying nature of things.",
        description: "Tattva is a Sanskrit word associated with essence, fundamental principles and the underlying nature of things. It reflects our appreciation for the material, artistic and creative elements that come together in traditional craftsmanship.",
      },
      synthesis: "Together, the two words represent a connection between spiritual thought and physical creation — between the eternal wisdom of India and the artistry through which its cultural expressions take form.",
      conclusion: "For us, Advaita Tattva is more than a name. It is the philosophy that inspires our identity and the meaning behind our journey.",
    },
    journey: {
      heading: "OUR JOURNEY: ROOTED IN INDIAN CRAFTSMANSHIP",
      paragraphs: [
        "Our journey began with an existing foundation in brass idol manufacturing and trading, built around an appreciation for the skill and dedication involved in traditional Indian metal craftsmanship.",
        "Over time, we wanted to take this journey further. We envisioned building a distinct brand identity, strengthening our presence in the digital world and introducing the beauty of Indian spiritual art and craftsmanship to a wider audience.",
        "This vision gave rise to Advaita Tattva.",
        "An important part of our manufacturing journey has been the adoption of the traditional lost-wax casting technique. Compared with conventional handmade casting methods, which can require considerable time and skilled labour, this technique offers opportunities for refined finishing, intricate detailing and comparatively lighter creations.",
        "We see craftsmanship as more than the process of making something. It is the expression of generations of artistic knowledge, patience and creativity.",
        "Our motivation is to give this richness of Indian craftsmanship greater recognition and a meaningful place in the modern global landscape.",
      ],
      lostWaxHighlight: "An important part of our manufacturing journey has been the adoption of the traditional lost-wax casting technique. Compared with conventional handmade casting methods, which can require considerable time and skilled labour, this technique offers opportunities for refined finishing, intricate detailing and comparatively lighter creations.",
    },
    approach: {
      heading: "OUR APPROACH: TRADITION MEETS MODERN LIVING",
      paragraphs: [
        "We believe that heritage should not remain confined to the past. It deserves to evolve, find new expressions and become part of contemporary life.",
        "At Advaita Tattva, we celebrate traditional Indian artistic forms while embracing the possibilities of modern manufacturing and design.",
        "Our creations are inspired by India's spiritual and cultural heritage, bringing together traditional aesthetics, detailed craftsmanship and a sense of timeless elegance.",
        "We believe that meaningful design is not simply about appearance. It is about creating something that carries a story, reflects cultural identity and holds lasting significance for the people who experience it.",
        "Through our work, we aim to make Indian spiritual art a meaningful part of modern homes, personal spaces and everyday living.",
      ],
    },
    closingCta: {
      heading: "Discover the Art of Indian Heritage",
      supportingText: "Explore our collection of handcrafted brass sculptures and discover the meaning behind every creation.",
    },
  },
};
