import type { BinaryLike } from 'crypto';
import {
  Observable,
  range,
  concatMap,
  of,
  last,
  map,
  forkJoin,
  switchMap,
} from 'rxjs';
import { AESService } from '../part1/aes.service';
import type { AESAlgorithm, AESKeySize } from '../part1/aes.types';
import type { IterationPerformance } from './performance.types';
import { RSAService } from '../part2/rsa.service';
import type { RSAModulusLength } from '../part2/rsa.types';

export const PerformanceService = {
  iterateAES,
  iterateRSA,
};

function iterateAES(iterations: number, aesIV: BinaryLike, plaintext: string) {
  return [
    iterateAESAlgorithm('aes-128-cbc', iterations, aesIV, plaintext, 16),
    iterateAESAlgorithm('aes-192-cbc', iterations, aesIV, plaintext, 24),
    iterateAESAlgorithm('aes-256-cbc', iterations, aesIV, plaintext, 32),
  ];
}

function iterateRSA(iterations: number, plaintext: string) {
  return [
    iterateRSAAlgorithm(1024, iterations, plaintext),
    iterateRSAAlgorithm(2048, iterations, plaintext),
    iterateRSAAlgorithm(4096, iterations, plaintext),
  ];
}

function iterateAESAlgorithm(
  algorithm: AESAlgorithm,
  iterations: number,
  iv: BinaryLike,
  plaintext: string,
  keySize: AESKeySize
): Observable<IterationPerformance> {
  const startTime = performance.now();

  const secretKey = AESService.generateRandomKey(keySize);

  const $encrypt = range(0, iterations).pipe(
    concatMap(() =>
      of(AESService.encrypt(algorithm, secretKey, iv, plaintext))
    ),
    last(),
    map((ciphertext) => {
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTime = totalTime / iterations;

      return {
        averageTime: avgTime.toFixed(2),
        lastCiphertext: ciphertext,
      }; // need the ciphertext cause the decrypt fails without it ;/
    })
  );

  const $decrypt = $encrypt.pipe(
    concatMap(({ lastCiphertext }) =>
      range(0, iterations).pipe(
        concatMap(() =>
          of(AESService.decrypt(algorithm, secretKey, iv, lastCiphertext))
        ),
        last(),
        map(() => {
          const endTime = performance.now();
          const totalTime = endTime - startTime;
          const avgTime = totalTime / iterations;

          return {
            averageTime: avgTime.toFixed(2),
          };
        })
      )
    )
  );

  return forkJoin({
    encrypt: $encrypt,
    decrypt: $decrypt,
  });
}

function iterateRSAAlgorithm(
  modulusLength: RSAModulusLength,
  iterations: number,
  plaintext: string
): Observable<IterationPerformance> {
  const startTime = performance.now();

  return RSAService.generateKeyPair(modulusLength).pipe(
    switchMap(({ publicKey, privateKey }) => {
      const $encrypt = range(0, iterations).pipe(
        concatMap(() => RSAService.encrypt(publicKey, plaintext)),
        last(),
        map((ciphertext) => {
          const endTime = performance.now();
          const totalTime = endTime - startTime;
          const avgTime = totalTime / iterations;

          return {
            averageTime: avgTime.toFixed(2),
            lastCiphertext: ciphertext,
          };
        })
      );

      const $decrypt = $encrypt.pipe(
        concatMap(({ lastCiphertext }) =>
          range(0, iterations).pipe(
            concatMap(() => RSAService.decrypt(privateKey, lastCiphertext)),
            last(),
            map(() => {
              const endTime = performance.now();
              const totalTime = endTime - startTime;
              const avgTime = totalTime / iterations;

              return {
                averageTime: avgTime.toFixed(2),
              };
            })
          )
        )
      );

      return forkJoin({
        encrypt: $encrypt,
        decrypt: $decrypt,
      });
    })
  );
}
