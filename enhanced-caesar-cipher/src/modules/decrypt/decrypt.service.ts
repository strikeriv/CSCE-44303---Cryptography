import { encryptService } from '../encrypt/encrypt.service';
import type { EncryptMode } from '../encrypt/encrypt.types';

export const decryptService = {
  decrypt,
  bruteForceDecrypt,
};

function decrypt(
  input: string,
  key: number,
  mode: EncryptMode = 'MaintainCase'
): string {
  return encryptService.encrypt(input, 26 - key, mode);
}

function bruteForceDecrypt(input: string, mode: EncryptMode = 'MaintainCase') {
  return input;
}
