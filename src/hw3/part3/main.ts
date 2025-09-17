import { concatMap, forkJoin, from, last, map, range } from "rxjs";
import { RSA2048Service } from "../../modules/hw3/part2/rsa-2048.service";
import { AESService } from "../../modules/hw3/part1/aes.service";
import type { AESKeySize } from "../../modules/hw3/part1/aes.types";

declare global {
  interface Window {
    startIterations: (event: SubmitEvent) => void;
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

function startIterations(event: SubmitEvent) {
  event.preventDefault();

  console.log("here!");
  const iterations = 100;

  const aesIV = btoa(String.fromCharCode(...AESService.generateRandomIV()));

  const plaintext = "Sample plaintext for AES & RSA encryption performance testing.";

  // run # iterations for each AES key size
  return forkJoin([
    iterateAES(iterations, aesIV, plaintext, 16),
    // iterateAES(iterations, aesIV, plaintext, 24),
    iterateAES(iterations, aesIV, plaintext, 32),
  ]).subscribe((results) => {
    console.log(results, "results");
  });
}

function iterateAES(iterations: number, iv: string, plaintext: string, keySize: AESKeySize) {
  const startTime = performance.now();

  const secretKey = btoa(String.fromCharCode(...AESService.generateRandomKey(keySize)));

  return range(0, iterations).pipe(
    concatMap(() => AESService.encrypt(iv, secretKey, plaintext, keySize)),
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

$aes128EncryptElement.textContent = "N/A";

window.startIterations = startIterations;
