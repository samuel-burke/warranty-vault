/*
  Warnings:

  - Added the required column `fileSize` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."AssetStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'MAINTENANCE', 'RETIRED');

-- CreateEnum
CREATE TYPE "public"."DocType" AS ENUM ('INVOICE', 'WARRANTY', 'MANUAL', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Asset" ADD COLUMN     "status" "public"."AssetStatus",
ADD COLUMN     "value" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "public"."Document" ADD COLUMN     "fileSize" INTEGER NOT NULL,
ADD COLUMN     "type" "public"."DocType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "avatar" TEXT;
