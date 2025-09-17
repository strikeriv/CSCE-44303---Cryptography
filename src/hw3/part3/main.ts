import { concatMap, forkJoin, last, map, range } from 'rxjs';
import { AESService } from '../../modules/hw3/part1/aes.service';
import type {
  AESAlgorithm,
  AESKeySize,
} from '../../modules/hw3/part1/aes.types';
import type { BinaryLike } from 'crypto';

declare global {
  interface Window {
    startIterations: (event: SubmitEvent) => void;
  }
}

interface EncryptInput {
  plaintext: string;
}

// spans for RSA
const $aes128EncryptElement = document.getElementById(
  'aes-128-encrypt-span'
) as HTMLInputElement;
const $aes128DecryptElement = document.getElementById(
  'aes-128-decrypt-span'
) as HTMLInputElement;

const $aes192EncryptElement = document.getElementById(
  'aes-192-encrypt-span'
) as HTMLInputElement;
const $aes192DecryptElement = document.getElementById(
  'aes-192-decrypt-span'
) as HTMLInputElement;

const $aes256EncryptElement = document.getElementById(
  'aes-256-encrypt-span'
) as HTMLInputElement;
const $aes256DecryptElement = document.getElementById(
  'aes-256-decrypt-span'
) as HTMLInputElement;

function startIterations(event: SubmitEvent) {
  event.preventDefault();

  console.log('here!');
  const iterations = 100;

  const aesIV = AESService.generateRandomIV();

  const plaintext =
    'Sample plaintext for AES & RSA encryption performance testing.';

  // run # iterations for each AES key size
  return forkJoin([
    iterateAES('aes-128-cbc', iterations, aesIV, plaintext, 16),
    iterateAES('aes-192-cbc', iterations, aesIV, plaintext, 24),
    iterateAES('aes-256-cbc', iterations, aesIV, plaintext, 32),
  ]).subscribe((results) => {
    console.log(results, 'results');
  });
}

function iterateAES(
  algorithm: AESAlgorithm,
  iterations: number,
  iv: BinaryLike,
  plaintext: string,
  keySize: AESKeySize
) {
  const startTime = performance.now();

  const secretKey = AESService.generateRandomKey(keySize);

  return range(0, iterations).pipe(
    concatMap(() => AESService.encrypt(algorithm, secretKey, iv, plaintext)),
    last(), // wait until all iterations are done
    map(() => {
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTime = totalTime / iterations;
      return { totalTime, avgTime };
    })
  );
}

// const $privateKeyInputElement = document.getElementById("private-key-input") as HTMLInputElement;

// const $encryptOutputElement = document.getElementById("encrypt-output") as HTMLTextAreaElement;
// const $decryptOutputElement = document.getElementById("decrypt-output") as HTMLTextAreaElement;

$aes128EncryptElement.textContent = 'N/A';

window.startIterations = startIterations;
