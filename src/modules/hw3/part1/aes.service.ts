import { from, map, Observable, switchMap } from "rxjs";
import type { AESKeySize } from "./aes.types";

export const AESService = {
  generateRandomKey: (keySize: AESKeySize) => crypto.getRandomValues(new Uint8Array(keySize)),
  generateRandomIV: () => crypto.getRandomValues(new Uint8Array(16)),
  encrypt,
  decrypt,
};

function encrypt(iv: string, secretKey: string, plaintext: string, keySize: AESKeySize): Observable<string> {
  const paddedIV = new TextEncoder().encode(iv.padEnd(16, " ")).slice(0, 16); // ensure 16 bytes for AES block size (always 16 bytes)

  // pad key depending on key size
  const paddedKey = new TextEncoder().encode(secretKey.padEnd(16, " ")).slice(0, keySize); // ensure key size bytes for AES depending on key size

  return from(crypto.subtle.importKey("raw", paddedKey, "AES-CBC", false, ["encrypt"])).pipe(
    switchMap((secretKey) =>
      crypto.subtle.encrypt(
        {
          name: "AES-CBC",
          iv: paddedIV,
        },
        secretKey,
        new TextEncoder().encode(plaintext)
      )
    ),
    map((buffer) => btoa(String.fromCharCode(...new Uint8Array(buffer))))
  );
}

function decrypt(iv: string, secretKey: string, ciphertext: string, keySize: AESKeySize): Observable<string> {
  const paddedIV = new TextEncoder().encode(iv.padEnd(16, " ")).slice(0, 16); // ensure 16 bytes for AES block size (always 16 bytes)

  const paddedKey = new TextEncoder().encode(secretKey.padEnd(16, " ")).slice(0, keySize); // ensure key size bytes for AES depending on key size

  return from(crypto.subtle.importKey("raw", paddedKey, "AES-CBC", false, ["decrypt"])).pipe(
    switchMap((secretKey) =>
      crypto.subtle.decrypt(
        {
          name: "AES-CBC",
          iv: paddedIV,
        },
        secretKey,
        Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0))
      )
    ),
    map((buffer) => new TextDecoder().decode(buffer))
  );
}
