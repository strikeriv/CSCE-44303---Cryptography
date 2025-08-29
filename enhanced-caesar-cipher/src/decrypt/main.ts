import { decryptService } from '../modules/decrypt/decrypt.service';
import type { EncryptMode } from '../modules/encrypt/encrypt.types';

declare global {
  interface Window {
    decrypt: (event: SubmitEvent) => void;
    bruteForce: (event: SubmitEvent) => void;
  }
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
  const { input, key, strategy } = Object.fromEntries(formData);

  $decryptOutputElement.textContent = decryptService.decrypt(
    input.toString(),
    parseInt(key.toString()),
    strategy.toString() as EncryptMode
  );
}

function bruteForce(event: SubmitEvent) {
  event.preventDefault();

  const form = event.target! as HTMLFormElement;
  const formData = new FormData(form);
  const { input, strategy } = Object.fromEntries(formData);

  decryptService
    .bruteForceDecrypt(input.toString(), strategy.toString() as EncryptMode)
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
