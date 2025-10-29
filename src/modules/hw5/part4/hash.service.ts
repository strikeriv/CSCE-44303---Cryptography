import { createHash, randomBytes } from 'node:crypto';

export const HashService = {
  H,
  randomMessage,
};

function H(message: Buffer<ArrayBufferLike>) {
  const hash = createHash('sha256').update(message).digest();

  // first 8 bits of sha256 hash
  const firstByte = hash.subarray(0, 1);

  return firstByte.toString('hex');
}

function randomMessage() {
  const length = Math.floor(Math.random() * 32) + 1;
  return randomBytes(length);
}
