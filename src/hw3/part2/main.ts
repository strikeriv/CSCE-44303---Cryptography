import { forkJoin, from, of, switchMap } from 'rxjs';
import { RSA2048Service } from '../../modules/hw3/part2/rsa.service';

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

let publicKeyReadable: string;
let privateKeyReadable: string;

const $publicKeyInputElement = document.getElementById(
  'public-key-input'
) as HTMLInputElement;
const $privateKeyInputElement = document.getElementById(
  'private-key-input'
) as HTMLInputElement;

const $encryptOutputElement = document.getElementById(
  'encrypt-output'
) as HTMLTextAreaElement;
const $decryptOutputElement = document.getElementById(
  'decrypt-output'
) as HTMLTextAreaElement;

function encrypt(event: SubmitEvent) {
  event.preventDefault();

  const form = event.target! as HTMLFormElement;
  const formData = new FormData(form);
  const { plaintext } = Object.fromEntries(formData) as unknown as EncryptInput;

  if (!plaintext) {
    $encryptOutputElement.textContent = 'No plaintext to encrypt.';
    return;
  }

  // check to see if public key input has been changed
  let publicKey$ = of(bobKeyPair.publicKey);

  const publicKeyInput = $publicKeyInputElement.value;
  if (publicKeyInput !== publicKeyReadable) {
    // public key has been changed, use the value from the input
    publicKey$ = RSA2048Service.importPublicKey(publicKeyInput);
  }

  publicKey$
    .pipe(
      switchMap((publicKey) => RSA2048Service.encrypt(publicKey, plaintext))
    )
    .subscribe((ciphertext) => {
      $encryptOutputElement.textContent = ciphertext;
    });
}

function decrypt(event: SubmitEvent) {
  event.preventDefault();

  const form = event.target! as HTMLFormElement;
  const formData = new FormData(form);
  const { ciphertext } = Object.fromEntries(
    formData
  ) as unknown as DecryptInput;

  if (!ciphertext) {
    $decryptOutputElement.textContent = 'No ciphertext to decrypt.';
    return;
  }

  // check to see if private key input has been changed
  let privateKey$ = of(bobKeyPair.privateKey);

  const privateKeyInput = $privateKeyInputElement.value;
  if (privateKeyInput !== privateKeyReadable) {
    // private key has been changed, use the value from the input
    privateKey$ = RSA2048Service.importPrivateKey(privateKeyInput);
  }

  privateKey$
    .pipe(
      switchMap((privateKey) => RSA2048Service.decrypt(privateKey, ciphertext))
    )
    .subscribe((plaintext) => {
      $decryptOutputElement.textContent = plaintext;
    });
}

// generate key value pair on load
function init() {
  RSA2048Service.generateKeyPair(1024).subscribe((keyPair) => {
    bobKeyPair = keyPair;

    forkJoin({
      publicKey: from(crypto.subtle.exportKey('spki', keyPair.publicKey)),
      privateKey: from(crypto.subtle.exportKey('pkcs8', keyPair.privateKey)),
    }).subscribe(({ publicKey, privateKey }) => {
      publicKeyReadable = btoa(
        String.fromCharCode(...new Uint8Array(publicKey))
      );
      privateKeyReadable = btoa(
        String.fromCharCode(...new Uint8Array(privateKey))
      );

      $publicKeyInputElement.value = publicKeyReadable;
      $privateKeyInputElement.value = privateKeyReadable;
    });
  });
}

init();

window.encrypt = encrypt;
window.decrypt = decrypt;
