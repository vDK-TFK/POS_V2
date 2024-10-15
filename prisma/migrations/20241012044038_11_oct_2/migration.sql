/*
  Warnings:

  - The primary key for the `metas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `empleadoId` on the `metas` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `metas` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `metas` table. All the data in the column will be lost.
  - Added the required column `idEmpleado` to the `Metas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idMeta` to the `Metas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `metas` DROP FOREIGN KEY `Metas_empleadoId_fkey`;

-- AlterTable
ALTER TABLE `infoempresa` MODIFY `logo` LONGBLOB NULL DEFAULT null;

-- AlterTable
ALTER TABLE `metas` DROP PRIMARY KEY,
    DROP COLUMN `empleadoId`,
    DROP COLUMN `fecha`,
    DROP COLUMN `id`,
    ADD COLUMN `eliminado` BOOLEAN NULL,
    ADD COLUMN `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `fechaModificacion` DATETIME(3) NULL,
    ADD COLUMN `idEmpleado` INTEGER NOT NULL,
    ADD COLUMN `idMeta` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `idUsuarioCreacion` INTEGER NULL,
    ADD COLUMN `idUsuarioModificacion` INTEGER NULL,
    ADD PRIMARY KEY (`idMeta`);

-- AddForeignKey
ALTER TABLE `Metas` ADD CONSTRAINT `Metas_idEmpleado_fkey` FOREIGN KEY (`idEmpleado`) REFERENCES `Usuarios`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
