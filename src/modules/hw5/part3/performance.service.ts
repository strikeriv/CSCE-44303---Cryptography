import { concatMap, forkJoin, from, last, map, Observable, range } from 'rxjs';
import { HMACSHAService } from '../part1/hmac-sha.service';
import { DSRSA2048Service } from '../part2/ds-rsa.service';
import type {
  RSAIterationPerformance,
  RSASignatureResult,
  TimeResult,
} from './performance.types';

export const PerformanceService = {
  iterateHMAC,
  iterateRSA,
};

function iterateHMAC(
  iterations: number,
  key: Buffer<ArrayBufferLike>,
  message: string
): Observable<TimeResult> {
  const startTime = performance.now();

  return range(0, iterations).pipe(
    concatMap(() => from(HMACSHAService.generateHMAC(7, key, message))),
    last(),
    map(() => {
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTime = totalTime / iterations;

      return {
        averageTime: avgTime.toFixed(5),
      };
    })
  );
}

function iterateRSA(
  iterations: number,
  privateKey: string,
  publicKey: string,
  message: string
): Observable<RSAIterationPerformance> {
  const $sign = iterateRSASignatures(iterations, privateKey, message);

  const $verify = $sign.pipe(
    concatMap(({ lastSignature }) =>
      iterateRSAVerifications(iterations, publicKey, message, lastSignature)
    )
  );

  return forkJoin({
    signatures: $sign,
    verifications: $verify,
  });
}

function iterateRSASignatures(
  iterations: number,
  privateKey: string,
  message: string
): Observable<RSASignatureResult> {
  const startTime = performance.now();

  let lastSignatureValue: string = '';

  return range(0, iterations).pipe(
    concatMap(() => from(DSRSA2048Service.signMessage(7, privateKey, message))),
    map((signature: string) => {
      lastSignatureValue = signature;
      return signature;
    }),
    last(),
    map(() => {
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTime = totalTime / iterations;

      return {
        averageTime: avgTime.toFixed(5),
        lastSignature: lastSignatureValue,
      };
    })
  );
}

function iterateRSAVerifications(
  iterations: number,
  publicKey: string,
  message: string,
  signature: string
): Observable<TimeResult> {
  const startTime = performance.now();

  return range(0, iterations).pipe(
    concatMap(() =>
      from(DSRSA2048Service.verifySignature(publicKey, message, signature))
    ),
    last(),
    map(() => {
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTime = totalTime / iterations;

      return {
        averageTime: avgTime.toFixed(5),
      };
    })
  );
}
