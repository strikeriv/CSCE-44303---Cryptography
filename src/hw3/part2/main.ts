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

interface DecryptInput {
  ciphertext: string;
}

let bobKeyPair: CryptoKeyPair;

const $publicKeyInputElement = document.getElementById("public-key-input") as HTMLInputElement;
const $privateKeyInputElement = document.getElementById("private-key-input") as HTMLInputElement;

const $encryptOutputElement = document.getElementById("encrypt-output") as HTMLTextAreaElement;
const $decryptOutputElement = document.getElementById("decrypt-output") as HTMLTextAreaElement;

function encrypt(event: SubmitEvent) {
  event.preventDefault();

  const form = event.target! as HTMLFormElement;
  const formData = new FormData(form);
  const { plaintext } = Object.fromEntries(formData) as unknown as EncryptInput;

  if (!plaintext) {
    $encryptOutputElement.textContent = "No plaintext to encrypt.";
    return;
  }

  RSA2048Service.encrypt(bobKeyPair.publicKey, plaintext).subscribe((ciphertext) => {
    $encryptOutputElement.textContent = ciphertext;
  });
}

function decrypt(event: SubmitEvent) {
  event.preventDefault();

  const form = event.target! as HTMLFormElement;
  const formData = new FormData(form);
  const { ciphertext } = Object.fromEntries(formData) as unknown as DecryptInput;

  if (!ciphertext) {
    $decryptOutputElement.textContent = "No ciphertext to decrypt.";
    return;
  }

  RSA2048Service.decrypt(bobKeyPair.privateKey, ciphertext).subscribe((plaintext) => {
    $decryptOutputElement.textContent = plaintext;
  });
}

// generate key value pair on load
function init() {
  RSA2048Service.generateKeyPair().subscribe((keyPair) => {
    bobKeyPair = keyPair;

    forkJoin({
      publicKey: from(crypto.subtle.exportKey("spki", keyPair.publicKey)),
      privateKey: from(crypto.subtle.exportKey("pkcs8", keyPair.privateKey)),
    }).subscribe(({ publicKey, privateKey }) => {
      $publicKeyInputElement.value = btoa(String.fromCharCode(...new Uint8Array(publicKey)));
      $privateKeyInputElement.value = btoa(String.fromCharCode(...new Uint8Array(privateKey)));
    });
  });
}

init();

window.encrypt = encrypt;
window.decrypt = decrypt;
