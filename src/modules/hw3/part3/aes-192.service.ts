// AES 198-bit is not supported by the Web Crypto API
// We use a different library to implement
import { createCipheriv, randomBytes } from 'crypto';
import { of } from 'rxjs';

export const AES192Service = {
  encrypt,
};

function encrypt(iv: Buffer<ArrayBufferLike>, plaintext: string) {
  const key = randomBytes(24);

  const cipher = createCipheriv('aes-192-cbc', key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return of(encrypted);
}
