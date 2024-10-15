/*
  Warnings:

  - You are about to drop the column `email` on the `clientes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `clientes` DROP COLUMN `email`,
    ADD COLUMN `correo` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `infoempresa` MODIFY `logo` LONGBLOB NULL DEFAULT null;
