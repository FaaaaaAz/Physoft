-- CreateTable
CREATE TABLE "athletes" (
    "id" TEXT NOT NULL,
    "accessCode" TEXT NOT NULL,
    "photo" TEXT,
    "cloudinaryPublicId" TEXT,
    "name" TEXT NOT NULL,
    "patientType" TEXT NOT NULL DEFAULT 'Athlete',
    "gender" TEXT NOT NULL,
    "birthDate" TEXT,
    "nationality" TEXT,
    "sport" TEXT NOT NULL,
    "club" TEXT,
    "position" TEXT,
    "bodyType" TEXT NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deviceId" TEXT,

    CONSTRAINT "athletes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analyses" (
    "id" SERIAL NOT NULL,
    "athleteId" TEXT NOT NULL,
    "evaluationDate" TIMESTAMP(3) NOT NULL,
    "graphImages" TEXT,
    "flexibilityAnalysis" TEXT,
    "biobitAnalysis" TEXT,
    "muscularAsymmetry" TEXT,
    "activeMotorControl" TEXT,
    "functionalMuscleFatigue" TEXT,
    "inertiaForceControl" TEXT,
    "weakPoints" TEXT,
    "bodyMarks" TEXT,
    "power" INTEGER,
    "endurance" INTEGER,
    "strength" INTEGER,
    "flexibility" INTEGER,
    "speed" INTEGER,
    "globalClassification" TEXT,
    "cohortClassification" TEXT,
    "coachRecommendations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "athletes_accessCode_key" ON "athletes"("accessCode");

-- CreateIndex
CREATE INDEX "athletes_gender_sport_bodyType_idx" ON "athletes"("gender", "sport", "bodyType");

-- CreateIndex
CREATE INDEX "athletes_height_weight_idx" ON "athletes"("height", "weight");

-- CreateIndex
CREATE INDEX "analyses_athleteId_evaluationDate_idx" ON "analyses"("athleteId", "evaluationDate");

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
