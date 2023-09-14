-- CreateTable
CREATE TABLE "webhook" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL,
    "retries_amount" INTEGER NOT NULL,

    CONSTRAINT "webhook_pkey" PRIMARY KEY ("id")
);
