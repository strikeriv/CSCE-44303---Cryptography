export const vocabularyService = {
  readVocabularyFile,
  parseVocabularyData,
};

async function readVocabularyFile(): Promise<string> {
  return fetch('/vocabulary.txt').then((res) => res.text());
}

function parseVocabularyData(input: string): string {
  const strippedinput = input
    .toLocaleLowerCase()
    .replace(/[^a-zA-Z0-9 ]/gim, '');

  return strippedinput;
}
