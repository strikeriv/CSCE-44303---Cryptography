import {
  from,
  map,
  mergeMap,
  filter,
  bufferCount,
  toArray,
  Observable,
} from 'rxjs';
import type { DictionaryAttackResults } from './sha256.types';

export const SHA256Service = {
  dictionaryAttack,
  parsePasswordHashFile,

  generateAllPasswords,
  sha256,
};

const charset =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#$%^&*';

function generateAllPasswords(length: number): string[] {
  const results: string[] = [];
  const n = charset.length;

  const indices = new Array(length).fill(0);

  while (true) {
    // Build password from indices
    results.push(indices.map((i) => charset[i]).join(''));

    let pos = length - 1;
    while (pos >= 0) {
      indices[pos]++;
      if (indices[pos] < n) break;
      indices[pos] = 0;
      pos--;
    }

    if (pos < 0) break;
  }

  return results;
}

function sha256(message: string): Observable<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  return from(crypto.subtle.digest('SHA-256', data)).pipe(
    map((buffer) => Array.from(new Uint8Array(buffer))),
    map((bytes) => bytes.map((b) => b.toString(16).padStart(2, '0')).join(''))
  );
}

function dictionaryAttack(
  passwordLength: number,
  hashes: string[]
): Observable<DictionaryAttackResults> {
  const hashSet = new Set(hashes);

  const passwords = generateAllPasswords(passwordLength);

  const start = performance.now();

  return from(passwords).pipe(
    bufferCount(500),
    mergeMap((batch) =>
      from(batch).pipe(
        mergeMap((pwd) => sha256(pwd).pipe(map((hash) => ({ pwd, hash })))),
        filter(({ hash }) => hashSet.has(hash))
      )
    ),
    toArray(),
    map((matches) => {
      const crackedHashes: Record<string, string> = {};

      for (const { pwd, hash } of matches) {
        crackedHashes[hash] = pwd;
      }

      const end = performance.now();
      const timeElapsed = (end - start) / 1000; // seconds

      return {
        crackedHashes,
        timeElapsed,
      } as DictionaryAttackResults;
    })
  );
}

function parsePasswordHashFile(file: File): Observable<string[]> {
  return from(file.text()).pipe(map((text) => parseData(text)));
}

function parseData(text: string): string[] {
  const hashes: string[] = [];
  const lines = text.trim().split('\n');

  for (const line of lines) {
    const match = new RegExp(/\[(.*?),(.*?)\]/).exec(line);
    if (match) {
      hashes.push(match[2].trim());
    }
  }

  return hashes;
}
