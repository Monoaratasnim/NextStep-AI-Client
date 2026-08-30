import jsPDF from "jspdf";
import { normalizeForPdf } from "./pdfText";

// ── Page geometry (A4, mm) ────────────────────────────────────────────────
const PAGE = { width: 210, height: 297, left: 18, right: 18, top: 16, bottom: 26 };
const CONTENT_WIDTH = PAGE.width - PAGE.left - PAGE.right;
const HEADER_H = 36;
const maxContentY = (doc: jsPDF) => doc.internal.pageSize.getHeight() - PAGE.bottom;

type RGB = [number, number, number];
type FontWeights = "normal" | "bold" | "italic" | "bolditalic";

// ── Palette (single, professionally muted) ────────────────────────────────
const COLORS = {
  primary: [64, 76, 166] as RGB,
  ink: [34, 36, 40] as RGB,
  gray: [110, 115, 125] as RGB,
  muted: [150, 155, 165] as RGB,
  white: [255, 255, 255] as RGB,
  bandLight: [210, 216, 240] as RGB,
  codeBg: [245, 246, 248] as RGB,
  metaBg: [250, 250, 252] as RGB,
  zebra: [247, 248, 250] as RGB,
};

// ── Vertical rhythm & section spacing (mm) ────────────────────────────────
// Whitespace — never horizontal rules — separates sections.
const SPACE = {
  metaGap: 5,      // after the metadata box / title before the first block
  blankLine: 2.5,  // between consecutive markdown lines
  hrGap: 4,        // a markdown horizontal rule contributes whitespace only
  keepMajor: 20,   // h1/h2 keep with following content (avoid orphan heading)
  keepMinor: 12,   // h3/h4 keep with following content
};

// ── Centralized typography system ──────────────────────────────────────────
// ONE family (helvetica) throughout. Sizes in pt, rhythm in mm.
interface TypeStyle {
  family: "helvetica";
  weight?: FontWeights;
  size: number;
  color: RGB;
  lh: number;
  before?: number;
  after?: number;
}

const TYPE: Record<string, TypeStyle> = {
  brand: { family: "helvetica", weight: "bold", size: 16, color: COLORS.white, lh: 6 },
  brandSub: { family: "helvetica", weight: "normal", size: 8.5, color: COLORS.bandLight, lh: 4 },
  title: { family: "helvetica", weight: "bold", size: 18, color: COLORS.ink, lh: 7.5, after: 3 },
  h1: {
    family: "helvetica", weight: "bold", size: 15, color: COLORS.ink,
    lh: 6, before: 7, after: 3.5,
  },
  h2: {
    family: "helvetica", weight: "bold", size: 13.5, color: COLORS.primary,
    lh: 5.6, before: 7.5, after: 3.5,
  },
  h3: {
    family: "helvetica", weight: "bold", size: 11.5, color: COLORS.ink,
    lh: 5, before: 5, after: 3,
  },
  h4: {
    family: "helvetica", weight: "bold", size: 10.5, color: COLORS.ink,
    lh: 4.8, before: 4.5, after: 2.5,
  },
  body: { family: "helvetica", weight: "normal", size: 10, color: COLORS.ink, lh: 4.8, after: 4 },
  bullet: { family: "helvetica", weight: "normal", size: 10, color: COLORS.ink, lh: 4.6, after: 2.8 },
  quote: {
    family: "helvetica", weight: "italic", size: 10, color: COLORS.gray,
    lh: 4.6, before: 3, after: 4,
  },
  code: {
    family: "helvetica", weight: "italic", size: 9, color: COLORS.ink,
    lh: 4.2, before: 3, after: 4,
  },
  metaLabel: { family: "helvetica", weight: "bold", size: 9, color: COLORS.gray, lh: 4.4 },
  meta: { family: "helvetica", weight: "normal", size: 9, color: COLORS.ink, lh: 4.4 },
  table: { family: "helvetica", weight: "normal", size: 8.5, color: COLORS.ink, lh: 4 },
  tableHead: { family: "helvetica", weight: "bold", size: 8.5, color: COLORS.white, lh: 4 },
  footer: { family: "helvetica", weight: "normal", size: 8, color: COLORS.muted, lh: 3.6 },
};

// ── Font helpers ─────────────────────────────────────────────────────────
function applyType(doc: jsPDF, t: TypeStyle) {
  doc.setFont(t.family, t.weight ?? "normal");
  doc.setFontSize(t.size);
  doc.setTextColor(t.color[0], t.color[1], t.color[2]);
}

function typeWidth(doc: jsPDF, t: TypeStyle, text: string): number {
  applyType(doc, t);
  return doc.getTextWidth(text);
}

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > maxContentY(doc)) {
    doc.addPage();
    return PAGE.top;
  }
  return y;
}

// ── Inline Markdown (bold / italic / code) ────────────────────────────────
interface InlineToken {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
}

interface MeasuredToken {
  text: string;
  t: TypeStyle;
  flags: Pick<InlineToken, "bold" | "italic" | "code">;
}

const INLINE_RE = /(\*\*\*[^*]+\*\*\*)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(`[^`\n]+`)/g;

function parseInline(src: string): InlineToken[] {
  const parts: InlineToken[] = [];
  let last = 0;
  for (const m of src.matchAll(INLINE_RE)) {
    const idx = m.index as number;
    if (idx > last) parts.push({ text: src.slice(last, idx) });
    const tok = m[0];
    if (tok.startsWith("***")) {
      parts.push({ text: tok.slice(3, -3), bold: true, italic: true });
    } else if (tok.startsWith("**")) {
      parts.push({ text: tok.slice(2, -2), bold: true });
    } else if (tok.startsWith("`")) {
      parts.push({ text: tok.slice(1, -1), code: true });
    } else {
      parts.push({ text: tok.slice(1, -1), italic: true });
    }
    last = idx + tok.length;
  }
  if (last < src.length) parts.push({ text: src.slice(last) });
  return parts;
}

function specForToken(
  token: Pick<InlineToken, "bold" | "italic" | "code">,
  base: TypeStyle
): TypeStyle {
  if (token.code) {
    return { ...base, weight: token.bold ? "bolditalic" : "italic" };
  }
  if (token.bold && token.italic) return { ...base, weight: "bolditalic" };
  if (token.bold) return { ...base, weight: "bold" };
  if (token.italic) return { ...base, weight: "italic" };
  return base;
}

function tokensWidth(doc: jsPDF, tokens: MeasuredToken[]): number {
  let w = 0;
  for (const tk of tokens) w += typeWidth(doc, tk.t, tk.text);
  return w;
}

function takeChars(doc: jsPDF, t: TypeStyle, text: string, maxWidth: number): string {
  let acc = "";
  for (const ch of text) {
    if (acc && typeWidth(doc, t, acc + ch) > maxWidth) break;
    acc += ch;
  }
  return acc || text[0];
}

/**
 * Greedy word wrapper that preserves every space. A line can only break at an
 * inter-word gap; overlong tokens (URLs) are split on character boundaries so
 * nothing ever overflows the page.
 */
function wrapInline(
  doc: jsPDF,
  source: string,
  base: TypeStyle,
  maxWidth: number
): InlineToken[][] {
  const tokens: MeasuredToken[] = [];
  for (const inc of parseInline(source)) {
    for (const chunk of inc.text.split(/(\s+)/)) {
      if (chunk.length === 0) continue;
      tokens.push({
        text: chunk,
        t: specForToken(inc, base),
        flags: { bold: inc.bold, italic: inc.italic, code: inc.code },
      });
    }
  }

  const lines: MeasuredToken[][] = [];
  let cur: MeasuredToken[] = [];

  const flush = () => {
    if (cur.length > 0) lines.push(cur);
    cur = [];
  };

  for (const token of tokens) {
    const isSpace = /^\s+$/.test(token.text);
    // Never start a visual line with whitespace.
    if (cur.length === 0 && isSpace) continue;

    const w = typeWidth(doc, token.t, token.text);
    if (cur.length > 0 && tokensWidth(doc, cur) + w > maxWidth) {
      flush();
      // The wrap point is a word boundary; a lone space at the break is the gap.
      if (isSpace) continue;
    }

    if (w > maxWidth) {
      let rest = token.text;
      while (rest.length > 0) {
        const avail = maxWidth - tokensWidth(doc, cur);
        if (avail <= 0) {
          flush();
          if (cur.length === 0) {
            const take = takeChars(doc, token.t, rest, maxWidth);
            cur.push({ text: take, t: token.t, flags: token.flags });
            rest = rest.slice(take.length);
            continue;
          }
          continue;
        }
        const taken = takeChars(doc, token.t, rest, avail);
        cur.push({ text: taken, t: token.t, flags: token.flags });
        rest = rest.slice(taken.length);
      }
      continue;
    }

    cur.push(token);
  }
  flush();

  return lines.map((line) => line.map((tk) => ({ text: tk.text, ...tk.flags })));
}

function drawInline(
  doc: jsPDF,
  line: InlineToken[],
  base: TypeStyle,
  x: number,
  y: number
): number {
  let cx = x;
  for (const inc of line) {
    const t = specForToken(inc, base);
    applyType(doc, t);
    doc.text(inc.text, cx, y);
    cx += typeWidth(doc, t, inc.text);
  }
  return y;
}

function stripInline(src: string): string {
  return src
    .replace(/\*\*\*/g, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\*([^*]+)\*/g, "$1");
}

// ── Document chrome ───────────────────────────────────────────────────────
export interface PdfMetadata {
  title: string;
  careerGoal?: string;
  preferredIndustry?: string;
  experienceLevel?: string;
  generatedAt?: Date;
}

function addHeader(doc: jsPDF, generatedAt: Date) {
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, PAGE.width, HEADER_H, "F");

  applyType(doc, TYPE.brand);
  doc.text("NextStep AI", PAGE.left, 15);

  applyType(doc, TYPE.brandSub);
  doc.text("AI-Powered Career Guidance", PAGE.left, 22.5);

  const stamp = `Generated: ${generatedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}`;
  applyType(doc, TYPE.brandSub);
  doc.text(stamp, PAGE.width - PAGE.right, 22.5, { align: "right" });
}

function addFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    applyType(doc, TYPE.footer);
    doc.text(
      `Generated by NextStep AI  •  Page ${i} of ${pageCount}`,
      PAGE.width / 2,
      doc.internal.pageSize.getHeight() - 11,
      { align: "center" }
    );
  }
}

// ── Block renderers (each returns the next y) ─────────────────────────────
function renderHeading(
  doc: jsPDF,
  text: string,
  style: TypeStyle,
  y: number
): number {
  const lines = wrapInline(doc, text, style, CONTENT_WIDTH);
  const textH = lines.length * style.lh;
  const before = style.before ?? 0;
  const after = style.after ?? 0;
  // Keep the heading on the same page as at least a couple of content lines
  // so a section heading is never left stranded at the bottom of a page.
  const keep = style.size >= 12 ? SPACE.keepMajor : SPACE.keepMinor;
  y = ensureSpace(doc, y, before + 2 + textH + keep);
  y += before;
  lines.forEach((line, i) => drawInline(doc, line, style, PAGE.left, y + i * style.lh));
  return y + textH + after;
}

function renderParagraph(
  doc: jsPDF,
  text: string,
  style: TypeStyle,
  y: number,
  width = CONTENT_WIDTH,
  x = PAGE.left
): number {
  y = ensureSpace(doc, y, 2 + style.lh + (style.after ?? 0));
  const lines = wrapInline(doc, text, style, width);
  lines.forEach((line, i) => drawInline(doc, line, style, x, y + i * style.lh));
  return y + lines.length * style.lh + (style.after ?? 0);
}

function renderBullet(doc: jsPDF, text: string, y: number): number {
  const textX = PAGE.left + 8.5;
  const width = CONTENT_WIDTH - 8.5;
  const style = TYPE.bullet;
  y = ensureSpace(doc, y, 2 + style.lh + (style.after ?? 0));
  const lines = wrapInline(doc, text, style, width);

  if (text.trim() !== "") {
    applyType(doc, style);
    doc.text("•", PAGE.left + 3, y);
  }
  lines.forEach((line, i) => drawInline(doc, line, style, textX, y + i * style.lh));
  return y + lines.length * style.lh + (style.after ?? 0);
}

function renderNumbered(doc: jsPDF, number: string, text: string, y: number): number {
  const style = TYPE.bullet;
  const numStyle = { ...style, weight: "bold" as const, color: COLORS.primary };
  applyType(doc, style);
  const numWidth = typeWidth(doc, numStyle, number);
  const textX = PAGE.left + 4 + numWidth;
  const width = CONTENT_WIDTH - (textX - PAGE.left);

  y = ensureSpace(doc, y, 2 + style.lh + (style.after ?? 0));
  const lines = wrapInline(doc, text, style, width);
  applyType(doc, numStyle);
  doc.text(number, PAGE.left + 3, y);
  lines.forEach((line, i) => drawInline(doc, line, style, textX, y + i * style.lh));
  return y + lines.length * style.lh + (style.after ?? 0);
}

function renderQuote(doc: jsPDF, text: string, y: number): number {
  const style = TYPE.quote;
  const quoteX = PAGE.left + 6;
  const width = CONTENT_WIDTH - 10;
  y = ensureSpace(doc, y, (style.before ?? 0) + style.lh * 2 + (style.after ?? 0));
  y += style.before ?? 0;
  const lines = wrapInline(doc, text, style, width);

  doc.setFillColor(...COLORS.primary);
  doc.rect(PAGE.left, y - 3, 1.5, lines.length * style.lh + 3, "F");
  lines.forEach((line, i) => drawInline(doc, line, style, quoteX, y + i * style.lh));
  return y + lines.length * style.lh + (style.after ?? 0);
}

function renderCodeBlock(doc: jsPDF, codeLines: string[], y: number): number {
  const style = TYPE.code;
  const height = codeLines.length * style.lh + 6;
  y = ensureSpace(doc, y, (style.before ?? 0) + height + (style.after ?? 0));
  y += style.before ?? 0;

  doc.setFillColor(...COLORS.codeBg);
  doc.roundedRect(PAGE.left, y, CONTENT_WIDTH, height, 1, 1, "F");

  let cy = y + 4.5;
  applyType(doc, style);
  for (const line of codeLines) {
    const plain = normalizeForPdf(stripInline(line));
    const wrapped = doc.splitTextToSize(plain, CONTENT_WIDTH - 8) as string[];
    for (const wl of wrapped) {
      doc.text(wl, PAGE.left + 4, cy);
      cy += style.lh;
    }
  }
  return y + height + (style.after ?? 0);
}

function renderTable(doc: jsPDF, rows: string[][], y: number): number {
  if (rows.length === 0) return y;
  const colCount = Math.max(...rows.map((r) => r.length));
  const colWidth = CONTENT_WIDTH / colCount;
  const cellPad = 2;
  let rowY = y;

  rows.forEach((row, r) => {
    const header = r === 0;
    const style: TypeStyle = header ? TYPE.tableHead : TYPE.table;
    const cellLines: string[][] = row.map((cell) => {
      const plain = normalizeForPdf(stripInline(cell));
      applyType(doc, style);
      return doc.splitTextToSize(plain, colWidth - cellPad * 2) as string[];
    });
    const maxLines = Math.max(1, ...cellLines.map((cl) => cl.length));
    const rowHeight = maxLines * style.lh + 3;
    rowY = ensureSpace(doc, rowY, rowHeight + 1);

    doc.setFillColor(...(header ? COLORS.primary : r % 2 === 0 ? COLORS.zebra : COLORS.white));
    doc.rect(PAGE.left, rowY, CONTENT_WIDTH, rowHeight, "F");

    row.forEach((_, c) => {
      applyType(doc, style);
      doc.text(cellLines[c], PAGE.left + c * colWidth + cellPad, rowY + style.lh);
    });
    rowY += rowHeight;
  });

  return rowY + 4;
}

// ── Main ──────────────────────────────────────────────────────────────────
export function generatePdf(
  markdownContent: string,
  filename: string,
  metadata: PdfMetadata
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const generatedAt = metadata.generatedAt ?? new Date();
  let y = PAGE.top;

  addHeader(doc, generatedAt);

  // Document title
  y = ensureSpace(doc, 44, TYPE.title.lh + (TYPE.title.after ?? 0));
  const titleLines = wrapInline(doc, normalizeForPdf(metadata.title), TYPE.title, CONTENT_WIDTH);
  titleLines.forEach((line, i) => drawInline(doc, line, TYPE.title, PAGE.left, 44 + i * TYPE.title.lh));
  y = 44 + titleLines.length * TYPE.title.lh + (TYPE.title.after ?? 0);

  // Metadata box
  const metaItems: { label: string; value: string }[] = [];
  if (metadata.careerGoal) metaItems.push({ label: "Career Goal", value: metadata.careerGoal });
  if (metadata.preferredIndustry) metaItems.push({ label: "Industry", value: metadata.preferredIndustry });
  if (metadata.experienceLevel) metaItems.push({ label: "Experience Level", value: metadata.experienceLevel });

  const metaRowH = TYPE.metaLabel.lh + 2.5;
  if (metaItems.length > 0) {
    const boxH = metaItems.length * metaRowH + 4;
    y = ensureSpace(doc, y, boxH + 4);
    doc.setFillColor(...COLORS.metaBg);
    doc.roundedRect(PAGE.left, y, CONTENT_WIDTH, boxH, 1.5, 1.5, "F");

    let my = y + 2.5 + TYPE.metaLabel.lh;
    for (const item of metaItems) {
      const label = normalizeForPdf(`${item.label}:`);
      applyType(doc, TYPE.metaLabel);
      doc.text(label, PAGE.left + 4, my);
      const labelW = typeWidth(doc, TYPE.metaLabel, `${label}  `);
      applyType(doc, TYPE.meta);
      doc.text(normalizeForPdf(item.value), PAGE.left + 4 + labelW, my);
      my += metaRowH;
    }
    y = y + boxH + 4;
  }

  y += SPACE.metaGap;

  // Markdown body
  const sourceLines = normalizeForPdf(markdownContent).split("\n");
  let i = 0;

  while (i < sourceLines.length) {
    const rawLine = sourceLines[i];
    const trimmed = rawLine.trim();

    if (trimmed === "") {
      y += SPACE.blankLine;
      i++;
      continue;
    }

    // Code fence
    if (trimmed.startsWith("```")) {
      i++;
      const codeLines: string[] = [];
      while (i < sourceLines.length && !sourceLines[i].trim().startsWith("```")) {
        codeLines.push(sourceLines[i]);
        i++;
      }
      i++;
      if (codeLines.length > 0) y = renderCodeBlock(doc, codeLines, y);
      continue;
    }

    // Table
    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < sourceLines.length && sourceLines[i].trim().startsWith("|")) {
        if (!sourceLines[i].trim().match(/^\|[\s\-:|]+\|$/)) {
          tableLines.push(sourceLines[i]);
        }
        i++;
      }
      if (tableLines.length > 0) {
        const rows = tableLines.map((tl) =>
          tl
            .split("|")
            .filter((c) => c.trim() !== "")
            .map((c) => c.trim())
        );
        y = renderTable(doc, rows, y);
      }
      continue;
    }

    // Headings
    if (rawLine.startsWith("# ") && !rawLine.startsWith("## ")) {
      y = renderHeading(doc, rawLine.replace(/^#\s+/, ""), TYPE.h1, y);
      i++;
      continue;
    }
    if (rawLine.startsWith("## ")) {
      const text = rawLine.replace(/^##\s+/, "").replace(/^\d+\.\s*/, "");
      y = renderHeading(doc, text, TYPE.h2, y);
      i++;
      continue;
    }
    if (rawLine.startsWith("### ")) {
      const text = rawLine.replace(/^###\s+/, "").replace(/^\d+\.\s*/, "");
      y = renderHeading(doc, text, TYPE.h3, y);
      i++;
      continue;
    }
    if (rawLine.match(/^#{4,6}\s/)) {
      const text = rawLine.replace(/^#{4,6}\s+/, "").replace(/^\d+\.\s*/, "");
      y = renderHeading(doc, text, TYPE.h4, y);
      i++;
      continue;
    }

    // Horizontal rule → pure whitespace (never a drawn line)
    if (trimmed.match(/^[-*_]{3,}$/)) {
      y += SPACE.hrGap;
      i++;
      continue;
    }

    // Bullet list
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      y = renderBullet(doc, trimmed.replace(/^[-*]\s+/, ""), y);
      i++;
      continue;
    }

    // Numbered list
    if (trimmed.match(/^\d+[\.\)]\s/)) {
      const match = trimmed.match(/^(\d+[\.\)]\s+)(.*)/);
      if (match) y = renderNumbered(doc, match[1], match[2], y);
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      y = renderQuote(doc, trimmed.replace(/^>\s+/, ""), y);
      i++;
      continue;
    }

    // Regular paragraph
    y = renderParagraph(doc, rawLine, TYPE.body, y);
    i++;
  }

  addFooter(doc);
  doc.save(filename);
}