// One-time conversion: Mindsmith lesson-data.js block graph -> our own Lesson content schema.
// Run with: node scripts/convert-lesson-data.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const data = JSON.parse(
  fs.readFileSync(path.join(ROOT, "_source", "decoded-lesson-data.json"), "utf8")
);

const blocks = data.blocks;

// ---- ProseMirror "doc" -> our RichText spans / simple blocks -----------------

function marksOf(node) {
  const marks = [];
  for (const m of node.marks || []) {
    if (m.type === "bold") marks.push("bold");
    if (m.type === "italic") marks.push("italic");
    if (m.type === "code") marks.push("code");
    if (m.type === "underline") marks.push("underline");
  }
  return marks;
}

function spansOf(node) {
  // Flattens inline content (text nodes) of a paragraph/heading/listItem into spans.
  const spans = [];
  for (const child of node.content || []) {
    if (child.type === "text") {
      spans.push({ text: child.text, marks: marksOf(child) });
    } else if (child.type === "hardBreak") {
      spans.push({ text: "\n", marks: [] });
    }
  }
  return spans;
}

function docToBlocks(doc) {
  const out = [];
  if (!doc || !doc.content) return out;
  for (const node of doc.content) {
    if (node.type === "heading") {
      const level = node.attrs && node.attrs.level ? node.attrs.level : 2;
      out.push({ type: "heading", level: level >= 3 ? 3 : 2, spans: spansOf(node) });
    } else if (node.type === "paragraph") {
      const spans = spansOf(node);
      if (spans.length) out.push({ type: "paragraph", spans });
    } else if (node.type === "bulletList" || node.type === "orderedList") {
      const items = [];
      for (const li of node.content || []) {
        // listItem -> paragraph(s) inside; flatten to one spans array per item
        const itemSpans = [];
        for (const p of li.content || []) {
          if (p.type === "paragraph") itemSpans.push(...spansOf(p));
        }
        items.push(itemSpans);
      }
      out.push({ type: "list", ordered: node.type === "orderedList", items });
    } else if (node.type === "blockquote") {
      const inner = docToBlocks(node);
      out.push({ type: "quote", blocks: inner });
    }
  }
  return out;
}

// ---- Resolve a tile (by id) into one or more of our ContentBlocks -----------

function resolveTile(tileId, warnings) {
  const b = blocks[tileId];
  if (!b) {
    warnings.push(`missing block ${tileId}`);
    return [];
  }
  switch (b.type) {
    case "sectionCalloutTile":
      return [{ type: "eyebrow", text: b.data.text }];

    case "textNode": {
      // Standalone narration/text node (rare at top tile level) - treat as paragraphs
      return docToBlocks(b.data.text);
    }

    case "textTile":
      return docToBlocks(b.data.text);

    case "imageTile": {
      const img = b.data && b.data.image;
      if (!img) return [];
      const src = normalizeImageSrc(img.source);
      return [{ type: "image", src, alt: img.altText || "" }];
    }

    case "processTile": {
      const steps = (b.data.elements || []).map((el) => ({
        title: extractFirstHeadingText(el.content) || "",
        blocks: docToBlocks(el.content),
        imageHint: el.media && el.media.pendingImageDescription ? el.media.pendingImageDescription : null,
      }));
      return [{ type: "process", steps }];
    }

    case "flashcardsTile": {
      const items = (b.data.items || []).map((it) => ({
        front: flattenDocText(it.front),
        back: flattenDocText(it.back),
      }));
      return [{ type: "flashcards", items }];
    }

    case "tabsTile": {
      const tabs = (b.data.items || []).map((it) => ({
        label: it.label,
        blocks: docToBlocks(it.content),
      }));
      return [{ type: "tabs", tabs }];
    }

    case "accordionTile": {
      const items = (b.data.items || []).map((it) => ({
        title: it.header,
        blocks: docToBlocks(it.content),
      }));
      return [{ type: "accordion", items }];
    }

    case "objective":
      return [{ type: "objective", text: b.data.text }];

    case "resource":
      return []; // source docx references - not needed in the rebuilt portal

    case "noteTile":
      return [{ type: "note", blocks: docToBlocks(b.data.content) }];

    case "editableVideoTile":
      return []; // never-rendered Mindsmith AI-video placeholders (video: null in source) - nothing to port

    case "tiledLayout": {
      // nested tiled layout (shouldn't normally occur inside another layout's tile, but handle defensively)
      return resolveTiledLayoutBlocks(b, warnings);
    }

    case "experienceTile":
      return [{ type: "scenario-ref", rootNodeId: b.data.root.id }];

    default:
      warnings.push(`unhandled tile type ${b.type} (${tileId})`);
      return [];
  }
}

function extractFirstHeadingText(doc) {
  if (!doc || !doc.content) return null;
  for (const node of doc.content) {
    if (node.type === "heading") {
      return spansOf(node).map((s) => s.text).join("");
    }
  }
  return null;
}

function flattenDocText(doc) {
  if (!doc || !doc.content) return "";
  const parts = [];
  for (const node of doc.content) {
    if (node.type === "paragraph") {
      parts.push(spansOf(node).map((s) => s.text).join(""));
    }
  }
  return parts.join("\n");
}

function normalizeImageSrc(source) {
  // "./assets/images/xyz.png" -> "/images/xyz.png" (served from /public/images)
  const m = source.match(/assets\/images\/(.+)$/);
  return m ? `/images/${m[1]}` : source;
}

function resolveTiledLayoutBlocks(layoutBlock, warnings) {
  const out = [];
  const rows = (layoutBlock.layout && layoutBlock.layout.rows) || [];
  for (const row of rows) {
    for (const tile of row.tiles || []) {
      out.push(...resolveTile(tile.tileId, warnings));
    }
  }
  return out;
}

// ---- Walk top-level blockOrder into Lessons ----------------------------------

const warnings = [];
const lessons = [];

for (const topId of data.blockOrder) {
  const b = blocks[topId];
  if (!b || b.type !== "tiledLayout") {
    warnings.push(`top-level block ${topId} is not tiledLayout (${b && b.type})`);
    continue;
  }
  const contentBlocks = resolveTiledLayoutBlocks(b, warnings);
  // Drop a leading eyebrow block that just duplicates the module name banner -
  // we render our own module chrome, so keep title only.
  lessons.push({
    sourceId: topId,
    title: b.title,
    blocks: contentBlocks,
  });
}

// ---- Also extract the two dialogueNode/sceneNode trees (branching scenarios) -

function resolvableNextId(next) {
  // Only treat a "next" pointer as real if the target block actually exists -
  // some of the original Mindsmith authoring left dangling ids on "wrong choice"
  // branches that were never generated. Those become terminal dead-ends instead.
  if (!next || next.type !== "node") return null;
  return blocks[next.id] ? next.id : null;
}

function extractScenario(rootId) {
  const nodes = {};
  const visit = (id) => {
    if (nodes[id]) return;
    const b = blocks[id];
    if (!b) return;

    if (b.type === "dialogueNode") {
      const node = {
        id,
        kind: "choice",
        text: flattenDocText(b.data.text),
        characterImage: b.data.characterPose ? normalizeImageSrc(b.data.characterPose.image.source) : null,
        sceneId: b.data.scene ? b.data.scene.id : null,
        options: (b.data.options || []).map((opt) => ({
          text: flattenDocText(opt.text),
          feedback: opt.feedback,
          reactionImage: opt.characterReaction ? normalizeImageSrc(opt.characterReaction.image.source) : null,
          nextId: resolvableNextId(opt.next),
          outcomeId: opt.id,
          isBest: /good$/.test(opt.id || ""),
        })),
      };
      nodes[id] = node;
      for (const opt of node.options) {
        if (opt.nextId) visit(opt.nextId);
      }
    } else if (b.type === "textNode") {
      // Narration/ending beat: auto-advances, or terminates the scenario.
      const isComplete = b.data.next && b.data.next.type === "complete";
      const node = {
        id,
        kind: "narration",
        text: flattenDocText(b.data.text),
        characterImage: b.data.characterPose ? normalizeImageSrc(b.data.characterPose.image.source) : null,
        sceneId: b.data.scene ? b.data.scene.id : null,
        result: isComplete ? b.data.next.result : null, // "correct" | "incorrect" | null
        nextId: isComplete ? null : resolvableNextId(b.data.next),
      };
      nodes[id] = node;
      if (node.nextId) visit(node.nextId);
    }
  };
  visit(rootId);
  return { rootId, nodes };
}

const scenarios = {};
for (const [id, b] of Object.entries(blocks)) {
  if (b.type === "experienceTile") {
    scenarios[id] = extractScenario(b.data.root.id);
  }
}
for (const [id, b] of Object.entries(blocks)) {
  if (b.type === "sceneNode") {
    const bg = b.data.background;
    scenarios["scene:" + id] = {
      name: b.data.name,
      src: normalizeImageSrc(bg.source),
    };
  }
}

// ---- Write output --------------------------------------------------------

const outDir = path.join(ROOT, "src", "content", "generated");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "lessons.json"), JSON.stringify(lessons, null, 2));
fs.writeFileSync(path.join(outDir, "scenarios.json"), JSON.stringify(scenarios, null, 2));

console.log(`Converted ${lessons.length} lessons, ${Object.keys(scenarios).filter(k=>!k.startsWith('scene:')).length} scenario trees.`);
if (warnings.length) {
  console.log("Warnings:");
  for (const w of warnings) console.log(" -", w);
}
