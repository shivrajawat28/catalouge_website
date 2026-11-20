import fs from "fs";
import path from "path";
import { siteConfig, ProductItem } from "@/config/siteConfig";
import { videoGalleryConfig, GalleryVideoItem } from "@/config/videoGallery";

export interface CustomCategory {
  id: string; // e.g. "buddha", "hindu", "temple-bells"
  label: string; // e.g. "Buddha Statues", "Hindu Statues", "Temple Bells & Decor"
  description?: string;
  isCustom?: boolean;
}

export interface CatalogStoreData {
  categories: CustomCategory[];
  products: ProductItem[];
  videos: GalleryVideoItem[];
  updatedAt: string;
}

const DEFAULT_CATEGORIES: CustomCategory[] = [
  {
    id: "buddha",
    label: "Buddha Statues",
    description: "Authentic lost-wax antique brass Buddha sculptures extracted directly from the official Advaita Tattva brochure.",
    isCustom: false,
  },
  {
    id: "hindu",
    label: "Hindu Statues",
    description: "Sacred Hindu deities and devotional idols for home, puja space, and thoughtful gifting from the Advaita Tattva brochure.",
    isCustom: false,
  },
];

const DATA_FILE_PATH = path.join(process.cwd(), "data", "catalog-store.json");

// In-memory cache for fast SSR and serverless response
let memoryStore: CatalogStoreData | null = null;

function getInitialStore(): CatalogStoreData {
  return {
    categories: [...DEFAULT_CATEGORIES],
    products: [...siteConfig.products],
    videos: [...videoGalleryConfig.videos],
    updatedAt: new Date().toISOString(),
  };
}

export function loadCatalogStore(): CatalogStoreData {
  if (memoryStore) {
    return memoryStore;
  }

  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, "utf8");
      const parsed: CatalogStoreData = JSON.parse(raw);

      // Validate and ensure default categories exist
      const existingCategoryIds = new Set(parsed.categories.map((c) => c.id));
      for (const defCat of DEFAULT_CATEGORIES) {
        if (!existingCategoryIds.has(defCat.id)) {
          parsed.categories.unshift(defCat);
        }
      }

      // Ensure all base products from siteConfig are preserved if not already in store
      const existingProductIds = new Set(parsed.products.map((p) => p.id));
      for (const baseProd of siteConfig.products) {
        if (!existingProductIds.has(baseProd.id)) {
          parsed.products.push(baseProd);
        }
      }

      // Ensure all base videos from videoGalleryConfig are preserved
      const existingVideoIds = new Set(parsed.videos.map((v) => v.id));
      for (const baseVid of videoGalleryConfig.videos) {
        if (!existingVideoIds.has(baseVid.id)) {
          parsed.videos.push(baseVid);
        }
      }

      memoryStore = parsed;
      return memoryStore;
    }
  } catch (err) {
    console.warn("[catalogStore] Could not read catalog-store.json, using defaults:", err);
  }

  // Fallback to initial defaults
  memoryStore = getInitialStore();

  // Try to write file once
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(memoryStore, null, 2), "utf8");
  } catch (err) {
    console.warn("[catalogStore] Could not write initial catalog-store.json:", err);
  }

  return memoryStore;
}

export function saveCatalogStore(data: CatalogStoreData): boolean {
  data.updatedAt = new Date().toISOString();
  memoryStore = data;

  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.warn("[catalogStore] Write to file failed (in-memory preserved):", err);
    return false;
  }
}

// ---------------- Product Operations ----------------
export function getAllProducts(): ProductItem[] {
  const store = loadCatalogStore();
  return store.products;
}

export function addProduct(product: ProductItem): ProductItem {
  const store = loadCatalogStore();
  const index = store.products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    store.products[index] = product;
  } else {
    // Add to beginning of products list
    store.products.unshift(product);
  }
  saveCatalogStore(store);
  return product;
}

export function updateProduct(id: string, updates: Partial<ProductItem>): ProductItem | null {
  const store = loadCatalogStore();
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  store.products[index] = { ...store.products[index], ...updates };
  saveCatalogStore(store);
  return store.products[index];
}

export function deleteProduct(id: string): boolean {
  const store = loadCatalogStore();
  const initialLen = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  if (store.products.length !== initialLen) {
    saveCatalogStore(store);
    return true;
  }
  return false;
}

// ---------------- Category Operations ----------------
export function getAllCategories(): CustomCategory[] {
  const store = loadCatalogStore();
  return store.categories;
}

export function addCategory(category: { id: string; label: string; description?: string }): CustomCategory {
  const store = loadCatalogStore();
  const cleanId = category.id
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");

  const existing = store.categories.find((c) => c.id === cleanId);
  if (existing) {
    existing.label = category.label.trim();
    if (category.description) existing.description = category.description.trim();
    saveCatalogStore(store);
    return existing;
  }

  const newCat: CustomCategory = {
    id: cleanId,
    label: category.label.trim(),
    description: category.description?.trim(),
    isCustom: true,
  };
  store.categories.push(newCat);
  saveCatalogStore(store);
  return newCat;
}

export function deleteCategory(id: string): boolean {
  if (id === "buddha" || id === "hindu") {
    // Default categories cannot be deleted
    return false;
  }
  const store = loadCatalogStore();
  const initialLen = store.categories.length;
  store.categories = store.categories.filter((c) => c.id !== id);
  if (store.categories.length !== initialLen) {
    saveCatalogStore(store);
    return true;
  }
  return false;
}

// ---------------- Video Operations ----------------
export function getAllVideos(): GalleryVideoItem[] {
  const store = loadCatalogStore();
  return store.videos;
}

export function addVideo(video: GalleryVideoItem): GalleryVideoItem {
  const store = loadCatalogStore();
  const index = store.videos.findIndex((v) => v.id === video.id);
  if (index >= 0) {
    store.videos[index] = video;
  } else {
    store.videos.unshift(video);
  }
  saveCatalogStore(store);
  return video;
}

export function deleteVideo(id: string): boolean {
  const store = loadCatalogStore();
  const initialLen = store.videos.length;
  store.videos = store.videos.filter((v) => v.id !== id);
  if (store.videos.length !== initialLen) {
    saveCatalogStore(store);
    return true;
  }
  return false;
}

export function resetCatalogStore(): CatalogStoreData {
  const fresh = getInitialStore();
  saveCatalogStore(fresh);
  return fresh;
}
