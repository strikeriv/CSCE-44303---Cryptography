import { map, Observable, range, reduce } from 'rxjs';
import type {
  CollisionIterationResult,
  CollisionResult,
} from './collision.types';
import { HashService } from './hash.service';

export const CollisionService = {
  findCollisions,
  findCollisionsWithIterations,
};

function findCollisions(): CollisionResult {
  const triedHashes = new Map();

  let trials = 0;
  let matchedHash;
  let matchedMessage;

  while (true) {
    trials++;

    const messageBuffer = HashService.randomMessage();
    const messageString = messageBuffer.toString('hex');

    const hashValue = HashService.H(messageBuffer);

    if (triedHashes.has(hashValue)) {
      // Collision found!
      const foundMessage = triedHashes.get(hashValue);
      if (foundMessage !== messageString) {
        matchedHash = hashValue;
        matchedMessage = messageString;

        break;
      }
    }

    triedHashes.set(hashValue, messageString);
  }

  // return after we break loop!
  const initial = triedHashes.get(matchedHash);

  return {
    trials,
    result1: {
      message: initial,
      hash: matchedHash,
    },
    result2: {
      message: matchedMessage,
      hash: matchedHash,
    },
  };
}

function findCollisionsWithIterations(
  iterations: number
): Observable<CollisionIterationResult> {
  return range(0, iterations).pipe(
    map(() => findCollisions().trials),
    reduce((sum, currentTrials) => sum + currentTrials, 0),
    map((totalTrials) => {
      const averageTrials = totalTrials / iterations;

      return {
        averageTrials: averageTrials.toFixed(2),
      };
    })
  );
}
