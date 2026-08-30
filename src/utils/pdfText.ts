const WIN_ANSI_EXT: Record<number, number> = {
  0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85,
  0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88, 0x2030: 0x89, 0x0160: 0x8a,
  0x2039: 0x8b, 0x0152: 0x8c, 0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92,
  0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b, 0x0153: 0x9c,
  0x017e: 0x9e, 0x0178: 0x9f,
};

const REPLACEMENTS: Map<number, string> = new Map([
  // Hyphen and dash variants → printable minus/hyphen
  [0x2010, "-"],
  [0x2011, "-"],
  [0x2012, "-"],
  [0x2015, "-"],
  [0x2017, "-"],
  [0x2043, "-"],
  [0x2212, "-"],
  [0x2e3a, "-"],
  [0x2e3b, "-"],
  [0x301c, "-"],
  [0xff0d, "-"],
  [0x2215, "/"],
  // Space variants → normal space
  [0x00a0, " "],
  [0x2000, " "],
  [0x2001, " "],
  [0x2002, " "],
  [0x2003, " "],
  [0x2004, " "],
  [0x2005, " "],
  [0x2006, " "],
  [0x2007, " "],
  [0x2008, " "],
  [0x2009, " "],
  [0x200a, " "],
  [0x202f, " "],
  // Invisible / zero-width marks → removed
  [0x00ad, ""],
  [0x200b, ""],
  [0x200c, ""],
  [0x200d, ""],
  [0x2060, ""],
  [0xfeff, ""],
  // Line / paragraph separators → line feed
  [0x000d, ""],
  [0x2028, "\n"],
  [0x2029, "\n"],
  // Currency and symbol substitutes (not in WinAnsi)
  [0x09f3, "Tk. "],
  [0x20b9, "Rs. "],
  [0x20a8, "Rs. "],
  [0x2116, "No. "],
  // Fraction and punctuation substitutes
  [0x00bc, "1/4"],
  [0x00bd, "1/2"],
  [0x00be, "3/4"],
  [0x2024, "."],
  [0x2025, ".."],
  [0x2026, "..."],
  [0x2027, "-"],
  [0x02d7, "-"],
  [0x2044, "/"],
]);

function isWinAnsiSafe(cp: number): boolean {
  if (cp >= 0x20 && cp <= 0x7e) return true;
  if (cp >= 0xa0 && cp <= 0xff) return cp !== 0xad;
  return Object.prototype.hasOwnProperty.call(WIN_ANSI_EXT, cp);
}

function replaceCp(cp: number): string {
  const decomposed = String.fromCodePoint(cp).normalize("NFKD");
  let out = "";
  for (const ch of decomposed) {
    const c = ch.codePointAt(0) as number;
    const d = REPLACEMENTS.get(c);
    if (d !== undefined) {
      out += d;
    } else if (isWinAnsiSafe(c)) {
      out += ch;
    }
  }
  return out;
}

/**
 * Converts a UTF-8 string so every character can be encoded by the PDF
 * base-14/WinAnsi fonts used by jsPDF. Characters outside WinAnsi are mapped
 * to the nearest safe representation (hyphen/space/currency substitutes)
 * so jsPDF never falls back to writing raw Unicode code units into the
 * content stream (which viewers mis-decode as control characters).
 */
export function normalizeForPdf(text: string): string {
  let out = "";
  for (const ch of text) {
    const cp = ch.codePointAt(0) as number;
    // Preserve structural whitespace (newlines, tabs) — they are part of the
    // markdown layout and must survive so line-based parsing still works.
    if (cp === 0x0a || cp === 0x09) {
      out += ch;
      continue;
    }
    const rep = REPLACEMENTS.get(cp);
    if (rep !== undefined) {
      out += rep;
      continue;
    }
    if (isWinAnsiSafe(cp)) {
      out += ch;
      continue;
    }
    out += replaceCp(cp);
  }
  return out;
}