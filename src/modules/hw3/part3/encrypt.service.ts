import { AESService } from "../part1/aes.service";
import type { AESKeySize } from "../part1/aes.types";

export const EncryptService = {
  encryptAES,
};

function encryptAES(iv: string, secretKey: string, plaintext: string, keySize: AESKeySize) {
  return AESService.encrypt(iv, secretKey, plaintext, keySize);
}
