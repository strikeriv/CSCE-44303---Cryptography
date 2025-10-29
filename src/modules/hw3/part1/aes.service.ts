import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  type BinaryLike,
  type CipherKey,
} from 'node:crypto';
import type { AESAlgorithm, AESKeySize } from './aes.types';

export const AESService = {
  generateRandomKey: (keySize: AESKeySize) => randomBytes(keySize),
  generateRandomIV: () => randomBytes(16),
  encrypt,
  decrypt,
  toHex,
};

function encrypt(
  algorithm: AESAlgorithm,
  key: CipherKey,
  iv: BinaryLike,
  plaintext: string
): string {
  const cipher = createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
}

function decrypt(
  algorithm: AESAlgorithm,
  key: CipherKey,
  iv: BinaryLike,
  ciphertext: string
): string {
  const decipher = createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// used for converting key & iv to same output format (hex)
function toHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
