import { from, Observable, switchMap } from 'rxjs';
import type { AnalysisResult } from './vocabulary.types';

export const vocabularyService = {
  readVocabularyFile,
  parseVocabularyData,
  analyzeDecryptedText,
};

function readVocabularyFile(url: string): Observable<string> {
  return from(fetch(url)).pipe(switchMap((res) => from(res.text())));
}

function parseVocabularyData(input: string): string {
  return stripTextOfSpecialCharacters(input);
}

function analyzeDecryptedText(
  text: string,
  key: number,
  dictionary: string[]
): AnalysisResult {
  const words = stripTextOfSpecialCharacters(text).split(' ');

  const matches = words.map((word) => dictionary.includes(word));
  const match = matches.filter((m) => m === true);

  return {
    found: match.length > 0, // at least one word matches
    key, // index of first matching word
    plaintext: text, // decrypted text
  };
}

function stripTextOfSpecialCharacters(input: string): string {
  return input.toLocaleLowerCase().replace(/[^a-zA-Z0-9 ]/gim, '');
}
