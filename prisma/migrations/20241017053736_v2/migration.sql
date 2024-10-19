/*
  Warnings:

  - You are about to drop the column `idUsuario` on the `infocaja` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `infocaja` DROP COLUMN `idUsuario`,
    ADD COLUMN `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `fechaModificacion` DATETIME(3) NULL,
    ADD COLUMN `idUsuarioCreacion` INTEGER NULL,
    ADD COLUMN `idUsuarioModificacion` INTEGER NULL,
    MODIFY `fechaApertura` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `fechaConsultaCaja` DATETIME(3) NULL,
    MODIFY `montoInicioCaja` DECIMAL(18, 5) NULL;

-- AlterTable
ALTER TABLE `infoempresa` MODIFY `logo` LONGBLOB NULL DEFAULT null;

-- AlterTable
ALTER TABLE `movimientos` MODIFY `fechaModificacion` DATETIME(3) NULL;
