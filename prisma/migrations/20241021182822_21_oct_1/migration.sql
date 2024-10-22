/*
  Warnings:

  - Added the required column `medioPago` to the `Facturas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `facturas` DROP FOREIGN KEY `Facturas_idCliente_fkey`;

-- AlterTable
ALTER TABLE `facturas` ADD COLUMN `fechaModificacion` DATETIME(3) NULL,
    ADD COLUMN `idUsuarioCreacion` INTEGER NULL,
    ADD COLUMN `idUsuarioModificacion` INTEGER NULL,
    ADD COLUMN `medioPago` VARCHAR(191) NOT NULL,
    ADD COLUMN `nombreCliente` VARCHAR(191) NULL,
    MODIFY `idCliente` INTEGER NULL,
    MODIFY `fechaEmision` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `documentoJson` JSON NULL,
    MODIFY `observaciones` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `infoempresa` MODIFY `logo` LONGBLOB NULL DEFAULT null;
