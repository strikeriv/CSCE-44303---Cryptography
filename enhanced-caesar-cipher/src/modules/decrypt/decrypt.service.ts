import { forkJoin, map, switchMap, type Observable } from 'rxjs';
import { encryptService } from '../encrypt/encrypt.service';
import type { EncryptMode } from '../encrypt/encrypt.types';
import { vocabularyService } from '../vocabulary/vocabulary.service';

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
  return vocabularyService.readVocabularyFile().pipe(
    map((vocabulary) => vocabularyService.parseVocabularyData(vocabulary)),
    switchMap((dictionary) =>
      forkJoin({
        dictionary,
        analysis: Array.from({ length: 25 }).map((_, key) =>
          decrypt(input, key, mode)
        ),
      })
    ),
    map(({ dictionary, analysis }) => {
      console.log(dictionary, analysis);
    })
  );
}
