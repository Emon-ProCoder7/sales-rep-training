import rawCategories from "./portfolio-data.json";

// Sourced from the "Video portfolio" folder shared by ops (one .docx per
// category, one Vimeo link per line). Vimeo URLs here are byte-for-byte what
// was in those documents - never edit a `vimeoUrl` by hand, it must stay
// exactly what production gave us or the link won't resolve to the right
// video. Titles/thumbnails/durations were pulled live from Vimeo's oEmbed API,
// keyed off the video id in each URL.

export interface PortfolioVideo {
  id: string;
  /** null only for the one password-protected video Vimeo won't return metadata for */
  title: string | null;
  vimeoUrl: string;
  thumbnail: string | null;
  durationSeconds: number | null;
  passwordProtected: boolean;
}

export interface PortfolioCategory {
  slug: string;
  displayName: string;
  videos: PortfolioVideo[];
}

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = rawCategories as PortfolioCategory[];

/** Flat list for search - the same video can legitimately appear in more than
 * one category (e.g. a commercial that's also social content), so entries
 * are deduped by id here, keeping the first category it was found in. */
export const ALL_PORTFOLIO_VIDEOS: (PortfolioVideo & { categorySlug: string; categoryName: string })[] = (() => {
  const seen = new Set<string>();
  const out: (PortfolioVideo & { categorySlug: string; categoryName: string })[] = [];
  for (const cat of PORTFOLIO_CATEGORIES) {
    for (const v of cat.videos) {
      if (seen.has(v.id)) continue;
      seen.add(v.id);
      out.push({ ...v, categorySlug: cat.slug, categoryName: cat.displayName });
    }
  }
  return out;
})();

export function formatDuration(seconds: number | null): string {
  if (seconds == null) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
