// lib/hash.ts

export async function nhash(data: string): Promise<bigint> {
  // Use Web Crypto API for browser compatibility
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = new Uint8Array(hashBuffer);

  // Convert to hex string
  const hexDig = Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return BigInt("0x" + hexDig);
}

export function generateRandomSalt(): number {
  return Math.floor(Math.random() * 1000000);
}

export function encodeBirthDate(birthDate: string): number {
  // Convert date to timestamp (milliseconds since epoch)
  return new Date(birthDate).getTime();
}

export async function calculateData(
  name: string,
  surname: string,
  taxNumber: string,
  birthDate: string,
  timestamp: number,
  salt: number
): Promise<bigint> {
  const nameHash = await nhash(name);
  const surnameHash = await nhash(surname);
  const taxHash = await nhash(taxNumber);
  const birthDateNumeric = BigInt(encodeBirthDate(birthDate));
  const timestampBig = BigInt(timestamp);
  const saltBig = BigInt(salt);

  const sum =
    nameHash +
    surnameHash +
    taxHash +
    birthDateNumeric +
    timestampBig +
    saltBig;

  // Formula corretta: 3 * 2^30 + 1
  const modulus = BigInt(3) * BigInt(2) ** BigInt(30) + BigInt(1);

  return sum % modulus;
}

export interface UserToken {
  nameHash: string;
  surnameHash: string;
  birthDateEncoded: number;
  timestamp: number;
  salt: number;
}

export function saveUserToken(token: UserToken): void {
  // Store in memory since localStorage is not supported in Claude.ai artifacts
  (window as any).userToken = token;
}

export function getUserToken(): UserToken | null {
  return (window as any).userToken || null;
}
