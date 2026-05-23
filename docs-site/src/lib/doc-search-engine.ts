import type { DocSearchEntry } from './doc-search-types';

const MAX_RESULTS = 8;

/**
 * Lightweight ranked search (no external deps). Replace with Fuse.js when installed.
 */
export function searchDocEntries(entries: DocSearchEntry[], query: string, limit = MAX_RESULTS): DocSearchEntry[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const terms = q.split(/\s+/).filter(Boolean);

  const scored = entries
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const section = entry.section.toLowerCase();
      const keywords = entry.keywords.toLowerCase();
      const lead = entry.lead.toLowerCase();
      const hay = `${title} ${section} ${keywords} ${lead}`;

      for (const term of terms) {
        if (!hay.includes(term)) return null;
      }

      let score = 0;
      if (title.includes(q)) score += 12;
      if (title.startsWith(q)) score += 6;
      for (const term of terms) {
        if (title.includes(term)) score += 5;
        if (section.includes(term)) score += 2;
        if (keywords.includes(term)) score += 3;
        if (lead.includes(term)) score += 1;
      }

      return { entry, score };
    })
    .filter((row): row is { entry: DocSearchEntry; score: number } => row !== null)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, 'en'));

  return scored.slice(0, limit).map((row) => row.entry);
}
