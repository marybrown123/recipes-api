/*
  Warnings:

  - You are about to drop the column `recipe_idcd` on the `recipe_preparation_steps` table. All the data in the column will be lost.
  - Added the required column `recipe_id` to the `recipe_preparation_steps` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "recipe_preparation_steps" DROP CONSTRAINT "recipe_preparation_steps_recipe_idcd_fkey";

-- AlterTable
ALTER TABLE "recipe_preparation_steps" DROP COLUMN "recipe_idcd",
ADD COLUMN     "recipe_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "recipe_preparation_steps" ADD CONSTRAINT "recipe_preparation_steps_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
