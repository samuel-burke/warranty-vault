/*
  Warnings:

  - You are about to drop the column `warrantyPeriodMonths` on the `Asset` table. All the data in the column will be lost.
  - Made the column `purchaseDate` on table `Asset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Asset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `value` on table `Asset` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Asset" DROP COLUMN "warrantyPeriodMonths",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "warrantyExpiration" TIMESTAMP(3),
ALTER COLUMN "purchaseDate" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "value" SET NOT NULL;
