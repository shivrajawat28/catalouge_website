"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Layers,
  Video,
  Plus,
  Trash2,
  ExternalLink,
  LogOut,
  Upload,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  X,
  Eye,
  RefreshCw,
} from "lucide-react";
import { ProductItem, ProductSizeOption } from "@/config/siteConfig";
import { GalleryVideoItem } from "@/config/videoGallery";
import { CustomCategory } from "@/lib/catalogStore";

export default function AdminDashboardPage() {
  const router = useRouter();

  // Auth state
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<string>("");

  // Data state
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "videos">("products");
  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [videos, setVideos] = useState<GalleryVideoItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Filters
  const [searchProductQuery, setSearchProductQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Notifications
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Product Form State
  const [productForm, setProductForm] = useState<{
    id?: string;
    name: string;
    subtitle: string;
    tagline: string;
    category: string;
    categoryLabel: string;
    dimension: string;
    material: string;
    weight: string;
    availableSizes: ProductSizeOption[];
    description: string;
    image: string;
    featured: boolean;
  }>({
    name: "",
    subtitle: "Antique Brass Idol",
    tagline: "A timeless symbol of sacred artistry and devotion.",
    category: "hindu",
    categoryLabel: "Hindu Statues",
    dimension: "Available in multiple sizes",
    material: "Solid Antique Brass (Lost-Wax Cast)",
    weight: "Multiple weight tiers",
    availableSizes: [
      { height: "4 inch", weight: "230 g" },
      { height: "6 inch", weight: "440 g" },
    ],
    description: "",
    image: "",
    featured: false,
  });

  const [uploadingProductImage, setUploadingProductImage] = useState(false);
  const productImageInputRef = useRef<HTMLInputElement>(null);

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    id: "",
    label: "",
    description: "",
  });

  // Video Form State
  const [videoForm, setVideoForm] = useState<{
    id?: string;
    src: string;
    title: string;
    description: string;
    poster: string;
    aspectRatio: "portrait" | "landscape" | "square" | "auto";
  }>({
    src: "",
    title: "",
    description: "",
    poster: "",
    aspectRatio: "portrait",
  });
  const [uploadingVideoFile, setUploadingVideoFile] = useState(false);
  const [uploadingPosterFile, setUploadingPosterFile] = useState(false);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const posterFileInputRef = useRef<HTMLInputElement>(null);

  const showFeedback = useCallback((type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  }, []);

  // Load all catalog data
  const loadAllData = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch("/api/catalog");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
        setProducts(data.products || []);
        setVideos(data.videos || []);
      }
    } catch {
      showFeedback("error", "Failed to load catalog data");
    } finally {
      setLoadingData(false);
    }
  }, [showFeedback]);

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/session");
        const data = await res.json();
        if (!data.authenticated) {
          router.push("/admin/login");
        } else {
          setCurrentUser(data.username || "Admin");
          setCheckingAuth(false);
          loadAllData();
        }
      } catch {
        router.push("/admin/login");
      }
    }
    checkAuth();
  }, [router, loadAllData]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (e) {
      console.error(e);
      router.push("/admin/login");
    }
  };

  // Upload helper
  async function uploadFile(file: File, folder: "products" | "videos" | "posters"): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Upload failed");
    }
    return data.url;
  }

  // Handle Product Image Upload
  const handleProductImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProductImage(true);
    try {
      const url = await uploadFile(file, "products");
      setProductForm((prev) => ({ ...prev, image: url }));
      showFeedback("success", "Product image uploaded successfully!");
    } catch (err: unknown) {
      showFeedback("error", err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploadingProductImage(false);
    }
  };

  // Handle Video Upload
  const handleVideoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideoFile(true);
    try {
      const url = await uploadFile(file, "videos");
      setVideoForm((prev) => ({ ...prev, src: url }));
      showFeedback("success", "Video file uploaded successfully!");
    } catch (err: unknown) {
      showFeedback("error", err instanceof Error ? err.message : "Video upload failed");
    } finally {
      setUploadingVideoFile(false);
    }
  };

  // Handle Poster Upload
  const handlePosterFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPosterFile(true);
    try {
      const url = await uploadFile(file, "posters");
      setVideoForm((prev) => ({ ...prev, poster: url }));
      showFeedback("success", "Poster image uploaded successfully!");
    } catch (err: unknown) {
      showFeedback("error", err instanceof Error ? err.message : "Poster upload failed");
    } finally {
      setUploadingPosterFile(false);
    }
  };

  // Handle Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.image || !productForm.category) {
      showFeedback("error", "Name, category, and image are required");
      return;
    }

    try {
      // Find category label
      const catObj = categories.find((c) => c.id === productForm.category);
      const catLabel = catObj ? catObj.label : productForm.categoryLabel || "Collection Item";

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          categoryLabel: catLabel,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      showFeedback("success", `Product "${productForm.name}" saved successfully!`);
      setIsProductModalOpen(false);
      resetProductForm();
      loadAllData();
    } catch (err: unknown) {
      showFeedback("error", err instanceof Error ? err.message : "Failed to save product");
    }
  };

  // Handle Product Delete
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      showFeedback("success", `Product "${name}" deleted`);
      loadAllData();
    } catch (err: unknown) {
      showFeedback("error", err instanceof Error ? err.message : "Delete failed");
    }
  };

  // Handle Category Save
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.label) {
      showFeedback("error", "Category name is required");
      return;
    }

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add category");

      showFeedback("success", `Category "${data.category.label}" created!`);
      setIsCategoryModalOpen(false);
      setCategoryForm({ id: "", label: "", description: "" });
      loadAllData();
    } catch (err: unknown) {
      showFeedback("error", err instanceof Error ? err.message : "Failed to save category");
    }
  };

  // Handle Category Delete
  const handleDeleteCategory = async (id: string, label: string) => {
    if (id === "buddha" || id === "hindu") {
      alert("Default categories (Buddha and Hindu Statues) cannot be deleted.");
      return;
    }
    if (!confirm(`Are you sure you want to delete category "${label}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete category");

      showFeedback("success", `Category "${label}" removed`);
      loadAllData();
    } catch (err: unknown) {
      showFeedback("error", err instanceof Error ? err.message : "Delete failed");
    }
  };

  // Handle Video Save
  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.src) {
      showFeedback("error", "Video file or URL is required");
      return;
    }

    try {
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(videoForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add video");

      showFeedback("success", `Video "${videoForm.title || "Film"}" added to gallery!`);
      setIsVideoModalOpen(false);
      resetVideoForm();
      loadAllData();
    } catch (err: unknown) {
      showFeedback("error", err instanceof Error ? err.message : "Failed to save video");
    }
  };

  // Handle Video Delete
  const handleDeleteVideo = async (id: string, title?: string) => {
    if (!confirm(`Are you sure you want to delete video "${title || id}"?`)) return;

    try {
      const res = await fetch(`/api/admin/videos?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete video");

      showFeedback("success", "Video deleted from gallery");
      loadAllData();
    } catch (err: unknown) {
      showFeedback("error", err instanceof Error ? err.message : "Delete failed");
    }
  };

  // Reset forms
  function resetProductForm() {
    setProductForm({
      name: "",
      subtitle: "Antique Brass Idol",
      tagline: "A timeless symbol of sacred artistry and devotion.",
      category: categories[0]?.id || "hindu",
      categoryLabel: categories[0]?.label || "Hindu Statues",
      dimension: "Available in multiple sizes",
      material: "Solid Antique Brass (Lost-Wax Cast)",
      weight: "Multiple weight tiers",
      availableSizes: [
        { height: "4 inch", weight: "230 g" },
        { height: "6 inch", weight: "440 g" },
      ],
      description: "",
      image: "",
      featured: false,
    });
  }

  function resetVideoForm() {
    setVideoForm({
      src: "",
      title: "",
      description: "",
      poster: "",
      aspectRatio: "portrait",
    });
  }

  // Dynamic size rows
  const addSizeRow = () => {
    setProductForm((prev) => ({
      ...prev,
      availableSizes: [...prev.availableSizes, { height: "", weight: "" }],
    }));
  };

  const removeSizeRow = (idx: number) => {
    setProductForm((prev) => ({
      ...prev,
      availableSizes: prev.availableSizes.filter((_, i) => i !== idx),
    }));
  };

  const updateSizeRow = (idx: number, field: "height" | "weight", value: string) => {
    setProductForm((prev) => {
      const updated = [...prev.availableSizes];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, availableSizes: updated };
    });
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            categories,
            products,
            videos,
            exportedAt: new Date().toISOString(),
          },
          null,
          2
        )
      );
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `advaita-tattva-catalog-${timestamp}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showFeedback("success", "Catalog data exported to JSON!");
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#B38A38] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#785A1D] tracking-wider uppercase">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Filtered products
  const displayedProducts = products.filter((p) => {
    const matchesCat = filterCategory === "all" || p.category === filterCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
      (p.code && p.code.toLowerCase().includes(searchProductQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col text-[#1C1917]">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E7E0D4] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/advaita-tattva-logo.jpg"
              alt="Advaita Tattva"
              width={40}
              height={40}
              className="h-10 w-10 object-contain rounded-lg border border-[#E7E0D4]"
            />
            <div>
              <span className="font-serif text-sm sm:text-base font-bold tracking-wider uppercase text-[#1C1917]">
                Advaita Tattva
              </span>
              <span className="ml-2 text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-[#B38A38]/10 text-[#785A1D] border border-[#B38A38]/30">
                Admin Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-[#6E655E] mr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Signed in as <strong>{currentUser}</strong></span>
            </div>

            <Link
              href="/products"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E7E0D4] bg-[#FAF8F5] hover:bg-white text-xs text-[#44403C] hover:text-[#1C1917] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#B38A38]" />
              <span className="hidden sm:inline">Live Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1917] hover:bg-red-700 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between border-t border-[#F2ECE4]">
          <nav className="flex space-x-1 sm:space-x-4">
            <button
              onClick={() => setActiveTab("products")}
              className={`py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "products"
                  ? "border-[#B38A38] text-[#1C1917]"
                  : "border-transparent text-[#6E655E] hover:text-[#1C1917]"
              }`}
            >
              <Package className="w-4 h-4 text-[#B38A38]" />
              <span>Products</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-[#FAF8F5] border border-[#E7E0D4] rounded-full text-[#785A1D]">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "categories"
                  ? "border-[#B38A38] text-[#1C1917]"
                  : "border-transparent text-[#6E655E] hover:text-[#1C1917]"
              }`}
            >
              <Layers className="w-4 h-4 text-[#B38A38]" />
              <span>Categories</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-[#FAF8F5] border border-[#E7E0D4] rounded-full text-[#785A1D]">
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("videos")}
              className={`py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "videos"
                  ? "border-[#B38A38] text-[#1C1917]"
                  : "border-transparent text-[#6E655E] hover:text-[#1C1917]"
              }`}
            >
              <Video className="w-4 h-4 text-[#B38A38]" />
              <span>Videos</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-[#FAF8F5] border border-[#E7E0D4] rounded-full text-[#785A1D]">
                {videos.length}
              </span>
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              title="Download catalog backup JSON"
              className="inline-flex items-center gap-1 text-[11px] text-[#785A1D] hover:text-[#1C1917] px-2.5 py-1.5 rounded border border-[#E7E0D4] bg-[#FAF8F5] hover:bg-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            <button
              onClick={loadAllData}
              title="Refresh catalog data"
              className="p-1.5 text-[#6E655E] hover:text-[#1C1917] rounded hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Floating feedback message */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2 text-xs font-medium animate-in slide-in-from-bottom duration-200 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ============================================================== */}
        {/* TAB 1: PRODUCTS                                                */}
        {/* ============================================================== */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E7E0D4] shadow-xs">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative min-w-[220px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                  <input
                    type="search"
                    placeholder="Search products by title or code..."
                    value={searchProductQuery}
                    onChange={(e) => setSearchProductQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#D8CCBD] bg-[#FAF8F5] text-xs text-[#1C1917] focus:outline-none focus:border-[#B38A38]"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-1.5 text-xs text-[#6E655E]">
                  <Filter className="w-3.5 h-3.5 text-[#B38A38]" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    aria-label="Filter products by category"
                    className="py-2 px-3 rounded-lg border border-[#D8CCBD] bg-[#FAF8F5] text-xs text-[#1C1917] focus:outline-none focus:border-[#B38A38]"
                  >
                    <option value="all">All Categories ({products.length})</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label} ({products.filter((p) => p.category === c.id).length})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Add Product Button */}
              <button
                onClick={() => {
                  resetProductForm();
                  setIsProductModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#1C1917] hover:bg-[#B38A38] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-[#E7E0D4] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
                >
                  <div className="relative aspect-3/4 bg-[#FAF8F5] border-b border-[#E7E0D4] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    />
                    {p.featured && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#B38A38] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                        Featured
                      </span>
                    )}
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px]">
                      {p.categoryLabel}
                    </span>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-sm font-bold text-[#1C1917] line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-[#6E655E] line-clamp-1 mt-0.5">
                        {p.subtitle}
                      </p>
                      <div className="mt-2 text-[11px] text-[#785A1D]">
                        <span>{p.availableSizes?.length || 0} size tier(s)</span>
                        {p.code && <span className="ml-2 text-[#A8A29E]">#{p.code}</span>}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#F2ECE4] flex items-center justify-between">
                      <Link
                        href={`/products?category=${p.category}`}
                        target="_blank"
                        className="text-[11px] text-[#785A1D] hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </Link>

                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {displayedProducts.length === 0 && (
              <div className="bg-white p-12 text-center rounded-xl border border-[#E7E0D4]">
                <Package className="w-10 h-10 text-[#A8A29E] mx-auto mb-3" />
                <h4 className="font-serif text-base font-semibold text-[#1C1917]">No products found</h4>
                <p className="text-xs text-[#6E655E] mt-1">
                  Try adjusting your search query or selected category.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: CATEGORIES                                              */}
        {/* ============================================================== */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#E7E0D4] shadow-xs">
              <div>
                <h2 className="font-serif text-base font-bold text-[#1C1917]">
                  Catalogue Categories
                </h2>
                <p className="text-xs text-[#6E655E] mt-0.5">
                  Manage standard and custom categories. All active categories appear in the public catalogue filter.
                </p>
              </div>

              <button
                onClick={() => {
                  setCategoryForm({ id: "", label: "", description: "" });
                  setIsCategoryModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1C1917] hover:bg-[#B38A38] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => {
                const count = products.filter((p) => p.category === c.id).length;
                const isDefault = c.id === "buddha" || c.id === "hindu";

                return (
                  <div
                    key={c.id}
                    className="bg-white p-5 rounded-xl border border-[#E7E0D4] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif text-base font-bold text-[#1C1917]">
                          {c.label}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E7E0D4] text-[#785A1D]">
                          {count} Product{count !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <p className="text-xs text-[#6E655E] leading-relaxed">
                        {c.description || "No description provided."}
                      </p>
                      <div className="mt-3 text-[11px] text-[#A8A29E] font-mono">
                        ID: {c.id}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#F2ECE4] flex items-center justify-between">
                      <span className="text-[10px] text-[#6E655E] uppercase tracking-wider font-semibold">
                        {isDefault ? "Default Brochure Category" : "Custom Category"}
                      </span>

                      {!isDefault && (
                        <button
                          onClick={() => handleDeleteCategory(c.id, c.label)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: VIDEOS                                                  */}
        {/* ============================================================== */}
        {activeTab === "videos" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E7E0D4] shadow-xs">
              <div>
                <h2 className="font-serif text-base font-bold text-[#1C1917]">
                  The Art in Motion — Video Gallery
                </h2>
                <p className="text-xs text-[#6E655E] mt-0.5">
                  Manage the swipeable artisanal film carousel on the homepage.
                </p>
              </div>

              <button
                onClick={() => {
                  resetVideoForm();
                  setIsVideoModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#1C1917] hover:bg-[#B38A38] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Video</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {videos.map((v, i) => (
                <div
                  key={v.id}
                  className="bg-white rounded-xl border border-[#E7E0D4] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="relative aspect-9/16 bg-black flex items-center justify-center overflow-hidden">
                    <video
                      src={
                        v.src.startsWith("/") || v.src.startsWith("http")
                          ? v.src
                          : `/videos/gallery/${v.src}`
                      }
                      poster={
                        v.poster
                          ? v.poster.startsWith("/") || v.poster.startsWith("http")
                            ? v.poster
                            : `/videos/gallery/${v.poster}`
                          : undefined
                      }
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                      #{i + 1}
                    </span>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-xs font-bold text-[#1C1917] line-clamp-1">
                        {v.title || "Artisanal Video"}
                      </h4>
                      <p className="text-[11px] text-[#6E655E] line-clamp-2 mt-1">
                        {v.description || "Antique brass craftsmanship in motion."}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#F2ECE4] flex items-center justify-between">
                      <span className="text-[10px] text-[#785A1D] uppercase tracking-wider font-semibold">
                        {v.aspectRatio || "portrait"}
                      </span>

                      <button
                        onClick={() => handleDeleteVideo(v.id, v.title)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* MODAL: ADD PRODUCT                                             */}
      {/* ============================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E7E0D4] shadow-2xl max-w-2xl w-full my-8 overflow-hidden relative">
            <div className="px-6 py-4 border-b border-[#E7E0D4] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#B38A38]" />
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  Add New Product to Catalogue
                </h3>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-[#6E655E] hover:text-[#1C1917] p-1 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Product Image Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-2">
                  Product Image *
                </label>
                <div className="flex items-center gap-4">
                  {productForm.image ? (
                    <div className="relative w-24 h-28 rounded-xl border border-[#E7E0D4] bg-[#FAF8F5] overflow-hidden shrink-0">
                      <Image
                        src={productForm.image}
                        alt="Product preview"
                        fill
                        className="object-contain p-2"
                      />
                      <button
                        type="button"
                        onClick={() => setProductForm((p) => ({ ...p, image: "" }))}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-xs cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => productImageInputRef.current?.click()}
                      className="w-24 h-28 rounded-xl border-2 border-dashed border-[#D8CCBD] hover:border-[#B38A38] bg-[#FAF8F5] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors p-2 text-center"
                    >
                      <Upload className="w-5 h-5 text-[#B38A38]" />
                      <span className="text-[10px] text-[#6E655E]">
                        {uploadingProductImage ? "Uploading..." : "Upload Photo"}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5">
                    <input
                      ref={productImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => productImageInputRef.current?.click()}
                      disabled={uploadingProductImage}
                      className="px-3 py-1.5 rounded-lg border border-[#D8CCBD] bg-[#FAF8F5] hover:bg-white text-xs font-medium text-[#1C1917] transition-colors cursor-pointer"
                    >
                      {uploadingProductImage ? "Uploading..." : "Select Image from Device"}
                    </button>
                    <p className="text-[11px] text-[#A8A29E]">
                      Or paste an existing image URL or public path below:
                    </p>
                    <input
                      type="text"
                      placeholder="/images/products/my-statue.jpg"
                      value={productForm.image}
                      onChange={(e) => setProductForm((p) => ({ ...p, image: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D8CCBD] text-xs text-[#1C1917]"
                    />
                  </div>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    Statue Name / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radha Krishna"
                    value={productForm.name}
                    onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8CCBD] text-xs text-[#1C1917] focus:outline-none focus:border-[#B38A38]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Antique Brass Idol"
                    value={productForm.subtitle}
                    onChange={(e) => setProductForm((p) => ({ ...p, subtitle: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8CCBD] text-xs text-[#1C1917] focus:outline-none focus:border-[#B38A38]"
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C]">
                    Category *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="text-[11px] text-[#785A1D] hover:underline"
                  >
                    + Create New Category
                  </button>
                </div>
                <select
                  value={productForm.category}
                  onChange={(e) => {
                    const selCat = categories.find((c) => c.id === e.target.value);
                    setProductForm((p) => ({
                      ...p,
                      category: e.target.value,
                      categoryLabel: selCat ? selCat.label : p.categoryLabel,
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CCBD] text-xs text-[#1C1917] focus:outline-none focus:border-[#B38A38]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tagline / Symbolic meaning */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Tagline / Symbolism
                </label>
                <input
                  type="text"
                  placeholder="e.g. A timeless symbol of divine love, devotion, and harmony."
                  value={productForm.tagline}
                  onChange={(e) => setProductForm((p) => ({ ...p, tagline: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CCBD] text-xs text-[#1C1917] focus:outline-none focus:border-[#B38A38]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Full Description & Artisanal Story
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the posture, devotional significance, casting details..."
                  value={productForm.description}
                  onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CCBD] text-xs text-[#1C1917] focus:outline-none focus:border-[#B38A38]"
                />
              </div>

              {/* Sizes and Weights Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C]">
                    Sizes & Weights Table
                  </label>
                  <button
                    type="button"
                    onClick={addSizeRow}
                    className="text-[11px] text-[#785A1D] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Size Row</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {productForm.availableSizes.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Height (e.g. 4 inch)"
                        value={row.height}
                        onChange={(e) => updateSizeRow(idx, "height", e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-[#D8CCBD] text-xs text-[#1C1917]"
                      />
                      <input
                        type="text"
                        placeholder="Weight (e.g. 230 g)"
                        value={row.weight}
                        onChange={(e) => updateSizeRow(idx, "weight", e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-[#D8CCBD] text-xs text-[#1C1917]"
                      />
                      {productForm.availableSizes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSizeRow(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="featured-check"
                  type="checkbox"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm((p) => ({ ...p, featured: e.target.checked }))}
                  className="rounded border-[#D8CCBD] text-[#B38A38] focus:ring-[#B38A38]"
                />
                <label htmlFor="featured-check" className="text-xs text-[#44403C] font-medium cursor-pointer">
                  Feature this product on homepage highlights
                </label>
              </div>

              <div className="pt-4 border-t border-[#E7E0D4] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#D8CCBD] text-xs font-medium text-[#44403C] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#1C1917] hover:bg-[#B38A38] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CREATE CATEGORY                                         */}
      {/* ============================================================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E7E0D4] shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E7E0D4] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#B38A38]" />
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  Create New Category
                </h3>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-[#6E655E] hover:text-[#1C1917] p-1 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Temple Bells & Decor"
                  value={categoryForm.label}
                  onChange={(e) => {
                    const label = e.target.value;
                    const autoId = label
                      .toLowerCase()
                      .trim()
                      .replace(/[^a-z0-9-]/g, "-")
                      .replace(/-+/g, "-");
                    setCategoryForm({ ...categoryForm, label, id: autoId });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CCBD] text-xs text-[#1C1917] focus:outline-none focus:border-[#B38A38]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Category Identifier (Slug)
                </label>
                <input
                  type="text"
                  placeholder="e.g. temple-bells"
                  value={categoryForm.id}
                  onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CCBD] text-xs text-[#1C1917] font-mono focus:outline-none focus:border-[#B38A38]"
                />
                <span className="text-[10px] text-[#A8A29E] mt-1 block">
                  Used in URL: /products?category={categoryForm.id || "slug"}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description of this collection..."
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CCBD] text-xs text-[#1C1917] focus:outline-none focus:border-[#B38A38]"
                />
              </div>

              <div className="pt-3 border-t border-[#E7E0D4] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#D8CCBD] text-xs font-medium text-[#44403C] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#1C1917] hover:bg-[#B38A38] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD VIDEO                                               */}
      {/* ============================================================== */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E7E0D4] shadow-2xl max-w-lg w-full my-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E7E0D4] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#B38A38]" />
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  Add Video to Gallery
                </h3>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-[#6E655E] hover:text-[#1C1917] p-1 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="p-6 space-y-4">
              {/* Video upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Video File (MP4) *
                </label>
                <input
                  ref={videoFileInputRef}
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={handleVideoFileSelect}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => videoFileInputRef.current?.click()}
                    disabled={uploadingVideoFile}
                    className="px-3 py-2 rounded-lg border border-[#D8CCBD] bg-[#FAF8F5] hover:bg-white text-xs font-medium text-[#1C1917] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#B38A38]" />
                    <span>{uploadingVideoFile ? "Uploading..." : "Upload MP4 File"}</span>
                  </button>
                  <span className="text-[11px] text-[#A8A29E]">or specify URL:</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. /videos/gallery/my-video.mp4 or WhatsApp Video 2026-..."
                  value={videoForm.src}
                  onChange={(e) => setVideoForm((v) => ({ ...v, src: e.target.value }))}
                  className="w-full mt-2 px-3 py-2 rounded-lg border border-[#D8CCBD] text-xs text-[#1C1917] focus:outline-none focus:border-[#B38A38]"
                />
              </div>

              {/* Poster image */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Poster Thumbnail Image
                </label>
                <input
                  ref={posterFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePosterFileSelect}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => posterFileInputRef.current?.click()}
                    disabled={uploadingPosterFile}
                    className="px-3 py-2 rounded-lg border border-[#D8CCBD] bg-[#FAF8F5] hover:bg-white text-xs font-medium text-[#1C1917] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#B38A38]" />
                    <span>{uploadingPosterFile ? "Uploading..." : "Upload Poster"}</span>
                  </button>
                  <span className="text-[11px] text-[#A8A29E]">or specify path:</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. posters/poster-15.jpg"
                  value={videoForm.poster}
                  onChange={(e) => setVideoForm((v) => ({ ...v, poster: e.target.value }))}
                  className="w-full mt-2 px-3 py-2 rounded-lg border border-[#D8CCBD] text-xs text-[#1C1917] focus:outline-none focus:border-[#B38A38]"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Video Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Brass Polishing & Detailing"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm((v) => ({ ...v, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CCBD] text-xs text-[#1C1917] focus:outline-none focus:border-[#B38A38]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Editorial caption displayed under the video frame..."
                  value={videoForm.description}
                  onChange={(e) => setVideoForm((v) => ({ ...v, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CCBD] text-xs text-[#1C1917] focus:outline-none focus:border-[#B38A38]"
                />
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
                  Aspect Ratio
                </label>
                <select
                  value={videoForm.aspectRatio}
                  onChange={(e) =>
                    setVideoForm((v) => ({
                      ...v,
                      aspectRatio: e.target.value as "portrait" | "landscape" | "square" | "auto",
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CCBD] text-xs text-[#1C1917] focus:outline-none focus:border-[#B38A38]"
                >
                  <option value="portrait">Portrait (9:16 vertical reel)</option>
                  <option value="landscape">Landscape (16:9 horizontal)</option>
                  <option value="square">Square (1:1)</option>
                  <option value="auto">Auto detect</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#E7E0D4] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#D8CCBD] text-xs font-medium text-[#44403C] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#1C1917] hover:bg-[#B38A38] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
                >
                  Add Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
