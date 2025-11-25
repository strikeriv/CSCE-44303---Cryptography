import { Observable, from, map } from 'rxjs';
import type { DictionaryAttackResults } from './sha256-salt.types';
import { SHA256Service } from '../part1/sha256.service';

export const SHA256SaltService = {
  dictionaryAttackSalted,
  parsePasswordHashFileSalted,
};

const encoder = new TextEncoder();

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

async function sha256Bytes(bytes: Uint8Array): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new Uint8Array(bytes));
  const arr = new Uint8Array(buf);
  let hex = '';
  for (const b of arr) hex += b.toString(16).padStart(2, '0');
  return hex;
}

export async function dictionaryAttackSalted(
  passwordLength: number,
  saltedHashes: { salt: string; hash: string }[]
): Promise<DictionaryAttackResults> {
  const passwords = SHA256Service.generateAllPasswords(passwordLength);

  const entries = saltedHashes.map((s) => ({
    hash: s.hash,
    saltBytes: hexToBytes(s.salt),
  }));

  const cracked: Record<string, string> = {};
  const start = performance.now();

  for (const pwd of passwords) {
    const pwdBytes = encoder.encode(pwd);

    for (const entry of entries) {
      const merged = new Uint8Array(pwdBytes.length + entry.saltBytes.length);
      merged.set(pwdBytes);
      merged.set(entry.saltBytes, pwdBytes.length);

      const computed = await sha256Bytes(merged);

      if (computed === entry.hash) {
        cracked[entry.hash] = pwd;
      }
    }
  }

  return {
    crackedHashes: cracked,
    timeElapsed: (performance.now() - start) / 1000,
  };
}

function parsePasswordHashFileSalted(
  file: File
): Observable<{ salt: string; hash: string }[]> {
  return from(file.text()).pipe(map(parseDataSalted));
}

function parseDataSalted(text: string): { salt: string; hash: string }[] {
  const lines = text.trim().split('\n');
  const out: { salt: string; hash: string }[] = [];

  for (const line of lines) {
    const match = /\[(.*?),(.*?),(.*?)\]/.exec(line);
    if (!match) continue;

    out.push({
      salt: match[2].trim(),
      hash: match[3].trim(),
    });
  }

  return out;
}
