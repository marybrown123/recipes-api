/*
  Warnings:

  - You are about to drop the column `image_url` on the `recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "recipe" DROP COLUMN "image_url",
ADD COLUMN     "image_key" TEXT;
