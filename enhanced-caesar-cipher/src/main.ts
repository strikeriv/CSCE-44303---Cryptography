import { decryptService } from "./modules/decrypt/decrypt.service";
import { encryptService } from "./modules/encrypt/encrypt.service";
import type { EncryptMode } from "./modules/encrypt/encrypt.types";
import "./style.css";

// encrypt elements
const $encryptTextElement = document.getElementById("encrypt-text-input") as HTMLTextAreaElement;
const $encryptKeyElement = document.getElementById("encrypt-key-input") as HTMLInputElement;
const $encryptModeElement = document.getElementById("encrypt-mode-select") as HTMLSelectElement;
const $encryptOutputElement = document.getElementById("encrypt-output") as HTMLTextAreaElement;

const $encryptButton = document.getElementById("encrypt-submit") as HTMLButtonElement;

// decrypt elements
const $decryptTextElement = document.getElementById("decrypt-text-input") as HTMLTextAreaElement;
const $decryptKeyElement = document.getElementById("decrypt-key-input") as HTMLInputElement;
const $decryptModeElement = document.getElementById("decrypt-mode-select") as HTMLSelectElement;
const $decryptBruteForceElement = document.getElementById("brute-force-checkbox") as HTMLInputElement;
const $decryptOutputElement = document.getElementById("decrypt-output") as HTMLTextAreaElement;

const $decryptButton = document.getElementById("decrypt-submit") as HTMLButtonElement;

// set up events
$encryptButton.addEventListener("click", () => encrypt());

$decryptBruteForceElement.addEventListener("change", () => adjustDecryptOnCheckboxClick());
$decryptButton.addEventListener("click", () => decrypt());

function encrypt() {
  const textInput = $encryptTextElement.value;
  const keyInput = parseInt($encryptKeyElement.value);
  const modeInput = $encryptModeElement.value as EncryptMode;

  $encryptOutputElement.textContent = encryptService.encrypt(textInput, keyInput, modeInput);
}

function adjustDecryptOnCheckboxClick() {
  const doBruteForce = $decryptBruteForceElement.checked;

  if (doBruteForce) {
    $decryptKeyElement.disabled = true;
  } else {
    $decryptKeyElement.disabled = false;
  }
}

async function decrypt() {
  const textInput = $decryptTextElement.value;
  const keyInput = parseInt($decryptKeyElement.value);
  const modeInput = $decryptModeElement.value as EncryptMode;

  const doBruteForce = $decryptBruteForceElement.checked;

  if (!doBruteForce) {
    $decryptOutputElement.textContent = decryptService.decrypt(textInput, keyInput, modeInput);
  } else {
    decryptService.bruteForceDecrypt(textInput, modeInput).subscribe((result) => {
      const { decrypted, key, plaintext } = result;

      if (decrypted) {
        $decryptKeyElement.value = key!.toString();
        $decryptOutputElement.textContent = plaintext!;
      } else {
        $decryptOutputElement.textContent = "No valid decryption found.";
      }
    });
  }
}
