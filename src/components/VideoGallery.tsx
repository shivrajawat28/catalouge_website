"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { GalleryVideoItem, videoGalleryConfig } from "@/config/videoGallery";
import {
  ChevronLeft,
  ChevronRight,
  Film,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";

function resolveMediaPath(pathOrFilename: string): string {
  if (
    pathOrFilename.startsWith("http://") ||
    pathOrFilename.startsWith("https://")
  ) {
    return pathOrFilename;
  }
  if (pathOrFilename.startsWith("/")) {
    return encodeURI(pathOrFilename);
  }
  const base = videoGalleryConfig.uploadDirectory.replace(/\/$/, "");
  return encodeURI(`${base}/${pathOrFilename}`);
}

function VideoGalleryCard({ item }: { item: GalleryVideoItem }) {
  const cardRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const userPausedRef = useRef<boolean>(false);
  const isMutedRef = useRef<boolean>(true);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const isLandscape = item.aspectRatio === "landscape";

  // Attempt muted autoplay only when card is meaningfully visible in both page & carousel viewport
  useEffect(() => {
    const video = videoRef.current;
    const container = cardRef.current;
    if (!video || !container) return;

    video.defaultMuted = true;
    video.muted = isMutedRef.current;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      video.autoplay = false;
      video.pause();
    }

    const attemptPlay = async () => {
      await Promise.resolve();
      if (prefersReducedMotion) {
        video.autoplay = false;
        if (!video.paused) {
          video.pause();
        }
        setAutoplayBlocked(true);
        return;
      }

      try {
        if (video.paused && !userPausedRef.current) {
          video.muted = isMutedRef.current;
          await video.play();
          setAutoplayBlocked(false);
        }
      } catch {
        setAutoplayBlocked(true);
      }
    };

    if (typeof IntersectionObserver === "undefined") {
      attemptPlay();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            attemptPlay();
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.3) {
            if (!video.paused) {
              video.pause();
            }
          }
        }
      },
      { threshold: [0, 0.3, 0.5, 0.75] }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleTogglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      userPausedRef.current = false;
      try {
        await video.play();
        setAutoplayBlocked(false);
      } catch {
        setAutoplayBlocked(true);
      }
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    isMutedRef.current = nextMuted;
    setIsMuted(nextMuted);
  };

  const resolvedSrc = resolveMediaPath(item.src);
  const resolvedPoster = item.poster ? resolveMediaPath(item.poster) : undefined;
  const labelTitle = item.title || "Advaita Tattva Brass Sculpture Film";

  return (
    <figure
      ref={cardRef}
      data-video-id={item.id}
      className="group shrink-0 snap-start w-[80%] sm:w-[68%] md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] flex flex-col bg-white rounded-2xl border border-[#E7E0D4] hover:border-[#B38A38]/55 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Consistent Carousel Frame Ratio: 4:5 keeps vertical idols full-bleed while framing landscape studio views without cropping */}
      <div className="relative w-full aspect-4/5 bg-[#1C1917] overflow-hidden">
        <video
          ref={videoRef}
          src={resolvedSrc}
          poster={resolvedPoster}
          loop
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          onPlay={() => {
            setIsPlaying(true);
            setAutoplayBlocked(false);
          }}
          onPause={() => setIsPlaying(false)}
          onClick={handleTogglePlay}
          className={`w-full h-full block cursor-pointer ${
            isLandscape ? "object-contain" : "object-cover object-center"
          }`}
          aria-label={labelTitle}
        />

        {/* Subtle gradient scrim behind bottom controls for legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#1C1917]/65 via-[#1C1917]/20 to-transparent" />

        {/* Fallback centered Play trigger when browser autoplay is restricted */}
        {autoplayBlocked && !isPlaying && (
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={`Play ${labelTitle}`}
            className="absolute inset-0 flex items-center justify-center bg-[#1C1917]/25 backdrop-blur-[1px] cursor-pointer transition-opacity"
          >
            <span className="w-12 h-12 rounded-full bg-[#FAF8F5]/95 text-[#1C1917] border border-[#B38A38]/50 flex items-center justify-center shadow-md">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </span>
          </button>
        )}

        {/* Independent Bottom Playback & Mute Controls */}
        <div className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleTogglePlay}
            data-video-control="play-pause"
            aria-label={isPlaying ? `Pause ${labelTitle}` : `Play ${labelTitle}`}
            aria-pressed={isPlaying}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1C1917]/80 hover:bg-[#1C1917] text-white border border-white/15 backdrop-blur-xs text-[11px] font-medium tracking-wide transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#C5A059] fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleToggleMute}
            data-video-control="mute-unmute"
            aria-label={isMuted ? `Unmute ${labelTitle}` : `Mute ${labelTitle}`}
            aria-pressed={!isMuted}
            className="p-2 rounded-full bg-[#1C1917]/80 hover:bg-[#1C1917] text-white border border-white/15 backdrop-blur-xs transition-colors cursor-pointer"
            title={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-white/85" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
            )}
          </button>
        </div>
      </div>

      {/* Editorial Metadata Below Video */}
      {(item.title || item.description) && (
        <figcaption className="p-5 sm:p-6 space-y-1.5 bg-white border-t border-[#F0EAE1] flex-1">
          {item.title && (
            <h3 className="font-serif text-lg sm:text-xl font-medium text-[#1C1917] group-hover:text-[#785A1D] transition-colors leading-snug">
              {item.title}
            </h3>
          )}
          {item.description && (
            <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
              {item.description}
            </p>
          )}
        </figcaption>
      )}
    </figure>
  );
}

export function VideoGallery() {
  const { eyebrow, title, subtitle, videos } = videoGalleryConfig;
  const [videoList, setVideoList] = useState<GalleryVideoItem[]>(videos);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(videoList.length > 1);
  const [activeIndex, setActiveIndex] = useState(0);

  // Sync dynamic videos from /api/catalog on mount
  useEffect(() => {
    let mounted = true;
    async function syncDynamicVideos() {
      try {
        const res = await fetch("/api/catalog");
        if (res.ok) {
          const data = await res.json();
          if (mounted && data.success && Array.isArray(data.videos) && data.videos.length > 0) {
            setVideoList(data.videos);
          }
        }
      } catch {
        // Fallback to static videos
      }
    }
    syncDynamicVideos();
    return () => {
      mounted = false;
    };
  }, []);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const currentScroll = track.scrollLeft;

    setCanScrollPrev(currentScroll > 8);
    setCanScrollNext(currentScroll < maxScroll - 8);

    const firstCard = track.querySelector("figure");
    if (firstCard) {
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || "24") || 24;
      const step = firstCard.getBoundingClientRect().width + gap;
      if (step > 0) {
        const idx = Math.round(currentScroll / step);
        setActiveIndex(Math.min(Math.max(0, idx), Math.max(0, videoList.length - 1)));
      }
    }
  }, [videoList.length]);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState]);

  const scrollByViewportSet = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.querySelector("figure");
    if (!firstCard) return;

    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "24") || 24;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const stepSize = cardWidth + gap;

    // Move by approximately the number of full cards currently visible (3 desktop, 2 tablet, 1 mobile)
    const visibleCards = Math.max(1, Math.floor((track.clientWidth + gap) / stepSize));
    const delta = direction * visibleCards * stepSize;

    track.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  const handleTrackKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByViewportSet(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByViewportSet(-1);
    }
  };

  return (
    <section
      id="video-gallery"
      aria-labelledby="video-gallery-heading"
      className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] border-t border-[#E7E0D4] overflow-x-hidden scroll-mt-20 sm:scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header + Carousel Navigation Arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7E0D4] text-[10px] uppercase tracking-widest font-semibold text-[#785A1D]">
              <Film className="w-3.5 h-3.5 text-[#B38A38]" />
              <span>{eyebrow}</span>
            </div>

            <h2
              id="video-gallery-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#1C1917] tracking-tight"
            >
              {title}
            </h2>

            <p className="text-sm sm:text-base text-[#44403C] leading-relaxed">
              {subtitle}
            </p>
          </div>

          {videoList.length > 0 && (
            <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
              <span
                className="text-xs font-medium tracking-wider uppercase text-[#785A1D] mr-1"
                aria-live="polite"
              >
                {activeIndex + 1} / {videoList.length}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  scrollByViewportSet(-1);
                }}
                disabled={!canScrollPrev}
                data-carousel-control="prev"
                aria-label="Previous videos"
                className="w-11 h-11 rounded-full border border-[#D8CCBD] bg-white text-[#1C1917] hover:border-[#B38A38] hover:text-[#B38A38] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  scrollByViewportSet(1);
                }}
                disabled={!canScrollNext}
                data-carousel-control="next"
                aria-label="Next videos"
                className="w-11 h-11 rounded-full border border-[#D8CCBD] bg-white text-[#1C1917] hover:border-[#B38A38] hover:text-[#B38A38] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Horizontal Swipeable Carousel Track or Refined Empty State */}
        {videoList.length > 0 ? (
          <div
            ref={trackRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Advaita Tattva Brass Craftsmanship Video Carousel"
            tabIndex={0}
            onScroll={updateScrollState}
            onKeyDown={handleTrackKeyDown}
            data-video-carousel-track="true"
            className="no-scrollbar flex flex-nowrap gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B38A38]/40 rounded-2xl"
          >
            {videoList.map((item) => (
              <VideoGalleryCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white border border-[#E7E0D4] p-10 sm:p-14 text-center max-w-3xl mx-auto">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF8F5] border border-[#E7E0D4] flex items-center justify-center text-[#B38A38] mb-4">
              <Film className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1C1917]">
              Craftsmanship Films Curating Soon
            </h3>
            <p className="mt-2 text-sm text-[#44403C] max-w-lg mx-auto leading-relaxed">
              Our studio video showcase capturing lost-wax casting, antique brass
              patina finishing, and sculptural details is being prepared for this
              collection.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
