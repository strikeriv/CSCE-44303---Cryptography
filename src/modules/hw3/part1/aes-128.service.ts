import { from, map, Observable, switchMap } from "rxjs";

export const AES128Service = {
  generateRandomKey: () => crypto.getRandomValues(new Uint8Array(16)),
  generateRandomIV: () => crypto.getRandomValues(new Uint8Array(16)),
  encrypt,
  decrypt,
};

function encrypt(iv: string, secretKey: string, ciphertext: string): Observable<string> {
  const paddedIV = new TextEncoder().encode(iv.padEnd(16, " ")).slice(0, 16); // ensure 16 bytes for AES block size
  const paddedKey = new TextEncoder().encode(secretKey.padEnd(16, " ")).slice(0, 16); // ensure 16 bytes for AES-128

  return from(crypto.subtle.importKey("raw", paddedKey, "AES-CBC", false, ["encrypt"])).pipe(
    switchMap((secretKey) =>
      crypto.subtle.encrypt(
        {
          name: "AES-CBC",
          iv: paddedIV,
        },
        secretKey,
        new TextEncoder().encode(ciphertext)
      )
    ),
    map((buffer) => btoa(String.fromCharCode(...new Uint8Array(buffer))))
  );
}

function decrypt(iv: string, secretKey: string, ciphertext: string): Observable<string> {
  const paddedIV = new TextEncoder().encode(iv.padEnd(16, " ")).slice(0, 16); // ensure 16 bytes for AES block size
  const paddedKey = new TextEncoder().encode(secretKey.padEnd(16, " ")).slice(0, 16); // ensure 16 bytes for AES-128

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
