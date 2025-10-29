import { DSRSA2048Service } from '../../modules/hw5/part2/ds-rsa.service';

declare global {
  interface Window {
    signMessage: (event: SubmitEvent) => void;
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

let aliceKeys: {
  publicKey: string;
  privateKey: string;
};

const $publicKeyInput = document.getElementById(
  'public-key-input'
) as HTMLInputElement;
const $privateKeyInput = document.getElementById(
  'private-key-input'
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

async function signMessage(event: SubmitEvent) {
  event.preventDefault();

  const form = event.target! as HTMLFormElement;
  const formData = new FormData(form);
  const { message } = Object.fromEntries(formData) as unknown as EncryptInput;

  if (!message) {
    $signatureOutput.textContent = 'No message to generate signature from.';
    return;
  }

  let privateKey = aliceKeys.privateKey;

  const privateKeyInput = $privateKeyInput.value;

  // check key
  if (privateKeyInput !== privateKey) {
    privateKey = privateKeyInput;
  }

  const signature = await DSRSA2048Service.signMessage(privateKey, message);

  // check valid
  if (signature === 'message-invalid') {
    $signatureOutput.textContent = 'Message is not 18-bit.';
    return;
  }

  $signatureMessageInputBob.textContent = message;

  $signatureOutput.textContent = signature;
  $signatureInput.textContent = signature;
}

async function verify(event: SubmitEvent) {
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

  let publicKey = aliceKeys.publicKey;

  const publicKeyInput = $publicKeyInput.value;

  // check key
  if (publicKeyInput !== publicKey) {
    publicKey = publicKeyInput;
  }

  $verifyOutput.textContent = await DSRSA2048Service.verifySignature(
    publicKey,
    message,
    signature
  );
}

// generate random key and iv on page load
async function init() {
  aliceKeys = await DSRSA2048Service.generateKeys();

  $publicKeyInput.value = aliceKeys.publicKey;
  $privateKeyInput.value = aliceKeys.privateKey;
}

init();

window.signMessage = signMessage;
window.verify = verify;
