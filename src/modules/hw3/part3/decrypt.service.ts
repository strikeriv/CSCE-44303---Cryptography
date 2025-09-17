import { AESService } from "../part1/aes.service";
import type { AESKeySize } from "../part1/aes.types";

export const EncryptService = {
  decryptAES,
};

function decryptAES(iv: string, secretKey: string, plaintext: string, keySize: AESKeySize) {
  return AESService.decrypt(iv, secretKey, plaintext, keySize);
}
