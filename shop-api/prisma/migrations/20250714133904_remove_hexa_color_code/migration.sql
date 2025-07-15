/*
  Warnings:

  - You are about to drop the column `hexcode` on the `color` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "color_hexcode_key";

-- AlterTable
ALTER TABLE "color" DROP COLUMN "hexcode";
