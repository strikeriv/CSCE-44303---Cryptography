import { from, generate, map, Observable, switchMap } from "rxjs";

export const RSA2048Service = {
  generateKeyPair: () =>
    from(
      crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      )
    ),
  encrypt,
  decrypt,
};

function encrypt(publicKey: CryptoKey, plaintext: string): Observable<string> {
  return from(
    crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      new TextEncoder().encode(plaintext)
    )
  ).pipe(map((buffer) => btoa(String.fromCharCode(...new Uint8Array(buffer)))));
}

function decrypt(privateKey: CryptoKey, ciphertext: string): Observable<string> {
  return from(
    crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      privateKey,
      Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0))
    )
  ).pipe(map((buffer) => new TextDecoder().decode(buffer)));
}
