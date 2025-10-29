import { forkJoin } from 'rxjs';
import { HMACSHAService } from '../../modules/hw5/part1/hmac-sha.service';
import { DSRSA2048Service } from '../../modules/hw5/part2/ds-rsa.service';
import { PerformanceService } from '../../modules/hw5/part3/performance.service';

declare global {
  interface Window {
    startIterations: (event: SubmitEvent) => void;
  }
}

const $messageInput = document.getElementById(
  'message-input'
) as HTMLInputElement;

const $hmacOutput = document.getElementById(
  'hmac-gen-time-input'
) as HTMLInputElement;
const $rsaSignatureOutput = document.getElementById(
  'rsa-signature-gen-time-input'
) as HTMLInputElement;
const $rsaVerifyOutput = document.getElementById(
  'rsa-verification-time-input'
) as HTMLInputElement;

async function startIterations(event: SubmitEvent) {
  event.preventDefault();

  const message = $messageInput.value;

  if (!message) {
    $hmacOutput.textContent = 'No message to iterate from.';
    $rsaSignatureOutput.textContent = 'No message to iterate from.';
    $rsaVerifyOutput.textContent = 'No message to iterate from.';

    return;
  }

  // must check message buffer here for message limitation
  const buffer = Buffer.from(message, 'utf-8');
  if (buffer.length !== 7) {
    $hmacOutput.textContent = 'Message is not 7-bit.';
    $rsaSignatureOutput.textContent = 'Message is not 7-bit.';
    $rsaVerifyOutput.textContent = 'Message is not 7-bit.';
  }

  const iterations = 100;

  const hmacKey = HMACSHAService.generateRandomKey();
  const rsaKeys = await DSRSA2048Service.generateKeys();

  return forkJoin([
    PerformanceService.iterateHMAC(iterations, hmacKey, message),
    PerformanceService.iterateRSA(
      iterations,
      rsaKeys.privateKey,
      rsaKeys.publicKey,
      message
    ),
  ]).subscribe((results) => {
    const [hmac, rsa] = results;
    const { signatures, verifications } = rsa;

    $hmacOutput.textContent = `${hmac.averageTime}ms`;
    $rsaSignatureOutput.textContent = `${signatures.averageTime}ms`;
    $rsaVerifyOutput.textContent = `${verifications.averageTime}ms`;
  });
}

window.startIterations = startIterations;
