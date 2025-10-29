import { CollisionService } from '../../modules/hw5/part4/collision.service';

declare global {
  interface Window {
    startHashCollisions: (event: SubmitEvent) => void;
    startHashCollisionIterations: (event: SubmitEvent) => void;
  }
}

const $collisionsOutput = document.getElementById(
  'collisions-iterations-output'
) as HTMLSpanElement;

const $firstMessageOutput = document.getElementById(
  'first-message-output'
) as HTMLSpanElement;
const $firstHashOutput = document.getElementById(
  'first-hash-output'
) as HTMLSpanElement;

const $secondMessageOutput = document.getElementById(
  'second-message-output'
) as HTMLSpanElement;
const $secondHashOutput = document.getElementById(
  'second-hash-output'
) as HTMLSpanElement;

const $bparadoxOutput = document.getElementById(
  'bparadox-iterations-output'
) as HTMLSpanElement;

function startHashCollisions(event: SubmitEvent) {
  event.preventDefault();

  const collision = CollisionService.findCollisions();

  $collisionsOutput.textContent = String(collision.trials);

  $firstMessageOutput.textContent = collision.result1.message;
  $firstHashOutput.textContent = collision.result1.hash;

  $secondMessageOutput.textContent = collision.result2.message;
  $secondHashOutput.textContent = collision.result2.hash;
}

function startHashCollisionIterations(event: SubmitEvent) {
  event.preventDefault();

  const iterations = 20;

  CollisionService.findCollisionsWithIterations(iterations).subscribe(
    (result) => {
      $bparadoxOutput.textContent = `${result.averageTrials} trials`;
    }
  );
}

window.startHashCollisions = startHashCollisions;
window.startHashCollisionIterations = startHashCollisionIterations;
