// src/lib/qr-token-store.ts
const qrTokens = new Map<string, { userId: string | undefined; expiry: number }>();

export function storeToken(userId: string | undefined) {
  const tokenId = crypto.randomUUID();
  const expiry = Date.now() + 2 * 60 * 1000; // 2 minutes
  qrTokens.set(tokenId, { userId, expiry });
  return tokenId;
}

export function getTokenData(tokenId: string) {
  const data = qrTokens.get(tokenId);
  if (!data || data.expiry < Date.now()) {
    qrTokens.delete(tokenId);
    return null;
  }
  return data;
}
