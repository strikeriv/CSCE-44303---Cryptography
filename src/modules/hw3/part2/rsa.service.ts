import { from, map, Observable } from 'rxjs';
import type { RSAModulusLength } from './rsa.types';

export const RSAService = {
  generateKeyPair: (modulusLength: RSAModulusLength) =>
    from(
      crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      )
    ),
  importPublicKey: (publicKey: string) =>
    from(
      crypto.subtle.importKey(
        'spki',
        base64ToArrayBuffer(publicKey),
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        true,
        ['encrypt']
      )
    ),
  importPrivateKey: (privateKey: string) =>
    from(
      crypto.subtle.importKey(
        'pkcs8',
        base64ToArrayBuffer(privateKey),
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        true,
        ['decrypt']
      )
    ),
  encrypt,
  decrypt,
};

function encrypt(publicKey: CryptoKey, plaintext: string): Observable<string> {
  return from(
    crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      new TextEncoder().encode(plaintext)
    )
  ).pipe(map((buffer) => btoa(String.fromCharCode(...new Uint8Array(buffer)))));
}

function decrypt(
  privateKey: CryptoKey,
  ciphertext: string
): Observable<string> {
  return from(
    crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      privateKey,
      Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0))
    )
  ).pipe(map((buffer) => new TextDecoder().decode(buffer)));
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
