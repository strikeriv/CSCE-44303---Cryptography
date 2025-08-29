import { encryptService } from '../modules/encrypt/encrypt.service';
import type { EncryptMode } from '../modules/encrypt/encrypt.types';

declare global {
  interface Window {
    encrypt: (event: SubmitEvent) => void;
  }
}

const $encryptOutputElement = document.getElementById(
  'encrypt-output'
) as HTMLTextAreaElement;

function encrypt(event: SubmitEvent) {
  event.preventDefault();

  const form = event.target! as HTMLFormElement;
  const formData = new FormData(form);
  const { input, key, strategy } = Object.fromEntries(formData);

  if (!input) {
    $encryptOutputElement.textContent = 'No plaintext to encrypt.';
    return;
  }

  $encryptOutputElement.textContent = encryptService.encrypt(
    input.toString(),
    parseInt(key.toString()),
    strategy.toString() as EncryptMode
  );
}

window.encrypt = encrypt;
