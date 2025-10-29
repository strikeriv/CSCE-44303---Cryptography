const subtleCrypto = window.crypto.subtle;

const MESSAGE_LENGTH = 18;
const RSA_ALGORITHM = 'RSASSA-PKCS1-v1_5';
const HASH_ALGORITHM = 'SHA-256';
const MODULUS_LENGTH = 2048;

export const DSRSA2048Service = {
  generateKeys,
  verifySignature,
  signMessage,
  arrayBufferToBase64,
};

async function generateKeys() {
  const keys = await subtleCrypto.generateKey(
    {
      name: RSA_ALGORITHM,
      modulusLength: MODULUS_LENGTH,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: HASH_ALGORITHM,
    },
    true,
    ['sign', 'verify']
  );

  return {
    publicKey: arrayBufferToBase64(
      await subtleCrypto.exportKey('spki', keys.publicKey)
    ),
    privateKey: arrayBufferToBase64(
      await subtleCrypto.exportKey('pkcs8', keys.privateKey)
    ),
  };
}

async function signMessage(
  privateKey: string,
  message: string
): Promise<string> {
  const encoder = new TextEncoder();
  const messageBuffer = encoder.encode(message);

  if (messageBuffer.byteLength !== MESSAGE_LENGTH) {
    return 'message-invalid';
  }

  const signatureBuffer = await subtleCrypto.sign(
    { name: RSA_ALGORITHM, hash: HASH_ALGORITHM },
    await importKeyFromBase64(privateKey, 'sign', false),
    messageBuffer
  );

  return arrayBufferToBase64(signatureBuffer);
}

async function verifySignature(
  publicKey: string,
  message: string,
  signature: string
) {
  const encoder = new TextEncoder();
  const messageBuffer = encoder.encode(message);

  const signatureBuffer = base64ToBuffer(signature);

  const isValid = await subtleCrypto.verify(
    { name: RSA_ALGORITHM, hash: HASH_ALGORITHM },
    await importKeyFromBase64(publicKey, 'verify', true),
    signatureBuffer,
    messageBuffer
  );

  return isValid ? 'Signature is valid.' : 'Signature is invalid.';
}

async function importKeyFromBase64(
  base64Key: string,
  usage: 'sign' | 'verify',
  isPublic: boolean
): Promise<CryptoKey> {
  const binaryString = atob(base64Key);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.codePointAt(i)!;
  }

  const keyFormat = isPublic ? 'spki' : 'pkcs8';

  return subtleCrypto.importKey(
    keyFormat,
    bytes,
    {
      name: RSA_ALGORITHM,
      hash: HASH_ALGORITHM,
    },
    true,
    [usage]
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCodePoint(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.codePointAt(i)!;
  }
  return bytes.buffer;
}
