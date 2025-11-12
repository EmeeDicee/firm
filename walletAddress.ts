const BASE58 = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
// Bech32 (bc1...) simplified validation (lowercase, HRP bc)
const BECH32 = /^bc1[ac-hj-np-z02-9]{11,71}$/;

export function isValidBtcAddress(addr: string): boolean {
  if (!addr || typeof addr !== "string") return false;
  const a = addr.trim();
  return BASE58.test(a) || BECH32.test(a);
}

export function normalizeBtcAddress(addr: string): string {
  return addr.trim();
}