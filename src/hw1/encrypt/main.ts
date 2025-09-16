import { encryptService } from "../../modules/hw1/encrypt/encrypt.service";
import type { EncryptMode } from "../../modules/hw1/encrypt/encrypt.types";

declare global {
  interface Window {
    encrypt: (event: SubmitEvent) => void;
  }
}

interface EncryptInput {
  input: string;
  key: string;
  strategy: EncryptMode;
}

const $encryptOutputElement = document.getElementById("encrypt-output") as HTMLTextAreaElement;

function encrypt(event: SubmitEvent) {
  event.preventDefault();

  const form = event.target! as HTMLFormElement;
  const formData = new FormData(form);
  const { input, key, strategy } = Object.fromEntries(formData) as unknown as EncryptInput;

  if (!input) {
    $encryptOutputElement.textContent = "No plaintext to encrypt.";
    return;
  }

  $encryptOutputElement.textContent = encryptService.encrypt(input, parseInt(key), strategy);
}

window.encrypt = encrypt;
