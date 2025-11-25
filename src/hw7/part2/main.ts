import { from, switchMap } from 'rxjs';
import { SHA256SaltService } from '../../modules/hw7/part2/sha256-salt.service';

declare global {
  interface Window {
    launchAttack: (event: SubmitEvent) => void;
  }
}

const basePerformanceText = 'Launch Dictionary Attack';

const $performanceButton = document.getElementById(
  'performance-button'
) as HTMLButtonElement;
const $performanceSpinner = document.getElementById(
  'performance-spinner'
) as unknown as SVGSVGElement;
const $performanceText = document.getElementById(
  'performance-text'
) as HTMLSpanElement;

const $passwordLengthInput = document.getElementById(
  'password-length-input'
) as HTMLInputElement;

const $passwordFileInput = document.getElementById(
  'password-file'
) as HTMLInputElement;

const $timeNeededOutput = document.getElementById(
  'time-needed-output'
) as HTMLSpanElement;

const $recoveredPasswordsOutput = document.getElementById(
  'recovered-passwords-output'
) as HTMLSpanElement;

function launchAttack(event: SubmitEvent) {
  event.preventDefault();

  const passwordLength = $passwordLengthInput.value;
  const passwordFile = $passwordFileInput.files?.[0];

  if (!passwordFile) {
    $timeNeededOutput.textContent = 'No salted password hash file selected.';
    $recoveredPasswordsOutput.textContent =
      'No salted password hash file selected.';
    return;
  }

  if (!passwordLength || Number.isNaN(Number(passwordLength))) {
    $timeNeededOutput.textContent = 'Password length is not a number.';
    $recoveredPasswordsOutput.textContent = 'Password length is not a number.';
    return;
  }

  // show loading spinner on button
  $performanceSpinner.classList.remove('hidden');
  $performanceText.textContent = 'Running...';
  $performanceButton.disabled = true;

  $timeNeededOutput.textContent = 'Running...';
  $recoveredPasswordsOutput.textContent = 'Running...';

  SHA256SaltService.parsePasswordHashFileSalted(passwordFile)
    .pipe(
      switchMap((hashes) =>
        from(
          SHA256SaltService.dictionaryAttackSalted(
            Number(passwordLength),
            hashes
          )
        )
      )
    )
    .subscribe((results) => {
      const recovered = results.crackedHashes;

      // set button back to normal
      $performanceSpinner.classList.add('hidden');
      $performanceText.textContent = basePerformanceText;
      $performanceButton.disabled = false;

      $timeNeededOutput.textContent = `${results.timeElapsed.toFixed(
        4
      )} seconds`;
      $recoveredPasswordsOutput.textContent =
        Object.values(recovered).join(', ');
    });
}

$passwordLengthInput.value = '3';
$performanceText.textContent = basePerformanceText;

window.launchAttack = launchAttack;
