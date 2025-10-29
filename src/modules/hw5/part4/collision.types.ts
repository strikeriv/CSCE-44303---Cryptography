export interface CollisionResult {
  trials: number;
  result1: CollisionData;
  result2: CollisionData;
}

export interface CollisionIterationResult {
  averageTrials: string;
}

export interface CollisionData {
  message: string;
  hash: string;
}
