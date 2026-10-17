-- =====================================================================
-- LandTech Innovation Hackathon 2026
-- Product: AI-Assisted Pre-Purchase Land Verification System
-- Problem P5: "Check Before You Buy" (জমি কেনার আগে যাচাই)
-- Migration 001: Initial Schema (Khatian, Deed, Plot Status)
-- =====================================================================

-- Enable pgcrypto for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. Table: KHATIAN (রেকর্ডীয় খতিয়ান তথ্য)
-- Stores official land registry/record details for a specific plot.
-- dag_no is stored as VARCHAR to preserve leading zeros (e.g. '0101', '0042').
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS khatian (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mouza VARCHAR(100) NOT NULL,
    dag_no VARCHAR(50) NOT NULL UNIQUE,
    owner_name TEXT NOT NULL,
    total_area NUMERIC(10, 4) NOT NULL CHECK (total_area > 0),
    remaining_area NUMERIC(10, 4) NOT NULL CHECK (remaining_area >= 0 AND remaining_area <= total_area),
    land_type VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (land_type IN ('normal', 'khas')),
    mutation_status VARCHAR(20) NOT NULL DEFAULT 'done' CHECK (mutation_status IN ('none', 'pending', 'done')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments for documentation & judges
COMMENT ON TABLE khatian IS 'Official fictional land record (খতিয়ান) representing land ownership per plot';
COMMENT ON COLUMN khatian.dag_no IS 'Dag / Plot identifier as string to preserve leading zeros';
COMMENT ON COLUMN khatian.total_area IS 'Total recorded area of the plot in decimals (শতাংশ)';
COMMENT ON COLUMN khatian.remaining_area IS 'Current unsold/available area in decimals (শতাংশ)';
COMMENT ON COLUMN khatian.land_type IS 'Land classification: normal (সাধারণ) or khas (সরকারি খাস জমি)';
COMMENT ON COLUMN khatian.mutation_status IS 'Mutation (নামজারি) state: none, pending, or done';

-- ---------------------------------------------------------------------
-- 2. Table: PLOT_STATUS (দাগের তাৎক্ষণিক আইনি ও আর্থিক স্থিতি)
-- Tracks active legal encumbrances (mortgage, ongoing court disputes).
-- Uses dag_no as primary key with foreign key referencing khatian(dag_no).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS plot_status (
    dag_no VARCHAR(50) PRIMARY KEY REFERENCES khatian(dag_no) ON DELETE CASCADE,
    mortgaged BOOLEAN NOT NULL DEFAULT FALSE,
    court_case BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE plot_status IS 'Encumbrance status of plot: active mortgage or court injunction';
COMMENT ON COLUMN plot_status.mortgaged IS 'True if plot is mortgaged to a bank or financial institution';
COMMENT ON COLUMN plot_status.court_case IS 'True if plot is subject to an active court case (মামলা)';

-- ---------------------------------------------------------------------
-- 3. Table: DEED (রেজিস্ট্রিকৃত দলিল তথ্য)
-- Stores sale deed transaction history and cryptographic tamper-proof hashes.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS deed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deed_no VARCHAR(50) NOT NULL UNIQUE,
    dag_no VARCHAR(50) NOT NULL REFERENCES khatian(dag_no) ON DELETE RESTRICT,
    seller TEXT NOT NULL,
    buyer TEXT NOT NULL,
    area NUMERIC(10, 4) NOT NULL CHECK (area > 0),
    date DATE NOT NULL,
    hash VARCHAR(64) NOT NULL,
    prev_hash VARCHAR(64),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE deed IS 'Registered land transfer deed (দলিল) with cryptographic hash integrity';
COMMENT ON COLUMN deed.deed_no IS 'Unique deed registration number';
COMMENT ON COLUMN deed.hash IS 'SHA-256 hash representing deed content integrity';
COMMENT ON COLUMN deed.prev_hash IS 'Hash of previous deed in sequence or genesis reference';
COMMENT ON COLUMN deed.status IS 'Deed status: active (বৈধ) or cancelled (বাতিল)';

-- ---------------------------------------------------------------------
-- Performance Indexes for search queries
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_khatian_dag_no ON khatian(dag_no);
CREATE INDEX IF NOT EXISTS idx_khatian_mouza ON khatian(mouza);
CREATE INDEX IF NOT EXISTS idx_deed_dag_no ON deed(dag_no);
CREATE INDEX IF NOT EXISTS idx_deed_deed_no ON deed(deed_no);
CREATE INDEX IF NOT EXISTS idx_plot_status_dag_no ON plot_status(dag_no);

-- ---------------------------------------------------------------------
-- Row Level Security (RLS) Configuration
-- For this MVP verification system, public read access is enabled.
-- Modifications (INSERT/UPDATE/DELETE) are restricted to backend / service role.
-- ---------------------------------------------------------------------
ALTER TABLE khatian ENABLE ROW LEVEL SECURITY;
ALTER TABLE plot_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE deed ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read-only access for verification lookups
DROP POLICY IF EXISTS "Allow public read khatian" ON khatian;
CREATE POLICY "Allow public read khatian" ON khatian FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read plot_status" ON plot_status;
CREATE POLICY "Allow public read plot_status" ON plot_status FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read deed" ON deed;
CREATE POLICY "Allow public read deed" ON deed FOR SELECT USING (true);
