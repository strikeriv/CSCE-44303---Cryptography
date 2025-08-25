import { map, type Observable } from "rxjs";
import { encryptService } from "../encrypt/encrypt.service";
import type { EncryptMode } from "../encrypt/encrypt.types";
import { vocabularyService } from "../vocabulary/vocabulary.service";
import type { BruteForceResult } from "./decrypt.types";

export const decryptService = {
  decrypt,
  bruteForceDecrypt,
};

function decrypt(input: string, key: number, mode: EncryptMode = "MaintainCase"): string {
  return encryptService.encrypt(input, 26 - key, mode);
}

function bruteForceDecrypt(input: string, mode: EncryptMode = "MaintainCase"): Observable<BruteForceResult> {
  return vocabularyService.readVocabularyFile().pipe(
    map((vocabulary) => vocabularyService.parseVocabularyData(vocabulary)),
    map((vocabulary) => {
      const analysis = Array.from({ length: 25 })
        .map((_, key) => decrypt(input, key, mode))
        .map((decryptedText, key) => vocabularyService.analyzeDecryptedText(decryptedText, key, vocabulary.split(" ")));

      const match = analysis.find((a) => a.found);

      return {
        decrypted: !!match,
        key: match?.key,
        plaintext: match?.plaintext,
      };
    })
  );
}
