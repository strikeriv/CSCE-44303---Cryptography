import type { EncryptMode } from './encrypt.types';

const uppercaseLow = 65;
const uppercaseHigh = 90;

const lowercaseLow = 97;
const lowercaseHigh = 122;

const buffer = 26;

/*
    IgnoreCase: converts all to lowerCase
    MaintainCase: converts capital vs non-capital seperately
*/
export const encryptService = {
  encrypt: (
    input: string,
    key: number,
    mode: EncryptMode = 'MaintainCase'
  ): string => {
    if (mode === 'IgnoreCase') {
      input = input.toLocaleLowerCase();
    }

    const blocks = input.split(' ');

    return blocks
      .map((block) =>
        block
          .split('')
          .map((l) => caesarShiftCharacter(l, key, mode))
          .join('')
      )
      .join(' ');
  },
};

function caesarShiftCharacter(char: string, offset: number, mode: EncryptMode) {
  if (mode === 'IgnoreCase') return caesarShiftIgnoreCase(char, offset);
  if (mode === 'MaintainCase') return caesarShiftMaintainCase(char, offset);
}

function caesarShiftIgnoreCase(char: string, offset: number) {
  const unicode = char.charCodeAt(0);

  if (unicode < lowercaseLow || unicode > lowercaseHigh) return char;
  const constrainedOffset =
    ((unicode - lowercaseLow + offset) % buffer) + lowercaseLow;

  return String.fromCharCode(constrainedOffset);
}

function caesarShiftMaintainCase(char: string, offset: number) {
  const unicode = char.charCodeAt(0);

  // check if char outside valid letter unicode
  if (unicode < uppercaseLow || unicode > lowercaseHigh) return char;

  // check if the char is lowercase
  if (unicode > uppercaseHigh) {
    return caesarShiftIgnoreCase(char, offset);
  }

  const constrainedOffset =
    ((unicode - uppercaseLow + offset) % buffer) + uppercaseLow;

  return String.fromCharCode(constrainedOffset);
}
