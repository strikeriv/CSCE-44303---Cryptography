import { from, map, Observable, switchMap } from 'rxjs';

export const vocabularyService = {
  readVocabularyFile,
  parseVocabularyData,
};

function readVocabularyFile(): Observable<string> {
  return from(fetch('/vocabulary.txt')).pipe(
    switchMap((res) => from(res.text()))
  );
}

function parseVocabularyData(input: string): string {
  const strippedinput = input
    .toLocaleLowerCase()
    .replace(/[^a-zA-Z0-9 ]/gim, '');

  return strippedinput;
}
