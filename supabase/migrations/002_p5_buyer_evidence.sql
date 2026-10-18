-- P5 evidence fields. Existing rows remain unknown until evidence is supplied.
-- This migration does not assert that old records are clear or complete.
ALTER TABLE public.khatian
  ADD COLUMN IF NOT EXISTS mutation_history JSONB NOT NULL DEFAULT '[]'::jsonb
  CHECK (jsonb_typeof(mutation_history) = 'array');

ALTER TABLE public.plot_status
  ADD COLUMN IF NOT EXISTS acquisition_status VARCHAR(20) NOT NULL DEFAULT 'unknown'
  CHECK (acquisition_status IN ('not_reported', 'notice', 'acquired', 'unknown'));

COMMENT ON COLUMN public.khatian.mutation_history IS
  'Dated mutation evidence entries: date, status, reference. Empty means unavailable.';
COMMENT ON COLUMN public.plot_status.acquisition_status IS
  'Explicit acquisition evidence; unknown must never be interpreted as clear.';
