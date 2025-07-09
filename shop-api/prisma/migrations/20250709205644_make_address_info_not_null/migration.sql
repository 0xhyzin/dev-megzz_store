/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `address` will be added. If there are existing duplicate values, this will fail.
  - Made the column `governorate_city` on table `address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `street` on table `address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `building_name_number` on table `address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `apartment_number` on table `address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `additional_details` on table `address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "address" ALTER COLUMN "governorate_city" SET NOT NULL,
ALTER COLUMN "street" SET NOT NULL,
ALTER COLUMN "building_name_number" SET NOT NULL,
ALTER COLUMN "apartment_number" SET NOT NULL,
ALTER COLUMN "additional_details" SET NOT NULL;

-- AlterTable
ALTER TABLE "cart" ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "address_user_id_key" ON "address"("user_id");
