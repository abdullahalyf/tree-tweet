import { KhatianRecord, PlotStatusRecord, DeedRecord } from '../db/schema';

/**
 * Three-tier Traffic Light Verification Status
 * - GREEN: All checks passed cleanly. Low pre-purchase risk.
 * - YELLOW: Caution required (e.g. minor name spelling variation, active bank mortgage).
 * - RED: Critical risk detected (e.g. double-sale, unauthorized seller, excessive area, tampered hash).
 */
export type VerificationStatus = 'GREEN' | 'YELLOW' | 'RED';

export type IssueSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface VerificationIssue {
  code: string;
  severity: IssueSeverity;
  titleBn: string;
  descriptionBn: string;
  field?: string;
}

export interface VerificationResult {
  dagNo: string;
  overallStatus: VerificationStatus;
  summaryBn: string;
  issues: VerificationIssue[];
  khatian: KhatianRecord | null;
  plotStatus: PlotStatusRecord | null;
  deeds: DeedRecord[];
  selectedDeed: DeedRecord | null;
  timestamp: string;
  disclaimerBn: string;
}
