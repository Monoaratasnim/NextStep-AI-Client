import { readFileSync } from "fs";
import { join } from "path";
import { inflateSync } from "zlib";
import { generatePdf } from "./src/utils/generatePdf";

const TEMP = process.env.TEMP || ".";
const src = JSON.parse(readFileSync(join(TEMP, "nsa-ai-content.json"), "utf8"));

const WIN: Record<string, string> = {
  "\x80": "\u20ac", "\x82": "\u201a", "\x83": "\u0192", "\x84": "\u201e",
  "\x85": "\u2026", "\x86": "\u2020", "\x87": "\u2021", "\x88": "\u02c6",
  "\x89": "\u2030", "\x8a": "\u0160", "\x8b": "\u2039", "\x8c": "\u0152",
  "\x8e": "\u017d", "\x91": "\u2018", "\x92": "\u2019", "\x93": "\u201c",
  "\x94": "\u201d", "\x95": "\u2022", "\x96": "\u2013", "\x97": "\u2014",
  "\x98": "\u02dc", "\x99": "\u2122", "\x9a": "\u0161", "\x9b": "\u203a",
  "\x9c": "\u0153", "\x9e": "\u017e", "\x9f": "\u0178",
};
function dec(raw: string): string {
  return raw
    .split("")
    .map((c) => WIN[c] ?? c)
    .join("");
}

function inflateStreams(latin: string): string[] {
  const streams: string[] = [];
  const re = /stream\r?\n([\s\S]*?)\r?\n?endstream/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(latin)) !== null) {
    try {
      const buf = inflateSync(Buffer.from(m[1], "latin1"));
      streams.push(buf.toString("latin1"));
    } catch {
      streams.push(m[1]);
    }
  }
  return streams;
}

function fontMap(latin: string): Map<string, string> {
  const map = new Map<string, string>();
  const re = /\/Type\s*\/Font[\s\S]*?\/Name\s*\/(\w+)[\s\S]*?\/BaseFont\s*\/([A-Za-z0-9+\-]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(latin)) !== null) {
    map.set(m[1], m[2]);
  }
  return map;
}

interface Op { x: number; y: number; font: string; base: string; size: number; raw: string }

function analyze(label: string, content: string, needles: string[]) {
  const file = join(TEMP, `nsa-new-${label}.pdf`);
  generatePdf(content, file, {
    title: label === "roadmap" ? "Career Roadmap" : "Career Recommendation",
    careerGoal: "Full Stack Web Developer",
    preferredIndustry: "Technology",
    experienceLevel: "beginner",
    generatedAt: new Date("2026-08-30T10:00:00"),
  });

  const latin = readFileSync(file).toString("latin1");
  const fonts = fontMap(latin);
  const streams = inflateStreams(latin);
  const pages = (latin.match(/\/Type\s*\/Page\b/g) || []).length;

  const allOps: { page: number; op: Op }[] = [];
  let pageNo = 0;
  for (const s of streams) {
    pageNo++;
    let font = "";
    let size = 0;
    const btRe = /BT([\s\S]*?)ET/g;
    let m: RegExpExecArray | null;
    while ((m = btRe.exec(s)) !== null) {
      const block = m[1];
      const fm = /\/F(\d+|\w+)\s+([\d.]+)\s+Tf/.exec(block);
      if (fm) {
        font = `F${fm[1]}`;
        size = parseFloat(fm[2]);
      }
      const td = /\b([\d.-]+)\s+([\d.-]+)\s+Td/.exec(block);
      const tj = /\(((?:\\.|[^()\\])*)\)\s*Tj/.exec(block);
      if (td && tj) {
        allOps.push({
          page: pageNo,
          op: {
            x: parseFloat(td[1]),
            y: parseFloat(td[2]),
            font,
            base: fonts.get(font) || font,
            size,
            raw: tj[1],
          },
        });
      }
    }
  }

  const usedBases = [...new Set(allOps.map((o) => o.op.base))].sort();
  const sizes = [...new Set(allOps.map((o) => o.op.size))].sort((a, b) => a - b);
  const nuls = allOps.filter((o) => /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/.test(dec(o.op.raw))).length;

  console.log(`\n===== ${label.toUpperCase()} =====`);
  console.log("pages:", pages, "| text ops:", allOps.length, "| NUL/control-interleaved strings:", nuls);
  console.log("font base names USED:", usedBases.join(", "));
  console.log("font sizes used (pt):", sizes.join(", "));

  // reconstruct lines per page by baseline
  const perPage = new Map<number, Op[]>();
  for (const { page, op } of allOps) {
    const arr = perPage.get(page) || [];
    perPage.set(page, arr.concat([op]));
  }
  for (const [pg, ops] of [...perPage.entries()].sort((a, b) => a[0] - b[0])) {
    const lineMap = new Map<number, Op[]>();
    for (const o of ops) {
      const key = Math.round(o.y * 10) / 10;
      const arr = lineMap.get(key) || [];
      lineMap.set(key, arr.concat([o]));
    }
    const lines = [...lineMap.entries()].sort((a, b) => b[0] - a[0]);
    let overlaps = 0;
    for (let i = 0; i < lines.length - 1; i++) {
      if (lines[i][0] - lines[i + 1][0] < 3) overlaps++;
    }
    console.log(`p${pg}: ${lines.length} lines | baseline closer than 3mm: ${overlaps}`);
    console.log("   baseline  font:size  text");
    for (let i = 0; i < Math.min(24, lines.length); i++) {
      const [b, olist] = lines[i];
      const text = olist.slice().sort((a, b) => a.x - b.x).map((p) => dec(p.raw)).join("");
      const f = [...new Set(olist.map((p) => p.base + ":" + p.size))].join("|");
      console.log(`   ${String(Math.round(b)).padStart(4)}   ${f.padEnd(9)}  ${text.slice(0, 100)}`);
    }
    if (lines.length > 24) console.log(`   ... (${lines.length - 24} more lines)`);
  }

  const joined = allOps.map((o) => dec(o.op.raw)).join("").replace(/\s+/g, " ");
  const misses = needles.filter((n) => !joined.includes(n));
  console.log("\nneedle misses:", misses.length ? misses.join(" | ") : "NONE");
}

analyze("roadmap", src.roadmap, [
  "Full Stack",
  "Node.js",
  "JavaScript",
  "React",
  "Overview",
  "Phase 1",
  "Topics Covered",
  "Milestone",
  "Weeks 1-2",
  "–",
  "•",
]);
analyze("rec", src.rec, [
  "Tk. 20,000",
  "Tk. 50,000",
  "per month",
  "–",
  "•",
]);
console.log("\nDONE");