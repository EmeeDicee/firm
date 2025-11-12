"use client";
import { SessionProvider } from "next-auth/react";
import TranslationProvider from "@/components/global/TranslationProvider";
import AutoTranslator from "@/components/global/AutoTranslator";
import MetaTranslator from "@/components/global/MetaTranslator";

export default function Providers({ children, enableTranslation = true }: { children: React.ReactNode; enableTranslation?: boolean }) {
  return (
    <SessionProvider>
      {enableTranslation ? (
        <TranslationProvider>
          {children}
          <AutoTranslator />
          <MetaTranslator />
        </TranslationProvider>
      ) : (
        <>{children}</>
      )}
    </SessionProvider>
  );
}
