export type ReviewResult = {
  text: string;
  changed: boolean;
  notes: string[];
};

const TERMINOLOGY_MAP: Record<string, string> = {
  // synonyms -> standardized term
  "support agent": "Support Specialist",
  "support team": "Support Team",
  "help desk": "Support Team",
  "chatbot": "Assistant",
  "rep": "Specialist",
};

const BANNED_TERMS: string[] = [
  // add brand-restricted or sensitive terms here
  "guarantee", // avoid legal guarantees
  "free forever", // avoid misleading claims
];

export function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

export function ensureSentenceCase(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  const withCapital = trimmed[0].toUpperCase() + trimmed.slice(1);
  const needsPeriod = /[.!?]$/.test(withCapital) ? withCapital : withCapital + ".";
  return needsPeriod;
}

export function standardizeTerminology(input: string): string {
  let text = input;
  for (const [needle, replacement] of Object.entries(TERMINOLOGY_MAP)) {
    const re = new RegExp(`\\b${needle}\\b`, "gi");
    text = text.replace(re, replacement);
  }
  return text;
}

export function reviewCopy(input: string): ReviewResult {
  const notes: string[] = [];
  let text = normalizeWhitespace(input);
  const before = text;
  // flag banned terms
  for (const term of BANNED_TERMS) {
    const re = new RegExp(`\\b${term}\\b`, "i");
    if (re.test(text)) notes.push(`Avoid term: \"${term}\"`);
  }
  // standardize terminology and sentence case
  text = standardizeTerminology(text);
  text = ensureSentenceCase(text);
  return {
    text,
    changed: text !== before,
    notes,
  };
}