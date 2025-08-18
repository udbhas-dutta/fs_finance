/*
  Warnings:

  - You are about to drop the column `nextrecurringDate` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."transactions" DROP COLUMN "nextrecurringDate",
ADD COLUMN     "nextRecurringDate" TIMESTAMP(3);
