-- CreateTable
CREATE TABLE "PredictionHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "bhk" DOUBLE PRECISION NOT NULL,
    "bath" DOUBLE PRECISION NOT NULL,
    "total_sqft" DOUBLE PRECISION NOT NULL,
    "predictedPrice" DOUBLE PRECISION NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PredictionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PredictionHistory_userId_createdAt_idx" ON "PredictionHistory"("userId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "PredictionHistory" ADD CONSTRAINT "PredictionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
