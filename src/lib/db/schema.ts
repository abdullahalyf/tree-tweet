/**
 * LandTech Innovation Hackathon 2026
 * Database Schema Types
 *
 * Direct TypeScript representation of Supabase PostgreSQL tables:
 * - khatian (রেকর্ডীয় খতিয়ান)
 * - plot_status (দাগের অবস্থা - বন্ধক ও মামলা)
 * - deed (রেজিস্ট্রিকৃত দলিল)
 */

export type LandType = 'normal' | 'khas';
export type MutationStatus = 'none' | 'pending' | 'done';
export type DeedStatus = 'active' | 'cancelled';

/**
 * 1. Khatian (খতিয়ান রেকর্ড)
 * Represents the official recorded ownership for a plot (dag).
 * dag_no is stored as a string to preserve leading zeros (e.g., '0101').
 */
export interface KhatianRecord {
  id: string;
  mouza: string;
  dag_no: string;
  owner_name: string;
  total_area: number;
  remaining_area: number;
  land_type: LandType;
  mutation_status: MutationStatus;
  created_at?: string;
  updated_at?: string;
}

/**
 * 2. Plot Status (দাগের আইনি ও বন্ধকী স্থিতি)
 * Encumbrance information associated with a plot.
 */
export interface PlotStatusRecord {
  dag_no: string;
  mortgaged: boolean;
  court_case: boolean;
  updated_at?: string;
}

/**
 * 3. Deed (দলিল রেকর্ড)
 * Represents a registered sale transaction with tamper-evident cryptographic hash.
 */
export interface DeedRecord {
  id: string;
  deed_no: string;
  dag_no: string;
  seller: string;
  buyer: string;
  area: number;
  date: string;
  hash: string;
  prev_hash: string | null;
  status: DeedStatus;
  created_at?: string;
}

/**
 * Combined Plot Record for Verification lookup
 */
export interface CompletePlotData {
  dagNo: string;
  khatian: KhatianRecord | null;
  plotStatus: PlotStatusRecord | null;
  deeds: DeedRecord[];
}
