export interface RSAIterationPerformance {
  signatures: TimeResult;
  verifications: TimeResult;
}

export interface TimeResult {
  averageTime: string;
}

export type RSASignatureResult = TimeResult & {
  lastSignature: string;
};
