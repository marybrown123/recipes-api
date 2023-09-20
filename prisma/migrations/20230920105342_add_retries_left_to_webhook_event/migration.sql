/*
  Warnings:

  - Added the required column `retries_left` to the `webhook_event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "webhook_event" ADD COLUMN     "retries_left" INTEGER NOT NULL;
