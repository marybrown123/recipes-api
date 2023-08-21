/*
  Warnings:

  - You are about to drop the column `image_key` on the `recipe` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[file_id]` on the table `recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "recipe" DROP COLUMN "image_key",
ADD COLUMN     "file_id" INTEGER;

-- CreateTable
CREATE TABLE "file" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recipe_file_id_key" ON "recipe"("file_id");

-- AddForeignKey
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE CASCADE;
