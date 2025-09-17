import { AESService } from '../../modules/hw3/part1/aes.service';

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

const randomKey = AESService.generateRandomKey(16);
const randomIV = AESService.generateRandomIV();

const $secretKeyInputElement = document.getElementById(
  'secret-key-input'
) as HTMLInputElement;
const $ivInputElement = document.getElementById('iv-input') as HTMLInputElement;

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

  let secretKey = randomKey;
  let iv = randomIV;

  const secretKeyInput = $secretKeyInputElement.value;
  const ivInput = $ivInputElement.value;

  if (secretKeyInput !== AESService.toHex(randomKey)) {
    // secret key has been changed, use the value from the input
    secretKey = Buffer.from(secretKeyInput, 'hex');
  }

  if (ivInput !== AESService.toHex(randomIV)) {
    // iv has been changed, use the value from the input
    iv = Buffer.from(ivInput, 'hex');
  }

  // we can do this because the key and iv are pre-filled on page load
  $encryptOutputElement.textContent = AESService.encrypt(
    'aes-128-cbc',
    secretKey,
    iv,
    plaintext
  );
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

  let secretKey = randomKey;
  let iv = randomIV;

  const secretKeyInput = $secretKeyInputElement.value;
  const ivInput = $ivInputElement.value;

  if (secretKeyInput !== AESService.toHex(randomKey)) {
    // secret key has been changed, use the value from the input
    secretKey = Buffer.from(secretKeyInput, 'hex');
  }

  if (ivInput !== AESService.toHex(randomIV)) {
    // iv has been changed, use the value from the input
    iv = Buffer.from(ivInput, 'hex');
  }

  // we can do this because the key and iv are pre-filled on page load
  $decryptOutputElement.textContent = AESService.decrypt(
    'aes-128-cbc',
    secretKey,
    iv,
    ciphertext
  );
}

// generate random key and iv on page load
$secretKeyInputElement.value = AESService.toHex(randomKey);
$ivInputElement.value = AESService.toHex(randomIV);

window.encrypt = encrypt;
window.decrypt = decrypt;
