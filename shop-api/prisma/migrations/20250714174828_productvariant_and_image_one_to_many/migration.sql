/*
  Warnings:

  - You are about to drop the column `image_id` on the `productvariant` table. All the data in the column will be lost.
  - Added the required column `productvariant_id` to the `image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "productvariant" DROP CONSTRAINT "productvariant_image_id_fkey";

-- AlterTable
ALTER TABLE "image" ADD COLUMN     "productvariant_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "productvariant" DROP COLUMN "image_id";

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_productvariant_id_fkey" FOREIGN KEY ("productvariant_id") REFERENCES "productvariant"("productvariant_id") ON DELETE CASCADE ON UPDATE CASCADE;
