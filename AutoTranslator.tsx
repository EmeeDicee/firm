"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "./TranslationProvider";

function isVisible(node: Node): boolean {
  if (!(node instanceof Element)) return true;
  const style = window.getComputedStyle(node as Element);
  return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
}

function shouldSkip(el: Element): boolean {
  if (el.closest("[data-no-translate]")) return true;
  const tag = el.tagName.toLowerCase();
  // Skip non-textual or sensitive inputs
  return ["script", "style", "noscript"].includes(tag);
}

export default function AutoTranslator() {
  const { t, lang } = useTranslation();
  const originals = useRef<WeakMap<Text, string>>(new WeakMap());

  useEffect(() => {
    let cancelled = false;

    async function translateTextNode(node: Text) {
      const parent = node.parentElement;
      if (!parent || shouldSkip(parent) || !isVisible(parent)) return;
      const original = originals.current.get(node) ?? (node.nodeValue || "");
      if (!originals.current.has(node)) originals.current.set(node, original);
      const cleaned = original.replace(/\s+/g, " ").trim();
      if (!cleaned) return;
      // If switching back to default language, restore original
      if ((document.documentElement.lang || "en").split(/[-_]/)[0] === "en") {
        node.nodeValue = original;
        return;
      }
      const translated = await t(cleaned).catch(() => cleaned);
      if (cancelled) return;
      if (translated && translated !== cleaned) {
        // Preserve surrounding whitespace
        const currentBase = originals.current.get(node) || original;
        node.nodeValue = currentBase.replace(cleaned, translated);
      }
    }

    function walkAndTranslate(root: Element) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => {
          const p = (n as Text).parentElement;
          if (!p) return NodeFilter.FILTER_SKIP;
          if (shouldSkip(p)) return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      const batch: Text[] = [];
      let node: Text | null = walker.nextNode() as Text | null;
      while (node) {
        batch.push(node);
        node = walker.nextNode() as Text | null;
      }
      // Process in small batches to avoid blocking UI
      const chunkSize = 50;
      (async function run() {
        for (let i = 0; i < batch.length; i += chunkSize) {
          const chunk = batch.slice(i, i + chunkSize);
          await Promise.all(chunk.map(translateTextNode));
          if (cancelled) return;
          await new Promise((r) => setTimeout(r, 0));
        }
      })();
    }

    // Initial run
    walkAndTranslate(document.body);

    // Observe DOM changes
    const obs = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === Node.TEXT_NODE) {
            translateTextNode(n as Text);
          } else if (n.nodeType === Node.ELEMENT_NODE) {
            walkAndTranslate(n as Element);
          }
        });
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      obs.disconnect();
    };
    // Re-run when language changes
  }, [t, lang]);

  return null;
}