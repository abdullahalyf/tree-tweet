/** Presentation only: unknown database values must never be treated as negative evidence. */
export function getFlagState(value: unknown): 'reported' | 'not-reported' | 'unknown' {
  return value === true ? 'reported' : value === false ? 'not-reported' : 'unknown';
}
export function hasCompletePlotStatus(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const status = value as Record<string, unknown>;
  return typeof status.mortgaged === 'boolean' && typeof status.court_case === 'boolean';
}
export function getCheckState(available: boolean, hasIssue: boolean): 'clear' | 'review' | 'incomplete' | 'review-incomplete' {
  if (hasIssue) return available ? 'review' : 'review-incomplete';
  return available ? 'clear' : 'incomplete';
}
