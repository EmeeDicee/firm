export async function translateText({
  text,
  target,
  source,
}: {
  text: string;
  target: string;
  source?: string;
}): Promise<{ translatedText: string; detectedSourceLanguage?: string } | null> {
  const googleKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  try {
    if (googleKey) {
      const res = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${googleKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q: text, target, ...(source ? { source } : {}), format: "text" }),
        }
      );
      const j = await res.json();
      const data = j?.data?.translations?.[0];
      if (!data) return null;
      return { translatedText: data.translatedText, detectedSourceLanguage: data.detectedSourceLanguage };
    }
    // Fallback: LibreTranslate (public instance or self-hosted)
    const libreUrl = process.env.LIBRE_TRANSLATE_URL || "https://libretranslate.com/translate";
    const libreKey = process.env.LIBRE_TRANSLATE_API_KEY;
    const body: { q: string; target: string; source?: string; format: string; api_key?: string } = {
      q: text,
      target,
      ...(source ? { source } : {}),
      format: "text",
    };
    if (libreKey) body.api_key = libreKey;
    const res = await fetch(libreUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const j = await res.json();
    if (!j?.translatedText) return null;
    return { translatedText: j.translatedText };
  } catch {
    return null;
  }
}