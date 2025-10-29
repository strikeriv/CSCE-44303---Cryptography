import { AESService } from '../../modules/hw3/part1/aes.service';
import { HMACSHAService } from '../../modules/hw5/part1/hmac-sha.service';

declare global {
  interface Window {
    generateHMAC: (event: SubmitEvent) => void;
    verify: (event: SubmitEvent) => void;
  }
}

interface EncryptInput {
  message: string;
}

interface DecryptInput {
  message: string;
  signature: string;
}

const sharedKey = HMACSHAService.generateRandomKey();

const $sharedKeyInputElement = document.getElementById(
  'shared-key-input'
) as HTMLInputElement;

const $signatureMessageInputAlice = document.getElementById(
  'signature-message-input-alice'
) as HTMLInputElement;
const $signatureMessageInputBob = document.getElementById(
  'signature-message-input-bob'
) as HTMLInputElement;
const $signatureInput = document.getElementById(
  'signature-input'
) as HTMLInputElement;

const $signatureOutput = document.getElementById(
  'signature-output'
) as HTMLInputElement;
const $verifyOutput = document.getElementById(
  'verify-output'
) as HTMLInputElement;

function generateHMAC(event: SubmitEvent) {
  event.preventDefault();

  const form = event.target! as HTMLFormElement;
  const formData = new FormData(form);
  const { message } = Object.fromEntries(formData) as unknown as EncryptInput;

  if (!message) {
    $signatureOutput.textContent = 'No message to generate signature from.';
    return;
  }

  let secretKey = sharedKey;

  const sharedKeyInput = $sharedKeyInputElement.value;

  if (sharedKeyInput !== AESService.toHex(sharedKey)) {
    secretKey = Buffer.from(sharedKeyInput, 'hex');
  }

  const hmac = HMACSHAService.generateHMAC(
    18,
    secretKey,
    $signatureMessageInputAlice.value
  );

  // check valid
  if (hmac === 'key-invalid') {
    $signatureOutput.textContent = 'Key is not 16-bit.';
    return;
  }

  if (hmac === 'message-invalid') {
    $signatureOutput.textContent = 'Message is not 18-bit.';
    return;
  }

  $signatureMessageInputBob.textContent = message;

  $signatureOutput.textContent = hmac;
  $signatureInput.textContent = hmac;
}

function verify(event: SubmitEvent) {
  event.preventDefault();

  const form = event.target! as HTMLFormElement;
  const formData = new FormData(form);
  const { message, signature } = Object.fromEntries(
    formData
  ) as unknown as DecryptInput;

  if (!message) {
    $verifyOutput.textContent = 'No message to verify from.';
    return;
  }

  if (!signature) {
    $verifyOutput.textContent = 'No signature to verify from.';
    return;
  }

  let secretKey = sharedKey;

  const sharedKeyInput = $sharedKeyInputElement.value;

  if (sharedKeyInput !== AESService.toHex(sharedKey)) {
    // secret key has been changed, use the value from the input
    secretKey = Buffer.from(sharedKeyInput, 'hex');
  }

  const verify = HMACSHAService.verifySignature(secretKey, message, signature);

  // check valid
  if (verify === 'key-invalid') {
    $verifyOutput.textContent = 'Key is not 16-bit.';
    return;
  }

  if (verify === 'message-invalid') {
    $verifyOutput.textContent = 'Message is not 18-bit.';
    return;
  }

  $verifyOutput.textContent = verify;
}

// generate random key and iv on page load
$sharedKeyInputElement.value = HMACSHAService.toHex(sharedKey);

window.generateHMAC = generateHMAC;
window.verify = verify;
