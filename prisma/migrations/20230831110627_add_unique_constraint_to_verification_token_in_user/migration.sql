/*
  Warnings:

  - A unique constraint covering the columns `[verification_token]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_verification_token_key" ON "user"("verification_token");
