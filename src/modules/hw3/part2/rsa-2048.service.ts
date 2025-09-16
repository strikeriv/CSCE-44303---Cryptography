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

function encrypt(): Observable<string> {}

function decrypt(): Observable<string> {}
