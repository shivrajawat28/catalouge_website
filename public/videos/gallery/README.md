# Advaita Tattva — Video Gallery Upload Directory

This folder holds the video files displayed in **"The Art in Motion"** gallery section on the homepage (below the Products/Catalogue section).

## 1. Where to Upload Videos

Copy your video files directly into this directory on your computer:

```text
/Users/shivrajawat/Documents/catalouge_website/public/videos/gallery/
```

For example:
- `/Users/shivrajawat/Documents/catalouge_website/public/videos/gallery/ganesha-detail.mp4`
- `/Users/shivrajawat/Documents/catalouge_website/public/videos/gallery/buddha-workshop.mp4`

Optional poster thumbnail images (`.jpg` or `.webp`) can also be placed in this same directory.

## 2. Supported Formats & Recommended Encoding

- **Preferred Format**: **MP4 (`.mp4`)** encoded with **H.264 (`avc1`)** video and **AAC** audio (if any). This ensures universal playback across Chrome, Safari, Firefox, iOS, and Android.
- **Also Supported**: WebM (`.webm`, VP9/AV1) as an alternative if needed.
- **Recommended Web Optimization**: Export with `faststart` (`moov` atom at the front of the file) so videos begin playing smoothly without downloading the entire file first.
  - With `ffmpeg`: `ffmpeg -i input.mp4 -c:v libx264 -pix_fmt yuv420p -movflags +faststart output.mp4`
- **Aspect Ratios**: Both **portrait** (e.g., `9:16` / `1080×1920`) and **landscape** (e.g., `16:9` / `1920×1080`) videos are automatically supported and preserve their natural proportions.

## 3. How the Website Discovers Videos (Registration Required)

Uploading a video file to this folder **does not automatically publish it** to the website.

To control display order, titles, captions, poster images, and aspect ratios safely without broken media links, videos are explicitly registered in:

```text
src/config/videoGallery.ts
```

## 4. How to Add Another Video

1. Copy your `.mp4` file (and optional poster `.jpg`) into `public/videos/gallery/`.
2. Open `src/config/videoGallery.ts` and add a new entry to the `videos` array:

```ts
{
  id: "krishna-showcase",
  src: "krishna-showcase.mp4", // resolves to /videos/gallery/krishna-showcase.mp4
  title: "Lord Krishna — Lost-Wax Detail",
  description: "Close-up view of hand-finished antique brass ornaments.",
  poster: "krishna-showcase-poster.jpg", // optional
  aspectRatio: "portrait", // "portrait" | "landscape" | "square" | "auto"
},
```

3. Save `src/config/videoGallery.ts`. No React component code changes are needed.
