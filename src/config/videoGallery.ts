export type VideoAspectRatio = "portrait" | "landscape" | "square" | "auto";

export interface GalleryVideoItem {
  /** Unique identifier used for React keys and DOM accessibility */
  id: string;
  /**
   * Filename inside /public/videos/gallery/ (e.g. "ganesha-showcase.mp4")
   * or a full site-relative path (e.g. "/videos/gallery/ganesha-showcase.mp4").
   */
  src: string;
  /** Optional display title rendered beneath the video frame */
  title?: string;
  /** Optional editorial caption/description rendered beneath the title */
  description?: string;
  /**
   * Optional poster image filename inside /public/videos/gallery/ (e.g. "ganesha-poster.jpg")
   * or a full site-relative path.
   */
  poster?: string;
  /**
   * Aspect ratio hint used to reserve card space before metadata loads (prevents layout shift).
   * Once video metadata loads, the card preserves the video's exact intrinsic dimensions.
   * Defaults to "auto".
   */
  aspectRatio?: VideoAspectRatio;
}

export interface VideoGalleryConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  uploadDirectory: string;
  videos: GalleryVideoItem[];
}

export const videoGalleryConfig: VideoGalleryConfig = {
  eyebrow: "Artisanal Films",
  title: "The Art in Motion",
  subtitle:
    "Experience the beauty, craftsmanship and timeless details of our handcrafted brass sculptures.",
  uploadDirectory: "/videos/gallery",

  /**
   * Register your gallery videos below after copying MP4 files into:
   * /Users/shivrajawat/Documents/catalouge_website/public/videos/gallery/
   *
   * Example entry:
   * {
   *   id: "ganesha-showcase",
   *   src: "ganesha-showcase.mp4",
   *   title: "Lord Ganesha — Lost-Wax Detail",
   *   description: "Intricate hand-finished antique patina and lotus pedestal carvings.",
   *   poster: "ganesha-poster.jpg",
   *   aspectRatio: "portrait", // "portrait" | "landscape" | "square" | "auto"
   * },
   */
  videos: [
    {
      id: "muchalinda-buddha-wax-brass",
      src: "WhatsApp Video 2026-11-10 at 17.14.54.mp4",
      title: "Muchalinda Buddha — Lost-Wax Prototype",
      description:
        "From sculptural wax master to cast antique brass, capturing fine Serpent canopy details.",
      poster: "posters/poster-01.jpg",
      aspectRatio: "portrait",
    },
    {
      id: "hanuman-chawki-plinth",
      src: "WhatsApp Video 2026-11-10 at 17.14.55.mp4",
      title: "Seated Lord Hanuman on Carved Plinth",
      description:
        "Hand-finished antique brass Hanuman with gada resting on an engraved chawki dais.",
      poster: "posters/poster-02.jpg",
      aspectRatio: "portrait",
    },
    {
      id: "elephant-diya-oil-lamp",
      src: "WhatsApp Video 2026-11-10 at 17.15.04.mp4",
      title: "Carved Elephant Diya Oil Lamps",
      description:
        "Pair of traditional brass elephant oil lamps with ornamental floral and temple motifs.",
      poster: "posters/poster-03.jpg",
      aspectRatio: "portrait",
    },
    {
      id: "jagannath-trio-brass",
      src: "WhatsApp Video 2026-11-10 at 17.15.11.mp4",
      title: "Lord Jagannath, Balabhadra & Subhadra Trio",
      description:
        "Sacred Puri triad in solid antique brass with crisp facial detailing and arched framing.",
      poster: "posters/poster-04.jpg",
      aspectRatio: "portrait",
    },
    {
      id: "nandi-ji-ornate-pedestal",
      src: "WhatsApp Video 2026-11-10 at 17.15.13.mp4",
      title: "Ornate Nandi Ji on Carved Square Dais",
      description:
        "Close inspection of saddle drapery, ceremonial bells, and traditional lost-wax surface patina.",
      poster: "posters/poster-05.jpg",
      aspectRatio: "portrait",
    },
    {
      id: "maa-durga-lion-showcase",
      src: "WhatsApp Video 2026-11-10 at 17.15.28.mp4",
      title: "Ten-Armed Maa Durga on Lion",
      description:
        "Studio showcase rotating a deeply sculpted antique brass Maa Durga murti.",
      poster: "posters/poster-06.jpg",
      aspectRatio: "portrait",
    },
    {
      id: "seated-goddess-silver-finish",
      src: "WhatsApp Video 2026-11-10 at 17.15.29.mp4",
      title: "Seated Goddess with Sugarcane Bow & Lotus",
      description:
        "360-degree view highlighting lotus petal carving, crown work, and silver-toned finish.",
      poster: "posters/poster-07.jpg",
      aspectRatio: "portrait",
    },
    {
      id: "workshop-idols-floor-lineup",
      src: "WhatsApp Video 2026-11-10 at 17.15.39 (1).mp4",
      title: "Workshop Lineup of Finished Brass Idols",
      description:
        "Artisan studio view across fresh cast batches of seated deities prepared for finishing.",
      poster: "posters/poster-08.jpg",
      aspectRatio: "portrait",
    },
    {
      id: "studio-kamadhenu-collection",
      src: "WhatsApp Video 2026-11-10 at 17.15.39.mp4",
      title: "Kamadhenu & Brass Murti Studio Arrangement",
      description:
        "Wide table overview featuring sacred Kamadhenu cow alongside classic antique brass idols.",
      poster: "posters/poster-09.jpg",
      aspectRatio: "landscape",
    },
    {
      id: "kurma-tortoise-yantra-plates",
      src: "WhatsApp Video 2026-11-10 at 17.15.40 (1).mp4",
      title: "Engraved Brass Kurma & Yantra Reliefs",
      description:
        "Hand-etched auspicious tortoise and geometric yantra reliefs in aged brass patina.",
      poster: "posters/poster-10.jpg",
      aspectRatio: "portrait",
    },
    {
      id: "lord-ganesha-mushak-chawki",
      src: "WhatsApp Video 2026-11-10 at 17.15.40 (2).mp4",
      title: "Lord Ganesha with Mushak on Carved Plinth",
      description:
        "Four-armed Vignaharta Ganesha resting peacefully on an ornate brass pedestal with Mushak.",
      poster: "posters/poster-11.jpg",
      aspectRatio: "portrait",
    },
    {
      id: "engraved-elephant-deities-display",
      src: "WhatsApp Video 2026-11-10 at 17.15.40.mp4",
      title: "Engraved Brass Elephant & Deities Display",
      description:
        "Detailed studio pan showing chased elephant trappings and multi-figure brass ensemble.",
      poster: "posters/poster-12.jpg",
      aspectRatio: "landscape",
    },
    {
      id: "sheshshayi-vishnu-graduated-sizes",
      src: "WhatsApp Video 2026-11-10 at 17.15.41.mp4",
      title: "Sheshshayi Lord Vishnu — Graduated Sizes",
      description:
        "Side-by-side studio comparison of brass sculptures across multiple heirloom scales.",
      poster: "posters/poster-13.jpg",
      aspectRatio: "landscape",
    },
    {
      id: "lost-wax-casting-quenching",
      src: "lost-wax-casting-quenching.mp4",
      title: "Lost-Wax Casting & Water Quenching",
      description:
        "Master artisan retrieving freshly cast antique brass idol from the cooling bath, revealing raw intricate bronze details.",
      poster: "posters/poster-14.jpg",
      aspectRatio: "portrait",
    },
  ],
};
