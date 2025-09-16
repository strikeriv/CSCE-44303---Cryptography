import { forkJoin, from } from "rxjs";
import { RSA2048Service } from "../../modules/hw3/part2/rsa-2048.service";

declare global {
  interface Window {
    encrypt: (event: SubmitEvent) => void;
    decrypt: (event: SubmitEvent) => void;
  }
}

interface EncryptInput {
  plaintext: string;
}

// spans for RSA
const $aes128EncryptElement = document.getElementById("aes-128-encrypt-span") as HTMLInputElement;
const $aes128DecryptElement = document.getElementById("aes-128-decrypt-span") as HTMLInputElement;

const $aes192EncryptElement = document.getElementById("aes-192-encrypt-span") as HTMLInputElement;
const $aes192DecryptElement = document.getElementById("aes-192-decrypt-span") as HTMLInputElement;

const $aes256EncryptElement = document.getElementById("aes-256-encrypt-span") as HTMLInputElement;
const $aes256DecryptElement = document.getElementById("aes-256-decrypt-span") as HTMLInputElement;
// const $privateKeyInputElement = document.getElementById("private-key-input") as HTMLInputElement;

// const $encryptOutputElement = document.getElementById("encrypt-output") as HTMLTextAreaElement;
// const $decryptOutputElement = document.getElementById("decrypt-output") as HTMLTextAreaElement;

$aes128EncryptElement.textContent = "N/A";
