-- AlterTable: add Flexibility Assessment storage (4 standardized tests, each
-- with a LOW/MEDIUM/HIGH rating and an optional evidence photo URL).
-- Nullable JSONB column, so existing analyses (created before this feature)
-- remain valid with no data migration needed.
ALTER TABLE "analyses" ADD COLUMN "flexibilityAssessment" JSONB;
