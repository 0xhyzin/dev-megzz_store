/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `color` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "color_name_key" ON "color"("name");
