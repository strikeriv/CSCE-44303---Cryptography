import { decryptService } from '../modules/decrypt/decrypt.service';
import type { EncryptMode } from '../modules/encrypt/encrypt.types';

declare global {
  interface Window {
    decrypt: (event: SubmitEvent) => void;
    bruteForce: (event: SubmitEvent) => void;
  }
}

interface DecryptInput {
  input: string;
  key: string;
  strategy: EncryptMode;
}

interface BruteForceInput {
  input: string;
  dictionaryFile: File;
  strategy: EncryptMode;
}

const $decryptOutputElement = document.getElementById(
  'decrypt-output'
) as HTMLTextAreaElement;

const $bruteForceOutputElement = document.getElementById(
  'bruteforce-output'
) as HTMLTextAreaElement;

function decrypt(event: SubmitEvent) {
  event.preventDefault();

  const form = event.target! as HTMLFormElement;
  const formData = new FormData(form);
  const { input, key, strategy } = Object.fromEntries(
    formData
  ) as unknown as DecryptInput;

  if (!input) {
    $decryptOutputElement.textContent = 'No ciphertext to decrypt.';
    return;
  }

  $decryptOutputElement.textContent = decryptService.decrypt(
    input,
    parseInt(key),
    strategy
  );
}

function bruteForce(event: SubmitEvent) {
  event.preventDefault();

  const form = event.target! as HTMLFormElement;
  const formData = new FormData(form);
  const { input, dictionaryFile, strategy } = Object.fromEntries(
    formData
  ) as unknown as BruteForceInput;

  const dictionaryUrl = URL.createObjectURL(dictionaryFile);

  if (!input) {
    $bruteForceOutputElement.textContent = 'No ciphertext to decrypt.';
    return;
  }

  if (!dictionaryFile.name) {
    $bruteForceOutputElement.textContent = 'No dictionary file chosen.';
    return;
  }

  decryptService
    .bruteForceDecrypt(
      dictionaryUrl,
      input.toString(),
      strategy.toString() as EncryptMode
    )
    .subscribe((result) => {
      const { decrypted, key, plaintext } = result;

      if (!decrypted) {
        $bruteForceOutputElement.textContent = 'No plaintext was found.';
      } else {
        $bruteForceOutputElement.textContent = `Key = ${key}\n---\n${plaintext}`;
      }
    });
}

window.decrypt = decrypt;
window.bruteForce = bruteForce;
