import { prisma } from "@/lib/prisma";

type Cache = { btc: string | null; updatedAt: number };
const g = globalThis as { __walletCache?: Cache };
g.__walletCache ||= { btc: null, updatedAt: 0 };

export async function getCachedBtcAddress(): Promise<string | null> {
  return g.__walletCache!.btc;
}

export async function setCachedBtcAddress(value: string | null) {
  g.__walletCache!.btc = value;
  g.__walletCache!.updatedAt = Date.now();
}

// Load BTC wallet address from AppSetting table (key: 'btc_wallet')
export async function loadBtcAddressFromDB(): Promise<string | null> {
  try {
    const setting = await prisma.appSetting.findUnique({ where: { key: "btc_wallet" } });
    const value = setting?.value ?? null;
    await setCachedBtcAddress(value);
    return value;
  } catch {
    return null;
  }
}

// Upsert BTC wallet address into AppSetting and refresh in-memory cache
export async function upsertBtcAddress(value: string) {
  await prisma.appSetting.upsert({
    where: { key: "btc_wallet" },
    update: { value },
    create: { key: "btc_wallet", value },
  });
  await setCachedBtcAddress(value);
}