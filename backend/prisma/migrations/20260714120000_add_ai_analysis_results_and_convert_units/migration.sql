-- AlterTable: add AI-assisted Textual Analysis results storage
ALTER TABLE "analyses" ADD COLUMN "aiAnalysisResults" JSONB;

-- One-time conversion of existing athlete height/weight from metric to imperial
-- (height: cm -> feet, weight: kg -> pounds), to match the new "Height (feet)" /
-- "Weight (pounds)" form labels and validation ranges.
--
-- Guard (height > 10): converted feet values for humans are always < 10, while
-- legacy centimeter values are always > 10 -- so this UPDATE is naturally a
-- no-op if this migration is ever re-applied to a database that was already
-- converted, and only touches rows still holding pre-conversion cm/kg values.
UPDATE "athletes"
SET "height" = ROUND((("height" / 30.48))::numeric, 2),
    "weight" = ROUND((("weight" * 2.20462))::numeric, 1)
WHERE "height" > 10;
