import { forkJoin } from 'rxjs';
import { AESService } from '../../modules/hw3/part1/aes.service';
import { PerformanceService } from '../../modules/hw3/part3/performance.service';

declare global {
  interface Window {
    startIterations: (event: SubmitEvent) => void;
  }
}

const $plaintextElement = document.getElementById(
  'plaintext-input'
) as HTMLInputElement;

// spans for AES
const $aes128EncryptElement = document.getElementById(
  'aes-128-encrypt-span'
) as HTMLSpanElement;
const $aes128DecryptElement = document.getElementById(
  'aes-128-decrypt-span'
) as HTMLSpanElement;

const $aes192EncryptElement = document.getElementById(
  'aes-192-encrypt-span'
) as HTMLSpanElement;
const $aes192DecryptElement = document.getElementById(
  'aes-192-decrypt-span'
) as HTMLSpanElement;

const $aes256EncryptElement = document.getElementById(
  'aes-256-encrypt-span'
) as HTMLSpanElement;
const $aes256DecryptElement = document.getElementById(
  'aes-256-decrypt-span'
) as HTMLSpanElement;

// spans for RSA
const $rsa1024EncryptElement = document.getElementById(
  'rsa-1024-encrypt-span'
) as HTMLSpanElement;
const $rsa1024DecryptElement = document.getElementById(
  'rsa-1024-decrypt-span'
) as HTMLSpanElement;

const $rsa2048EncryptElement = document.getElementById(
  'rsa-2048-encrypt-span'
) as HTMLSpanElement;
const $rsa2048DecryptElement = document.getElementById(
  'rsa-2048-decrypt-span'
) as HTMLSpanElement;

const $rsa4096EncryptElement = document.getElementById(
  'rsa-4096-encrypt-span'
) as HTMLSpanElement;
const $rsa4096DecryptElement = document.getElementById(
  'rsa-4096-decrypt-span'
) as HTMLSpanElement;

function startIterations(event: SubmitEvent) {
  event.preventDefault();

  const iterations = 100;
  const aesIV = AESService.generateRandomIV();
  const plaintext = $plaintextElement.value;

  return forkJoin([
    ...PerformanceService.iterateAES(iterations, aesIV, plaintext),
    ...PerformanceService.iterateRSA(iterations, plaintext),
  ]).subscribe((results) => {
    const [aes128, aes192, aes256, rsa1024, rsa2048, rsa4096] = results;

    $aes128EncryptElement.textContent = `${aes128.encrypt.averageTime}ms`;
    $aes128DecryptElement.textContent = `${aes128.decrypt.averageTime}ms`;

    $aes192EncryptElement.textContent = `${aes192.encrypt.averageTime}ms`;
    $aes192DecryptElement.textContent = `${aes192.decrypt.averageTime}ms`;

    $aes256EncryptElement.textContent = `${aes256.encrypt.averageTime}ms`;
    $aes256DecryptElement.textContent = `${aes256.decrypt.averageTime}ms`;

    $rsa1024EncryptElement.textContent = `${rsa1024.encrypt.averageTime}ms`;
    $rsa1024DecryptElement.textContent = `${rsa1024.decrypt.averageTime}ms`;

    $rsa2048EncryptElement.textContent = `${rsa2048.encrypt.averageTime}ms`;
    $rsa2048DecryptElement.textContent = `${rsa2048.decrypt.averageTime}ms`;

    $rsa4096EncryptElement.textContent = `${rsa4096.encrypt.averageTime}ms`;
    $rsa4096DecryptElement.textContent = `${rsa4096.decrypt.averageTime}ms`;
  });
}

window.startIterations = startIterations;
