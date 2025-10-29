import { createHmac, randomBytes } from 'node:crypto';
import type { MessageSize } from './hmac-sha.types';

export const HMACSHAService = {
  generateRandomKey: () => randomBytes(16),
  generateHMAC,
  verifySignature,
  toHex,
};

function generateHMAC(
  messageSize: MessageSize,
  key: Buffer<ArrayBufferLike>,
  message: string
): string {
  const buffer = Buffer.from(message, 'utf-8');

  // check key for requirement
  if (key.length !== 16) {
    return 'key-invalid';
  }

  // check if 18 bit for requirement
  if (buffer.length !== messageSize) {
    return 'message-invalid';
  }

  const hmac = createHmac('sha256', key);
  hmac.update(buffer);

  return hmac.digest('hex');
}

function verifySignature(
  key: Buffer<ArrayBufferLike>,
  message: string,
  signature: string
): string {
  const buffer = Buffer.from(message, 'utf-8');

  // check key for requirement
  if (key.length !== 16) {
    return 'key-invalid';
  }

  // check if 18 bit for requirement
  if (buffer.length !== 18) {
    return 'message-invalid';
  }

  const hmac = createHmac('sha256', key);
  hmac.update(buffer);
  const computedSignature = hmac.digest('hex');

  try {
    const receivedSigBuffer = Buffer.from(signature, 'hex');
    const computedSigBuffer = Buffer.from(computedSignature, 'hex');

    if (receivedSigBuffer.length !== computedSigBuffer.length) {
      return 'HMAC is invalid.';
    }

    return manualTimingSafeEqual(receivedSigBuffer, computedSigBuffer)
      ? 'HMAC is valid.'
      : 'HMAC is invalid.';
  } catch {
    return 'HMAC is invalid.';
  }
}

// couldn't get the crypto one to work, so using this
function manualTimingSafeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }

  return result === 0;
}

function toHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
