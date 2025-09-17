export interface IterationPerformance {
  encrypt: TimeResult;
  decrypt: TimeResult;
}

export interface TimeResult {
  averageTime: string;
}
